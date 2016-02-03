import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import {FBSDKAppEvents} from 'react-native-fbsdkcore'
import {connect} from 'react-redux/native';
import {share$, currentTime$} from '../../redux/modules/player.js';
import store from '../../redux/create.js';

class ShareButtons extends Component {

    static propTypes = {};

    static defaultProps = {};

    state = {
        recordStartTime: null,
        recording: false
    };

    shareEpisode() {
        let {podcastId, episodeId} = this.props;
        let time = currentTime$(store.getState());
        FBSDKAppEvents.logEvent('shared_episode', time, {
            podcastId,
            episodeId,
            time
        });
    }

    shareMoment() {
        let {podcastId, episodeId} = this.props;
        let time = currentTime$(store.getState());
        FBSDKAppEvents.logEvent('shared_moment_in_episode', time, {
            podcastId,
            episodeId,
            time
        });
    }

    startRecording() {
        //console.info('record start!')
        this.setState({recordStartTime: Date.now(), recording: true})
    }

    stopRecording() {
        //console.info('record stop!', Date.now() - this.state.recordStartTime)
        let duration = Date.now() - this.state.recordStartTime;
        if (duration > 150) {
            let {podcastId, episodeId} = this.props;
            let time = currentTime$(store.getState());
            FBSDKAppEvents.logEvent('shared_clip_from_episode', duration/1000, {
                podcastId,
                episodeId,
                time,
                duration
            });
        } else {
            alert('Hold this button down to record a bit of this episode.');
        }
        this.setState({recording: false});
    }

    render() {
        console.info(this.props);
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity style={styles.buttonWrapper} onPress={this.shareEpisode.bind(this)}>
                    <View style={styles.button}>
                        <Image source={require('image!share')}/>
                    </View>
                    <Text style={styles.caption}>SHARE</Text>
                    <Text style={styles.caption}>EPISODE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonWrapper} onPress={this.shareMoment.bind(this)}>
                    <View style={styles.button}>
                        <Image source={require('image!bigClock')}/>
                    </View>
                    <Text style={styles.caption}>SHARE</Text>
                    <Text style={styles.caption}>MOMENT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonWrapper} onPressIn={this.startRecording.bind(this)} onPressOut={this.stopRecording.bind(this)}>
                    <View style={[styles.button, this.state.recording && {backgroundColor: '#DB4B23'}]}>
                        <Image source={require('image!tape')}/>
                    </View>
                    <Text style={styles.caption}>SHARE</Text>
                    <Text style={styles.caption}>CLIP</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 56,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'transparent'
    },
    buttonWrapper: {
        alignItems: 'center'
    },
    button: {
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.28)',
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    caption: {
        fontFamily: 'System',
        fontSize: 12,
        color: '#7C7C7C',
        fontWeight: '200'
    }
});

export default connect(share$)(ShareButtons);