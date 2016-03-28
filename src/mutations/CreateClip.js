import Relay from 'react-relay';
import {getViewerId} from '../utils/relay';

export default class CreateClipMutation extends Relay.Mutation {

    static fragments = {
        episode: () => Relay.QL`
            fragment on Episode {
                id
            }
        `
    };

    getMutation() {
        return Relay.QL`mutation { createClip }`;
    }

    getVariables() {
        console.info(this.props)
        return {
            episodeId: this.props.episode.id,
            startTime: this.props.startTime,
            endTime: this.props.endTime
        }
    }

    getFatQuery() {
        return Relay.QL`
        fragment on CreateClipPayload {
            clip
        }`;
    }

    // TODO - implement node create config?
    getConfigs() {
        return [{
            type: 'REQUIRED_CHILDREN',
            children: [Relay.QL`
            fragment on CreateClipPayload {
                clip {
                    id
                }
            }
            `]
        }];
    }
}