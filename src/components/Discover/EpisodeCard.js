import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import colors from '../../colors';
import TouchableFade from '../common/TouchableFade';
import {playEpisode} from '../../redux/modules/player.js';
import store from '../../redux/create.js';

class EpisodeCard extends Component {

    playEpisode() {
        store.dispatch(playEpisode(this.props.episode.id))
    }

    render() {
        let episode = this.props.episode;
        let podcast = episode.podcast;
        return (
            <TouchableFade
                style={[styles.wrapper, this.props.style]}
                underlayColor="#303030"
                onPress={this.playEpisode.bind(this)}
            >
                <Image style={styles.artwork} source={{uri: podcast.artwork}} />

                <View style={styles.info}>
                    <Text numberOfLines={1} style={styles.episodeTitle}>{episode.title}</Text>
                    <Text numberOfLines={1} style={styles.podcastName}>{podcast.name}</Text>
                </View>
            </TouchableFade>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        height: 64,
        flexDirection: 'row',
        borderRadius: 6,
        overflow: 'hidden',
        backgroundColor: colors.darkGreyLightContrast
    },
    artwork: {
        alignSelf: 'stretch',
        width: 64,
        backgroundColor: '#656565'
    },
    info: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        paddingLeft: 12,
        paddingRight: 12
    },
    episodeTitle: {
        color: colors.lightGrey,
        backgroundColor: 'transparent',
        fontSize: 16,
        fontFamily: 'System',
        fontWeight: '500',
        letterSpacing: 0.3,
        marginBottom: 4
    },
    podcastName: {
        color: colors.lightGrey,
        backgroundColor: 'transparent',
        fontSize: 14,
        fontFamily: 'System',
        fontWeight: '300',
        letterSpacing: 0.3
    }
});

export default Relay.createContainer(EpisodeCard, {

    initialVariables: {
        size: 'large'
    },

    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                id
                title
                podcast {
                    id
                    name
                    artwork(size:$size)
                }
            }
        `
    }
})