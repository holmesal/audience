import Relay from 'react-relay';

export default class extends Relay.Route {

    static routeName = 'PodcastRoute';

    static paramDefinitions = {
        podcastId: {
            required: true
        }
    };

    static queries = {
        podcast: () => Relay.QL`query { node(id: $podcastId) }`,
    };
}
