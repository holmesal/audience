import Relay from 'react-relay';
import {getViewerId} from '../utils/relay';

export default class SubscribeToPodcastMutation extends Relay.Mutation {

    static fragments = {
        podcast: () => Relay.QL`
            fragment on Podcast {
                id
                viewerIsSubscribed
            }
        `
    };

    getMutation() {
        return this.props.podcast.viewerIsSubscribed ?
            Relay.QL`mutation { unsubscribeFromPodcast }` :
            Relay.QL`mutation { subscribeToPodcast }`
    }

    getVariables() {
        return {
            podcastId: this.props.podcast.id
        }
    }

    getFatQuery() {
        return this.props.podcast.viewerIsSubscribed ?
            Relay.QL`
            fragment on UnsubscribeFromPodcastPayload {
                podcast {
                    viewerIsSubscribed
                }
                viewer {
                    subscriptions
                }
            }` :
            Relay.QL`
            fragment on SubscribeToPodcastPayload {
                podcast {
                    viewerIsSubscribed
                }
                viewer {
                    subscriptions
                }
            }`
    }

    getConfigs() {
        return [{
            type: 'FIELDS_CHANGE',
            fieldIDs: {
                podcast: this.props.podcast.id,
                viewer: getViewerId()
            }
        }]
    }

    getOptimisticResponse() {
        return {
            podcast: {
                viewerIsSubscribed: !this.props.podcast.viewerIsSubscribed
            }
        }
    }
}