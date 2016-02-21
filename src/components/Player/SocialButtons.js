import React, {
    ActionSheetIOS,
    AlertIOS,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    VibrationIOS,
    View
} from 'react-native';

import {FBSDKAppEvents} from 'react-native-fbsdkcore'
import Mixpanel from 'react-native-mixpanel';
import {connect} from 'react-redux/native';
import {share$, currentTime$} from '../../redux/modules/player.js';
import store from '../../redux/create.js';
import {getViewer} from '../../utils/auth';
import {episodeShareLink} from '../../utils/urls';

class SocialButtons extends Component {

    static propTypes = {};

    static defaultProps = {};

    state = {
        composeVisible: false,
        comment: null
    };

    recommend() {
        let {podcastId, episodeId} = this.props;
        console.info('todo - add recommendation');
        AlertIOS.prompt(
            'Add a comment?',
            'This is optional.',
            [
                {text: 'Recommend', onPress: this.recommendMutation, style: 'default'},
            ]
        )
    }

    recommendMutation(text) {
        console.info('recommending', text)
    }

    share() {
        let {podcastId, episodeId} = this.props;
        let {id: userId} = getViewer();
        let episodeTime = Math.round(currentTime$(store.getState()));
        // Build the episode link
        const url = episodeShareLink(podcastId, episodeId, userId);
        // Show the share sheet
        ActionSheetIOS.showShareActionSheetWithOptions({
                url
            },
            err => console.error,
            (success, method) => {
                if (success) {
                    console.info('shared episode via ', method);
                    Mixpanel.trackWithProperties('Shared episode link via share sheet', {
                        method
                    });
                }
            }
        );
        Mixpanel.trackWithProperties('Pressed share episode button', {
            podcastId,
            episodeId,
            episodeTime
        });
    }

    reaction() {
        let {podcastId, episodeId} = this.props;
        let episodeTime = Math.round(currentTime$(store.getState()));
        Mixpanel.trackWithProperties('Leave Reaction', {
            podcastId,
            episodeId,
            episodeTime
        });
        VibrationIOS.vibrate();
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <TouchableOpacity style={styles.buttonWrapper} onPress={this.recommend.bind(this)}>
                    <View style={styles.button}>
                        <Text style={{fontSize: 30}}>👍</Text>
                    </View>
                    <Text style={styles.caption}>RECOMMEND</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonWrapper} onPress={this.share.bind(this)}>
                    <View style={styles.button}>
                        <Image style={styles.icon} source={require('image!share')}/>
                    </View>
                    <Text style={styles.caption}>SHARE</Text>
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