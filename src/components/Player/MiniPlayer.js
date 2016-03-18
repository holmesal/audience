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

import colors from '../../colors';
import Icon from 'react-native-vector-icons/Ionicons';

class MiniPlayer extends Component {

    static propTypes = {

    };

    static defaultProps = {

    };

    togglePlayer() {
        store.dispatch(hidePlayer());
    }

    render() {
        return (
            <View style={styles.wrapper}>

                <TouchableOpacity style={styles.button}>
                    <Icon name="ios-heart-outline" size={24} color={colors.lighterGrey} />
                </TouchableOpacity>

                <View style={styles.textWrapper}>
                    <Text style={styles.title} numberOfLines={1}>{this.props.episode.title}</Text>
                    <Text style={styles.podcast} numberOfLines={1}>{this.props.episode.podcast.name}</Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={this.togglePlayer.bind(this)}>
                    <Icon name="ios-arrow-down" size={24} color={colors.lighterGrey} />
                </TouchableOpacity>

            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch',
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2D2D2D'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },
    textWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: 'System',
        fontWeight: '600',
        color: colors.lightGrey,
        letterSpacing: 0.6,
        marginBottom: 2,
        alignSelf: 'stretch',
        textAlign: 'center'
    },
    podcast: {
        fontFamily: 'System',
        fontWeight: '400',
        fontSize: 12,
        color: colors.lightGrey,
        letterSpacing: 0.6,
        alignSelf: 'stretch',
        textAlign: 'center'
    }
});

export default Relay.createContainer(MiniPlayer, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                id
                viewerHasRecommended
                title
                podcast {
                    id
                    name
                }
            }
        `
    }
});