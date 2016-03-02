import Relay from 'react-relay';
import {getViewerId} from '../utils/relay';

export default class ListenToEpisodeMutation extends Relay.Mutation {

    getMutation() {
        return Relay.QL`mutation { listenToEpisode }`
    }

    getVariables() {
        return {
            episodeId: this.props.episodeId
        }
    }

    getFatQuery() {
        return Relay.QL`
        fragment on ListenToEpisodePayload {
            episode {
                viewerHasHeard
            }
        }`;
    }

    getConfigs() {
        return [{
            type: 'FIELDS_CHANGE',
            fieldIDs: {
                episode: this.props.episodeId
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