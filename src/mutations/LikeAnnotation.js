import Relay from 'react-relay';
import {getViewerId} from '../utils/relay';

export default class LikeAnnotationMutation extends Relay.Mutation {

    static fragments = {
        annotation: () => Relay.QL`
            fragment on Annotation {
                id
                viewerHasLiked
            }
        `
    };

    getMutation() {
        return this.props.annotation.viewerHasLiked ?
            Relay.QL`mutation { unlikeAnnotation }` :
            Relay.QL`mutation { likeAnnotation }`;
    }

    getVariables() {
        return {
            annotationId: this.props.annotation.id
        }
    }

    getFatQuery() {
        return this.props.annotation.viewerHasLiked ?
        Relay.QL`
        fragment on UnlikeAnnotationPayload {
            annotation {
                viewerHasLiked
            }
        }` :
        Relay.QL`
        fragment on LikeAnnotationPayload {
            annotation {
                viewerHasLiked
            }
        }`;
    }

    getConfigs() {
        return [{
            type: 'FIELDS_CHANGE',
            fieldIDs: {
                annotation: this.props.annotation.id
            }
        }]
    }

    getOptimisticResponse() {
        return {
            annotation: {
                id: this.props.annotation.id,
                viewerHasLiked: !this.props.annotation.viewerHasLiked
            }
        }
    }
}