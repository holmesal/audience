import React, {
    Animated,
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

class RecordButton extends Component {

    static propTypes = {};

    static defaultProps = {};

    state = {
        startTime: null,
        endTime: null,
        inFlight: true,
        opacity: new Animated.Value(1)
    };

    componentDidUpdate(prevProps, prevState) {
        //console.info('update!', this.props);
        if (this.state.inFlight) {
            this.fadeOutAndIn()
        }
    }

    fadeOutAndIn() {
        Animated.timing(this.state.opacity, {
            toValue: 0.3
        }).start(() => {
            if (!this.props.sendingComment) {
                Animated.spring(this.state.opacity, {
                    toValue: 1
                }).start()
            } else {
                Animated.timing(this.state.opacity, {
                    toValue: 0.5
                }).start((s) => {
                    this.fadeOutAndIn();
                })
            }
        })
    }

    startRecording() {
        if (this.state.inFlight) return false;
        //PFAudio.startRecording();
        let startTime = _.round(currentTime$(store.getState()), 1);
        this.setState({startTime});
    }

    endRecording() {
        let endTime = _.round(currentTime$(store.getState()), 1);
        this.setState({endTime, inFlight: true});
        this.createClip();
    }

    createClip(filepath) {
        console.info('creating clip!', filepath, this.state);
        let {startTime, endTime} = this.state;
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
                console.info(res);
                let clipId = res.createClip.clip.id;
                this.openShareSheet(clipId);
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
            inFlight: false
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
                <Animated.Image
                    style={[styles.buttonImage, {
                        opacity: this.state.opacity
                    }]}
                    source={require('image!buttonRecord')}>

                </Animated.Image>
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