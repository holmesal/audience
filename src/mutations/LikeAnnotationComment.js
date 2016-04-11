import Relay from 'react-relay';
import {getViewerId} from '../utils/relay';

export default class LikeAnnotationCommentMutation extends Relay.Mutation {

    static fragments = {
        annotationComment: () => Relay.QL`
            fragment on AnnotationComment {
                id
                viewerHasLiked
                likeCount
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
                likeCount
            }
        }` :
        Relay.QL`
        fragment on LikeAnnotationCommentPayload {
            annotationComment {
                viewerHasLiked
                likeCount
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
        const {viewerHasLiked} = this.props.annotationComment;
        return {
            annotationComment: {
                id: this.props.annotationComment.id,
                viewerHasLiked: !viewerHasLiked,
                likeCount: viewerHasLiked ? this.props.annotationComment.likeCount - 1 : this.props.annotationComment.likeCount + 1
            }
        }
    }
}