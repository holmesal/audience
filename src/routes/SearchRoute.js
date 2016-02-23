import Relay from 'react-relay';

export default class extends Relay.Route {

    static routeName = 'SearchRoute';

    static paramDefinitions = {
        text: {
            required: true
        }
    };

    static queries = {
        search: () => Relay.QL`query { search(text: $text) }`,
    };
}
