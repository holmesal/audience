import React, {
    ActionSheetIOS,
    Component,
    DeviceEventEmitter,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {PFAudio, RNUploader} from 'NativeModules';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Relay from 'react-relay';
import colors from '../../colors';
import {getViewerId} from '../../utils/relay';
import CreateClipMutation from '../../mutations/CreateClip';
import {currentTime$} from '../../redux/modules/player';
import store from '../../redux/create';
import {clipShareLink} from '../../utils/urls';

/**
 * Upload flow works like this:
 * 1) Audio file is generated and stored in /tmp/rando-filename.mp3. This filename is passed in the callback.
 * 2) A `createClip` mutation is fired off.
 * 3) A signed upload request is returned in the query response to this mutation.
 *    The filename will be the id of the created Clip node
 * 4) The file is posted to s3 using the returned signed request.
 * 5) On completion, the share sheet is opened
 */

class RecordButton extends Component {

    static propTypes = {};

    static defaultProps = {};

    state = {
        startTime: null,
        endTime: null,
        uploading: false,
        uploadProgress: 0
    };

    componentDidMount() {
        //console.info(require('image!15step'));
        DeviceEventEmitter.addListener('RNUploaderProgress', (data) => {
            let {progress} = data;
            console.info('upload progress: ', progress);
        })
    }

    startRecording() {
        PFAudio.startRecording();
        let startTime = _.round(currentTime$(store.getState()), 1);
        this.setState({startTime});
    }

    endRecording() {
        let endTime = _.round(currentTime$(store.getState()), 1);
        this.setState({endTime, uploading: true});
        PFAudio.stopRecording((err, filepath) => {
            console.info('got filepath!', filepath);
            //alert(`got filepath: ${filepath}`);
            this.createClip(filepath);
        });
    }

    createClip(filepath) {
        console.info('creating clip!', filepath, this.state);
        filepath = '15stepcut.mp3';
        let {startTime, endTime} = this.state;
        console.info(startTime, endTime);
        // Create a new clip via a graphql mutation
        Relay.Store.commitUpdate(new CreateClipMutation({
            episode: this.props.episode,
            startTime,
            endTime
        }), {
            onFailure: (transaction) =>  {
                console.error(transaction.getError());
                alert('Error - could not create clip');
                this.reset();
            },
            onSuccess: (res) => {
                console.info('successfully created clip', res);
                let clipId = res.createClip.clip.id;
                //// Upload the clip to s3
                //let opts = {
                //    url: res.createClip.signedRequest,
                //    method: 'PUT',
                //    headers: {
                //        'x-amz-acl': 'public-read'
                //    },
                //    files: [{
                //        filename: `${res.createClip.clip.id}.mp3`,
                //        filepath: filepath,
                //        filetype: 'audio/mpeg'
                //    }]
                //};
                //console.info('uploading with opts: ', opts);
                ////RNUploader.upload(opts, (err, response) => {
                ////    if (err) console.error(err);
                ////    console.info('aws s3 response', response)
                ////});

                // This doesn't bring the file over to JS land
                let xhr = new XMLHttpRequest();
                xhr.open('PUT', res.createClip.signedRequest);
                // Possibly important
                xhr.setRequestHeader('x-amx-acl', 'public-read');

                // Open the share sheet on completion
                xhr.onload = () => {
                    console.info('transfer completed!', xhr);
                    this.openShareSheet(clipId)
                };
                // Reset on fail
                xhr.onerror = () => {
                    console.error('oh no', xhr);
                    alert('error uploading your clip :-(');
                    this.reset();
                };
                xhr.onreadystatechange = function(ev) {
                    console.info('ready state change', ev);
                };
                // Listen for progress events
                xhr.upload.onprogress = ev => {
                    console.info(ev)
                    if (ev.lengthComputable) {
                        this.setState({
                            uploadProgress: ev.loaded / ev.total
                        });
                    }
                };

                // Grab the file
                let file = {
                    uri: filepath,
                    type: 'audio/mpeg',
                    name: `${clipId}.mp3`
                };
                // Start the transfer
                xhr.send(file);
            }
        });
    }

    openShareSheet(clipId) {
        let url = clipShareLink(clipId);
        ActionSheetIOS.showShareActionSheetWithOptions({
            url,
            message: `A clip from "${this.props.episode.title}" - ${this.props.episode.podcast.name}`
        },
        error => {
            console.error(error);
            this.reset();
        },
        (success, method) => {
            console.info(`shared via ${method}`);
            this.reset();
        })
    }

    reset() {
        this.setState({
            startTime: null,
            endTime: null,
            uploadProgress: 0,
            uploading: false
        });
    }

    renderProgress() {
        let size = 40;
        if (!this.state.uploading) return <View />
        return (
            <View style={{width: size, height: size, backgroundColor: '#F0F0F0', top: 26, left: 25}}>
                <AnimatedCircularProgress
                    size={40}
                    width={10}
                    rotation={0}
                    fill={this.state.uploadProgress * 80 + 20}
                    tintColor="#CF5656"
                    backgroundColor="#F0F0F0" />
            </View>
        )
    }

    render() {
        return (
            <TouchableOpacity
                onPressIn={this.startRecording.bind(this)}
                onPressOut={this.endRecording.bind(this)}
            >
                <Image style={styles.buttonImage} source={require('image!buttonRecord')}>
                    {this.renderProgress()}
                </Image>
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    buttonImage: {
        width: 90,
        height: 90,
        position: 'relative'
    }
});

export default Relay.createContainer(RecordButton, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                id
                title
                ${CreateClipMutation.getFragment('episode')}
                podcast {
                    name
                }
            }
        `
    }
});