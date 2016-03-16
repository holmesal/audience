import React, {
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

    showPodcast() {
        // Hide the player
        store.dispatch(hidePlayer());
        // Show this show in the podcast info view
        store.dispatch(showPodcastInfo(this.props.podcast.id));
    }

    render() {
        return (
            <NavbarButton onPress={this.showPodcast.bind(this)}>
                <Image style={styles.image} source={{uri: this.props.podcast.artwork}} />
            </NavbarButton>
        );
    }
}

let styles = StyleSheet.create({
    image: {
        width: 24,
        height: 24,
        borderRadius: 24/2
    }
});

export default Relay.createContainer(MoreButton, {
    initialVariables: {
        size: 'small'
    },
    fragments: {
        podcast: () => Relay.QL`
            fragment on Podcast {
                id
                artwork(size:$size)
            }
        `
    }
});