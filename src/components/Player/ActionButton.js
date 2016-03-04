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

import Icon from 'react-native-vector-icons/Ionicons';

class ActionButton extends Component {

    static propTypes = {};

    static defaultProps = {};

    showActions() {
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
            <TouchableOpacity style={styles.wrapper} onPress={this.showActions.bind(this)}>
                <Icon style={styles.icon} name="ios-more" size={32} color={colors.lightGrey}/>
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'transparent',
        width: 60,
        height: 60,
        position: 'absolute',
        top: 0,
        right: 0
    },
    icon: {
        position: 'absolute',
        top: 24,
        right: 20
    }
});

export default Relay.createContainer(ActionButton, {
    fragments: {
        podcast: () => Relay.QL`
            fragment on Podcast {
                id
            }
        `
    }
});