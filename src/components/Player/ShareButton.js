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
import {connect} from 'react-redux/native';
import {share$, currentTime$} from '../../redux/modules/player.js';
import store from '../../redux/create.js';

class ShareButton extends Component {

    static propTypes = {};

    static defaultProps = {};

    shareEpisode() {
        let {podcastId, episodeId} = this.props;
        let episodeTime = Math.round(currentTime$(store.getState()));
        Mixpanel.trackWithProperties('Share Episode', {
            podcastId,
            episodeId,
            episodeTime
        });
    }

    shareMoment() {
        let {podcastId, episodeId} = this.props;
        let episodeTime = Math.round(currentTime$(store.getState()));
        Mixpanel.trackWithProperties('Share Moment (in episode)', {
            podcastId,
            episodeId,
            episodeTime
        });
    }

    shareClip() {
        let {podcastId, episodeId} = this.props;
        let episodeTime = Math.round(currentTime$(store.getState()));
        Mixpanel.trackWithProperties('Share Clip (from episode)', {
            podcastId,
            episodeId,
            episodeTime
            //duration: duration/1000
        });
    }

    recommend() {
        let {podcastId, episodeId} = this.props;
        let episodeTime = Math.round(currentTime$(store.getState()));
        Mixpanel.trackWithProperties('Recommend Episode', {
            podcastId,
            episodeId,
            episodeTime
            //duration: duration/1000
        });
    }

    showShareChoices() {
        let options = [
            'Share entire episode',
            'Share current moment',
            'Record and share a clip',
            'Recommend to friends',
            'Cancel'
        ];
        ActionSheetIOS.showActionSheetWithOptions({
            options,
            cancelButtonIndex: 4
        }, (idx) => {
            if (idx === 0) this.shareEpisode();
            else if (idx === 1) this.shareMoment();
            else if (idx === 2) this.shareClip();
            else if (idx === 3) this.recommend();
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

export default connect(share$)(ShareButton);