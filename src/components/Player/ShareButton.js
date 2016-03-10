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
import Relay from 'react-relay';

import Mixpanel from 'react-native-mixpanel';
import {connect} from 'react-redux';
import {currentTime$} from '../../redux/modules/player.js';
import store from '../../redux/create.js';
import colors from '../../colors';
import NavbarButton from './NavbarButton';
import Icon from 'react-native-vector-icons/Ionicons';

import {episodeShareLink} from '../../utils/urls';
import {getViewerId} from '../../utils/relay';

class ShareButton extends Component {

    static propTypes = {};

    static defaultProps = {};

    shareEpisode() {
        let episodeTime = Math.round(currentTime$(store.getState()));
        let viewerId = getViewerId();
        // Build the episode link
        const url = episodeShareLink(this.props.podcast.id, this.props.episode.id, viewerId);
        //console.info(url, episodeTime)
        // Show the share sheet
        ActionSheetIOS.showShareActionSheetWithOptions({
            url
        },
            err => console.error,
            (success, method) => {
                if (success) {
                    console.info('shared episode via ', method);
                    Mixpanel.trackWithProperties('Shared episode link via share sheet', {
                        episode: this.props.episode.id,
                        method
                    });
                }
            }
        );
        Mixpanel.trackWithProperties('Pressed share episode button', {
            episode: this.props.episode.id,
            episodeTime
        });
    }

    render() {
        return (
            <NavbarButton onPress={this.shareEpisode.bind(this)}>
                <Icon name="ios-upload-outline" color={colors.darkGrey} size={28}/>
            </NavbarButton>
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

let connectedShareButton = connect()(ShareButton);

export default Relay.createContainer(connectedShareButton, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                id
            }
        `,
        podcast: () => Relay.QL`
            fragment on Podcast {
                id
            }
        `
    }
});