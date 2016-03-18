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
import colors from '../../colors';
import store from '../../redux/create.js';
import {currentTime$} from '../../redux/modules/player.js';
import {episodeShareLink} from '../../utils/urls';
import {getViewerId} from '../../utils/relay';
import Mixpanel from 'react-native-mixpanel';

import Icon from 'react-native-vector-icons/Ionicons'

export default class ShareMomentButton extends Component {

    static propTypes = {};

    static defaultProps = {};

    share() {
        let episodeTime = Math.round(currentTime$(store.getState()));
        let viewerId = getViewerId();
        console.info(episodeTime)
        // Build the episode link
        const url = episodeShareLink(this.props.episode.podcast.id, this.props.episode.id, viewerId, episodeTime);
        console.info(url);
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
            <TouchableOpacity
                onPress={this.share.bind(this)}
            >
                <Image style={styles.buttonImage} source={require('image!buttonShare')} />
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    buttonImage: {
        width: 90,
        height: 90
    }
});

export default Relay.createContainer(ShareMomentButton, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                id
                podcast {
                    id
                }
            }
        `
    }
});