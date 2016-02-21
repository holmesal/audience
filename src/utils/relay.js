import Relay from 'react-relay';
import store from '../redux/create';
import {viewerId$} from '../redux/modules/auth';

const graphqlURL = __DEV__ ? 'http://localhost:5000/graphql' : 'http://podcastfoo.herokuapp.com/graphql';

const DEBUG_TOKEN = 'CAANMZBBpQDs4BAJvxvyZCTNbCCx5ao0sjuUSSihZAgOVQcZBWVDnnZBy2F2inPYbB2igTp1ZCcdZCDWfkV8AF7jMJz5CZC3ZAkteocAnRqtVgIO3wcpaHEyrD3hDloJ901un1N4Vw62UNc5vZAiIP8JM6B2nwOg7NQ7yUMyZCb7y0ZCqIuNm5EZCFrGbPhZAzofd4W7rAZD';

Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer(graphqlURL)
);

export const updateRelayAuthHeader = (token) => {
    if (__DEV__ && DEBUG_TOKEN) {
        console.info('!!! USING DEBUG TOKEN !!!');
        token = DEBUG_TOKEN;
    }
    Relay.injectNetworkLayer(
        new Relay.DefaultNetworkLayer(graphqlURL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
    );
};

export const getViewerId = () => viewerId$(store.getState());