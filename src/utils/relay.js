import Relay from 'react-relay';

const graphqlURL = __DEV__ ? 'http://localhost:5000/graphql' : 'http://podcastfoo.herokuapp.com/graphql';

Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer(graphqlURL)
);

export const updateRelayAuthHeader = (token) => {
    Relay.injectNetworkLayer(
        new Relay.DefaultNetworkLayer(graphqlURL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
    );
};