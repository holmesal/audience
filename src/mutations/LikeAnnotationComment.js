import Relay from 'react-relay';
import {getViewerId} from '../utils/relay';

export default class LikeAnnotationCommentMutation extends Relay.Mutation {

    static fragments = {
        annotationComment: () => Relay.QL`
            fragment on AnnotationComment {
                id
                viewerHasLiked
            }
        `
    };

    getMutation() {
        return this.props.annotationComment.viewerHasLiked ?
            Relay.QL`mutation { unlikeAnnotationComment }` :
            Relay.QL`mutation { likeAnnotationComment }`;
    }

    getVariables() {
        return {
            annotationCommentId: this.props.annotationComment.id
        }
    }

    getFatQuery() {
        return this.props.annotationComment.viewerHasLiked ?
        Relay.QL`
        fragment on UnlikeAnnotationCommentPayload {
            annotationComment {
                viewerHasLiked
            }
        }` :
        Relay.QL`
        fragment on LikeAnnotationCommentPayload {
            annotationComment {
                viewerHasLiked
            }
        }`;
    }

    getConfigs() {
        return [{
            type: 'FIELDS_CHANGE',
            fieldIDs: {
                annotationComment: this.props.annotationComment.id
            }
        }]
    }

    getOptimisticResponse() {
        return {
            annotationComment: {
                id: this.props.annotationComment.id,
                viewerHasLiked: !this.props.annotationComment.viewerHasLiked
            }
        }
    }
}