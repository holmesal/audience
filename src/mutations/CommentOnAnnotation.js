import Relay from 'react-relay';

export default class CommentOnAnnotationMutation extends Relay.Mutation {

    static fragments = {
        annotation: () => Relay.QL`
            fragment on Annotation {
                id
            }
        `
    };

    getMutation() {
        return Relay.QL`mutation { commentOnAnnotation }`;
    }

    getVariables() {
        return {
            annotationId: this.props.annotation.id,
            text: this.props.text
        }
    }

    getFatQuery() {
        return Relay.QL`
            fragment on CommentOnAnnotationPayload {
                annotationComment
                annotation {
                    comments
                }
                user {
                    annotationComments
                }
            }
        `;
    }

    getConfigs() {
        return [
            {
                type: 'FIELDS_CHANGE',
                fieldIDs: {
                    annotation: this.props.annotation.id
                }
            },
            // WANT TO ADD THIS, but it keeps complaining that "comments" is a non-connection field
            //{
            //    type: 'RANGE_ADD',
            //    parentName: 'annotation',
            //    parentID: this.props.annotation.id,
            //    connectionName: 'comments',
            //    edgeName: 'annotationComment',
            //    rangeBehaviors: {
            //        '': 'append'
            //    }
            //}
        ]
    }

    //getOptimisticResponse() {
    //    console.info(this.props.annotation);
    //    const annotationComment = {
    //        annotation: this.props.annotation,
    //        text: this.props.text
    //    };
    //    return {
    //        annotationComment,
    //        //annotation: {
    //        //    comments: [annotationComment]
    //        //}
    //    }
    //}
}