import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import TouchableFade from '../buttons/TouchableFade';
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
        overflow: 'hidden'
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
        paddingRight: 12,
        //backgroundColor: 'red',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderRadius: 6,
        borderColor: '#656565',
    },
    episodeTitle: {
        color: '#fefefe',
        fontSize: 16,
        fontFamily: 'System',
        fontWeight: '600',
        marginBottom: 4
    },
    podcastName: {
        color: '#7C7C7C',
        fontSize: 14,
        fontFamily: 'System',
        fontWeight: '300'
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