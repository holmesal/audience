import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    StatusBarIOS,
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

class Navbar extends Component {

    static propTypes = {};

    static defaultProps = {};

    componentDidMount() {
        StatusBarIOS.setStyle('default');
    }

    close() {
        store.dispatch(hidePlayer());
    }

    recommend() {
        if (!this.props.episode.viewerHasRecommended) {

        }
    }

    share() {

    }

    more() {

    }

    render() {
        const iconSize = 28;
        return (
            <View style={styles.wrapper}>

                <NavbarButton onPress={this.close.bind(this)}>
                    <Icon name="ios-arrow-down" color={colors.darkGrey} size={iconSize}/>
                </NavbarButton>

                <View style={{flex: 1}} />

                <NavbarButton onPress={this.share.bind(this)}>
                    <Icon name="ios-upload-outline" color={colors.darkGrey} size={iconSize}/>
                </NavbarButton>

                <RecommendButton
                    episode={this.props.episode}
                />

                <NavbarButton onPress={this.more.bind(this)}>
                    <Icon name="ios-more" color={colors.darkGrey} size={iconSize}/>
                </NavbarButton>

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
        borderColor: colors.lightBorder,
        height: 66
    }
});

export default Relay.createContainer(Navbar, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                ${RecommendButton.getFragment('episode')}
            }
        `
    }
});