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

import store from '../../redux/create';
import {hidePlayer} from '../../redux/modules/player';
import {showPodcastInfo} from '../../redux/modules/podcastInfo';
import colors from '../../colors';
import NavbarButton from './NavbarButton';

import Icon from 'react-native-vector-icons/Ionicons';

class MoreButton extends Component {

    static propTypes = {};

    static defaultProps = {};

    showActions() {
        console.info(this, window)
        ActionSheetIOS.showActionSheetWithOptions({
            options: [
                'View show',
                'Cancel'
            ],
            cancelButtonIndex: 1
        }, idx => {
            if (idx === 0) {
                // Hide the player
                store.dispatch(hidePlayer());
                // Show this show in the podcast info view
                store.dispatch(showPodcastInfo(this.props.podcast.id));
            }
        })
    }

    render() {
        return (
            <NavbarButton onPress={this.showActions.bind(this)}>
                <Icon name="ios-more" size={28} color={colors.darkGrey}/>
            </NavbarButton>
        );
    }
}

let styles = StyleSheet.create({
});

export default Relay.createContainer(MoreButton, {
    fragments: {
        podcast: () => Relay.QL`
            fragment on Podcast {
                id
            }
        `
    }
});