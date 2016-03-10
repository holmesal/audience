import Relay from 'react-relay';
import {getViewerId} from '../utils/relay';

export default class RecommendEpisodeMutation extends Relay.Mutation {

    static fragments = {
        episode: () => Relay.QL`
            fragment on Episode {
                id
            }
        `
    };

    getMutation() {
        return Relay.QL`mutation { recommendEpisode }`;
    }

    getVariables() {
        return {
            episodeId: this.props.episode.id,
            review: this.props.review
        }
    }

    getFatQuery() {
        return Relay.QL`
        fragment on RecommendEpisodePayload {
            episode {
                viewerHasRecommended
            }
            viewer {
                recommendations
            }
        }`;
    }

    getConfigs() {
        return [{
            type: 'FIELDS_CHANGE',
            fieldIDs: {
                episode: this.props.episode.id,
                viewer: getViewerId()
            }
        }]
    }

    getOptimisticResponse() {
        return {
            episode: {
                id: this.props.episode.id,
                viewerHasRecommended: true
            }
        }
    }
}