import Relay from 'react-relay';

export default class AnnotateEpisodeMutation extends Relay.Mutation {

    static fragments = {
        episode: () => Relay.QL`
            fragment on Episode {
                id
            }
        `
    };

    getMutation() {
        return Relay.QL`mutation { annotateEpisode }`;
    }

    getVariables() {
        return {
            episodeId: this.props.episode.id,
            text: this.props.text,
            time: this.props.time
        }
    }

    getFatQuery() {
        return Relay.QL`
            fragment on AnnotateEpisodePayload {
                episode {
                    annotations
                }
            }
        `;
    }

    getConfigs() {
        return [
            {
                type: 'FIELDS_CHANGE',
                fieldIDs: {
                    episode: this.props.episode.id
                }
            },
            // WANT TO ADD THIS, but rangeBehaviors seems to suggest that it would be difficult to insert this annotation
            // in the middle
            //{
            //    type: 'RANGE_ADD',
            //    parentID: this.props.episode.id,
            //    connectionName: 'annotations',
            //    edgeName: 'annotation',
            //    rangeBehaviors: {}
            //}
        ]
    }

    //getOptimisticResponse() {
    //    return {
    //        annotation: {
    //            episode: this.props.episode,
    //            text: this.props.text,
    //            time: this.props.time,
    //        }
    //    }
    //}
}