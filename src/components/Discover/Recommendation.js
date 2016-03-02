import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import EpisodeCard from './EpisodeCard';

class Recommendation extends Component {

    renderReview() {
        if (this.props.recommendation.review) {
            return (
                <Text style={styles.review}>"{this.props.recommendation.review}"</Text>
            )
        }
    }

    render() {
        const photoUrl = `http://graph.facebook.com/v2.5/${this.props.recommendation.user.facebookId}/picture?type=square&height=72`;
        let opacity = this.props.recommendation.episode.viewerHasHeard ? 0.3 : 1;
        return (
            <View style={[styles.wrapper, this.props.style, {opacity}]}>

                <View style={styles.topRow}>
                    <Image style={styles.recommenderPhoto} source={{uri: photoUrl}} />
                    <Text style={styles.recommender}>
                        <Text style={{fontWeight: '600'}}>{this.props.recommendation.user.displayName} </Text>
                        <Text>recommends:</Text>
                    </Text>
                </View>

                <EpisodeCard
                    episode={this.props.recommendation.episode}
                    style={styles.episodeCard}
                />
                {this.renderReview()}
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
    },
    review: {
        color: 'white',
        marginLeft: 36 + 12 + 12,
        marginRight: 12,
        fontSize: 14,
        marginTop: 12
    }
});

export default Relay.createContainer(Recommendation, {
    fragments: {
        recommendation: () => Relay.QL`
            fragment on Recommendation {
                user {
                    id
                    facebookId
                    displayName
                }
                episode {
                    id
                    viewerHasHeard
                    ${EpisodeCard.getFragment('episode')}
                }
                review
            }
        `
    }
})