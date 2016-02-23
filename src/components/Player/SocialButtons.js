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
import Relay from 'react-relay';

import CircleCaptionButton from './CircleCaptionButton';
import RecommendButton from './RecommendButton';

import {FBSDKAppEvents} from 'react-native-fbsdkcore'
import Mixpanel from 'react-native-mixpanel';
import {connect} from 'react-redux/native';
import {currentTime$} from '../../redux/modules/player.js';
import store from '../../redux/create.js';
import {getViewerId} from '../../utils/relay';
import {episodeShareLink} from '../../utils/urls';
import RecommendEpisodeMutation from '../../mutations/RecommendEpisode';

class SocialButtons extends Component {

    static propTypes = {};

    static defaultProps = {};

    state = {
        composeVisible: false,
        comment: null
    };

    share() {
        let podcastId = this.props.podcast.id;
        let episodeId = this.props.episode.id;
        let viewerId = getViewerId();
        let episodeTime = Math.round(currentTime$(store.getState()));
        // Build the episode link
        const url = episodeShareLink(podcastId, episodeId, viewerId);
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
    //
    //reaction() {
    //    let {podcastId, episodeId} = this.props;
    //    let episodeTime = Math.round(currentTime$(store.getState()));
    //    Mixpanel.trackWithProperties('Leave Reaction', {
    //        podcastId,
    //        episodeId,
    //        episodeTime
    //    });
    //    VibrationIOS.vibrate();
    //}

    render() {
        return (
            <View style={styles.wrapper}>
                <RecommendButton
                    episode={this.props.episode}
                    podcast={this.props.podcast}
                />
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

//let ConnectedSocialButtons = connect(share$)(SocialButtons);

export default Relay.createContainer(SocialButtons, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                id
                ${RecommendButton.getFragment('episode')}
            }
        `,
        podcast: () => Relay.QL`
            fragment on Podcast {
                id
                ${RecommendButton.getFragment('podcast')}
            }
        `
    }
});