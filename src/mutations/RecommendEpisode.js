import Relay from 'react-relay';
import {getViewerId} from '../utils/relay';

export default class RecommendEpisodeMutation extends Relay.Mutation {

    getMutation() {
        return Relay.QL`mutation { recommendEpisode }`;
    }

    getVariables() {
        return {
            episodeId: this.props.episodeId,
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
                episode: this.props.episodeId,
                viewer: getViewerId()
            }
        }]
    }

    getOptimisticResponse() {
        return {
            episode: {
                id: this.props.episodeId,
                viewerHasRecommended: true
            }
        }
    }
}