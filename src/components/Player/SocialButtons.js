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
import Mixpanel from 'react-native-mixpanel';
import {connect} from 'react-redux/native';
import {share$, currentTime$} from '../../redux/modules/player.js';
import store from '../../redux/create.js';

class SocialButtons extends Component {

    static propTypes = {};

    static defaultProps = {};

    state = {
        recordStartTime: null,
        recording: false
    };

    reaction() {
        let {podcastId, episodeId} = this.props;
        let episodeTime = Math.round(currentTime$(store.getState()));
        Mixpanel.trackWithProperties('Leave Reaction', {
            podcastId,
            episodeId,
            episodeTime
        });
    }

    comment() {
        let {podcastId, episodeId} = this.props;
        let episodeTime = Math.round(currentTime$(store.getState()));
        Mixpanel.trackWithProperties('Leave Comment', {
            podcastId,
            episodeId,
            episodeTime
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
            let episodeTime = Math.round(currentTime$(store.getState()));
            Mixpanel.trackWithProperties('Share Clip (from episode)', {
                podcastId,
                episodeId,
                episodeTime,
                duration: duration/1000
            });
        } else {
            alert('Hold this button down to record a bit of this episode.');
        }
        this.setState({recording: false});
    }

//<TouchableOpacity style={styles.buttonWrapper} onPressIn={this.startRecording.bind(this)} onPressOut={this.stopRecording.bind(this)}>
//<View style={[styles.button, this.state.recording && {backgroundColor: '#DB4B23'}]}>
//<Image source={require('image!tape')}/>
//</View>
//<Text style={styles.caption}>SHARE</Text>
//<Text style={styles.caption}>CLIP</Text>
//</TouchableOpacity>

    render() {
        console.info(this.props);
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity style={styles.buttonWrapper} onPress={this.reaction.bind(this)}>
                    <View style={styles.button}>
                        <Text style={{fontSize: 30}}>😁</Text>
                    </View>
                    <Text style={styles.caption}>LEAVE</Text>
                    <Text style={styles.caption}>REACTION</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonWrapper} onPress={this.comment.bind(this)}>
                    <View style={styles.button}>
                        <Text style={{fontSize: 30}}>💬</Text>
                    </View>
                    <Text style={styles.caption}>LEAVE</Text>
                    <Text style={styles.caption}>COMMENT</Text>
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

export default connect(share$)(SocialButtons);