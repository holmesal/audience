import React, {
    Animated,
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
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {showPlayer, hidePlayer, visible$} from '../../redux/modules/player';
import {showPodcastInfo} from '../../redux/modules/podcastInfo';
import RecommendButton from './RecommendButton';
import colors from '../../colors';
import Icon from 'react-native-vector-icons/Ionicons';

class MiniPlayer extends Component {

    state = {
        iconState: new Animated.Value(0)
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.props.visible != prevProps.visible) {
            const toValue = this.props.visible ? 0 : 1;
            Animated.spring(this.state.iconState, {
                toValue
            }).start()
        }
    }


    togglePlayer() {
        console.info('toggling player', this.props)
        if (this.props.visible) store.dispatch(hidePlayer());
        else store.dispatch(showPlayer());
    }

    showPodcast() {
        // Hide the player
        store.dispatch(hidePlayer());
        // Show this show in the podcast info view
        store.dispatch(showPodcastInfo(this.props.episode.podcast.id));
    }

    render() {
        return (
            <View style={styles.wrapper}>

                <RecommendButton
                    style={styles.button}
                    episode={this.props.episode}
                />

                <TouchableOpacity
                    style={styles.textWrapper}
                    onPress={this.showPodcast.bind(this)}
                >
                    <Text style={styles.title} numberOfLines={1}>{this.props.episode.title}</Text>
                    <Text style={styles.podcast} numberOfLines={1}>{this.props.episode.podcast.name}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={this.togglePlayer.bind(this)} activeOpacity={0.85}>
                    <Animated.View
                        style={{transform: [{
                        rotateZ: this.state.iconState.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '180deg']
                        })
                        }]}}
                    >
                        <Icon name="ios-arrow-down" size={24} color={colors.lighterGrey} />
                    </Animated.View>
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

const sel = createSelector(visible$, (visible) => ({
    visible
}));
const con = connect(sel)(MiniPlayer);

export default Relay.createContainer(con, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                id
                viewerHasRecommended
                title
                ${RecommendButton.getFragment('episode')}
                podcast {
                    id
                    name
                }
            }
        `
    }
});