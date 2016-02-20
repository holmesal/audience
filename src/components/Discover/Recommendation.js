import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

import EpisodeCard from './EpisodeCard';

export default class Recommendation extends Component {

    static propTypes = {};

    static defaultProps = {
        user: {
            id: '10153907632414490',
            displayName: 'Mystery User'
        },
        podcast: {
            id: 'some-podcast-id',
            name: 'Mystery Podcast',
            artwork: 'http://lorempixel.com/400/400'
        },
        episode: {
            id: 'some-episode-id',
            title: 'Mystery Episode'
        }
    };

    render() {
        const photoUrl = `http://graph.facebook.com/v2.5/${this.props.user.id}/picture?type=square&height=72`;
        return (
            <View style={[styles.wrapper, this.props.style]}>

                <View style={styles.topRow}>
                    <Image style={styles.recommenderPhoto} source={{uri: photoUrl}} />
                    <Text style={styles.recommender}>
                        <Text style={{fontWeight: '600'}}>{this.props.user.displayName} </Text>
                        recommends:
                    </Text>
                </View>

                <EpisodeCard
                    episode={this.props.episode}
                    podcast={this.props.podcast}
                    user={this.props.user}
                    style={styles.episodeCard}
                />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    topRow: {
        flexDirection: 'row',
        paddingLeft: 12,
        paddingRight: 12,
        alignItems: 'center',
        marginBottom: 12
    },
    recommenderPhoto: {
        width: 36,
        height: 36,
        borderRadius: 36/2
    },
    recommender: {
        fontFamily: 'System',
        fontSize: 16,
        color: 'white',
        marginLeft: 12,
        letterSpacing: 0.4
    },
    episodeCard: {
        marginLeft: 36 + 12 + 12,
        marginRight: 12
    }
});