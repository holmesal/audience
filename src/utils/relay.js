import {NativeModules} from 'react-native';
import Relay from 'react-relay';
import store from '../redux/create';
import {viewerId$} from '../redux/modules/auth';
let {MTDebugIP} = NativeModules;

const graphqlURL = __DEV__ ? `http://${MTDebugIP.debugIP}:5000/graphql` : 'http://podcastfoo.herokuapp.com/graphql';

console.info('graphQL url: ', graphqlURL);

// Ricky Bobby
const DEBUG_TOKEN = 'CAANMZBBpQDs4BAOfgLdloNJ3h3kTVjseoOrg0oyUgZArqxsgGJfB7FaM3ZADa7OuY7DPCucDAnCHbySP93yRYfJDE4AZAQz3oCed6tUFeZCVPJvyA2DmPUj9nKPZCi3mmchdRsvuBNT6kxdmiZBZAPcGSN2tRwGs79TjZAGWAUzS3RX8LzmK31lvZA';

// Carl Danger
//const DEBUG_TOKEN = 'CAANMZBBpQDs4BAEzhhxFnA22apKfhosZCsaHC9HacF89dpZAFzNSO29VCZB4ZC6Oir5bMPcVlvIRdMDOA09ZApcdZATvFUy6S9IJVyZBbUnOlTXyT7dSD8wbrBt2lvaReuYR1UdpmxCX96hgXU5ZB3IvpYk3qHMCEpst5gfQXR4viqFmHg7Jj5eunTL10qn5GEDoZD';

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