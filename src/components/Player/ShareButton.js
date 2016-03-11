import React, {
    ActionSheetIOS,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import Mixpanel from 'react-native-mixpanel';
import {connect} from 'react-redux';
import {currentTime$} from '../../redux/modules/player.js';
import store from '../../redux/create.js';

import {episodeShareLink} from '../../utils/urls';
import {getViewerId} from '../../utils/relay';

class ShareButton extends Component {

    static propTypes = {};

    static defaultProps = {};

    //shareMoment() {
    //    let {podcastId, episodeId} = this.props;
    //    let episodeTime = Math.round(currentTime$(store.getState()));
    //    Mixpanel.trackWithProperties('Share Moment (in episode)', {
    //        podcastId,
    //        episodeId,
    //        episodeTime
    //    });
    //}
    //
    //shareClip() {
    //    let {podcastId, episodeId} = this.props;
    //    let episodeTime = Math.round(currentTime$(store.getState()));
    //    Mixpanel.trackWithProperties('Share Clip (from episode)', {
    //        podcastId,
    //        episodeId,
    //        episodeTime
    //        //duration: duration/1000
    //    });
    //}


    shareEpisode() {
        let {podcastId, episodeId} = this.props;
        let episodeTime = Math.round(currentTime$(store.getState()));
        let viewerId = getViewerId();
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

    recommend() {
        let {podcastId, episodeId} = this.props;
        let episodeTime = Math.round(currentTime$(store.getState()));
        Mixpanel.trackWithProperties('Recommend Episode', {
            podcastId,
            episodeId,
            episodeTime
        });
    }

    showShareChoices() {
        let options = [
            'Recommend to friends',
            'Get share link',
            'Cancel'
        ];
        ActionSheetIOS.showActionSheetWithOptions({
            options,
            cancelButtonIndex: 2
        }, (idx) => {
            if (idx === 0) this.recommend();
            else if (idx === 1) this.shareEpisode();
        });
    }

    render() {
        return (
            <TouchableOpacity style={styles.wrapper} onPress={this.showShareChoices.bind(this)}>
                <Image style={styles.icon} source={require('image!share')}/>
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 80,
        height: 80,
        paddingTop: 20,
        backgroundColor: 'transparent'
    },
    icon: {
        position: 'absolute',
        right: 20,
        top: 30
    }
});

export default connect()(ShareButton);