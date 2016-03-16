import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    StatusBar,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import store from '../../redux/create';
import {hidePlayer} from '../../redux/modules/player';

import colors from '../../colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NavbarButton from './NavbarButton';

import RecommendButton from './RecommendButton';
import MoreButton from './MoreButton';
import ShareButton from './ShareButton';
import PodcastButton from './PodcastButton';

class Navbar extends Component {

    static propTypes = {};

    static defaultProps = {};

    componentDidMount() {
        StatusBar.setBarStyle('default');
    }

    close() {
        store.dispatch(hidePlayer());
    }

    share() {

    }

    render() {
        const iconSize = 28;
        return (
            <View style={[styles.wrapper, this.props.style]}>

                <NavbarButton onPress={this.close.bind(this)}>
                    <Icon name="ios-arrow-down" color={colors.lighterGrey} size={iconSize}/>
                </NavbarButton>

                <View style={{flex: 1}} />

                <ShareButton
                    episode={this.props.episode}
                    podcast={this.props.podcast}
                />

                <RecommendButton
                    episode={this.props.episode}
                />

                <PodcastButton
                    podcast={this.props.podcast}
                />

            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        paddingTop: 20,
        flexDirection: 'row',
        alignSelf: 'stretch',
        borderBottomWidth: 1,
        borderColor: colors.darkBorder,
        height: 66,
        backgroundColor: colors.darkGrey
    }
});

export default Relay.createContainer(Navbar, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                ${RecommendButton.getFragment('episode')}
                ${ShareButton.getFragment('episode')}
            }
        `,
        podcast: () => Relay.QL`
            fragment on Podcast {
                ${MoreButton.getFragment('podcast')}
                ${PodcastButton.getFragment('podcast')}
                ${ShareButton.getFragment('podcast')}
            }
        `
    }
});