import {NativeModules} from 'react-native';
import Relay from 'react-relay';
import store from '../redux/create';
import {viewerId$} from '../redux/modules/auth';
let {MTDebugIP} = NativeModules;
import {USE_STAGING, GRAPHQL_AUTHENTICATED_ROOT, GRAPHQL_PUBLIC_ROOT} from '../utils/urls';

console.info('graphQL public: ', GRAPHQL_PUBLIC_ROOT);

// Ricky Bobby
const DEBUG_TOKEN = 'EAANMZBBpQDs4BAJUaJORx8GvoJzVX6ZAnDz3NfTG9SkTaBPKh9AK6UV14W5yFJidf32rGrOlDjoIZBbIhpGnh2PzoMeEzbMDR4y3gZBxTi1hnJ1vcC5vrIlcxVM6JWb5k7oWSxouA2RhJGEtj3icNZA7ngoproqUZD';

// Carl Danger
//const DEBUG_TOKEN = 'EAANMZBBpQDs4BAJZBN7PiaSTR7Hrt1KbRYCzdeH3P1ZBjjn9gWADmP0ttCJx1J30diXQHvZBFfiobl7ceCnA5IToyR9n3VGnozix5lVXPpqsQpqJqpv2EJdbmYt7K9tU8CJ2ImtLlOn6XdimzInAoYVznky9wBAZD';

// Use token from facebook account on device
//const DEBUG_TOKEN = null;

Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer(GRAPHQL_PUBLIC_ROOT)
);

export const updateRelayAuthHeader = (token) => {
    if (__DEV__ && DEBUG_TOKEN && !USE_STAGING) {
        console.info('!!! USING DEBUG TOKEN !!!');
        token = DEBUG_TOKEN;
    }
    console.info(`switching to authenticated graphql endpoint: ${GRAPHQL_AUTHENTICATED_ROOT}`)
    Relay.injectNetworkLayer(
        new Relay.DefaultNetworkLayer(GRAPHQL_AUTHENTICATED_ROOT, {
          headers: {
            Authorization: `Bearer ${token}`
          },
            fetchTimeout: 30000,
            retryDelays: [5000, 10000, 15000]
        })
    );
};

export const getViewerId = () => viewerId$(store.getState());