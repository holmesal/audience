import {NativeModules} from 'react-native';
import Relay from 'react-relay';
import store from '../redux/create';
import {viewerId$} from '../redux/modules/auth';
let {MTDebugIP} = NativeModules;
import {USE_STAGING, GRAPHQL_ROOT} from '../utils/urls';

console.info('graphQL url: ', GRAPHQL_ROOT);

// Ricky Bobby
//const DEBUG_TOKEN = 'CAANMZBBpQDs4BAOfgLdloNJ3h3kTVjseoOrg0oyUgZArqxsgGJfB7FaM3ZADa7OuY7DPCucDAnCHbySP93yRYfJDE4AZAQz3oCed6tUFeZCVPJvyA2DmPUj9nKPZCi3mmchdRsvuBNT6kxdmiZBZAPcGSN2tRwGs79TjZAGWAUzS3RX8LzmK31lvZA';

// Carl Danger
const DEBUG_TOKEN = 'CAANMZBBpQDs4BAEJKRKNDKZAHfILmtfZBdZA2GNQI89ibcJKDq35s8HrJdZC3Tcq9ovN1i4GD74PP4ZCPsek55yJo1bZBoZCZCWXqsVA8xHyKDs0v8CfHufh8yYVXt42OoGhA8WHW3JOOUZBiL8mLiwyDFiqNcWfLrItOw6zzOKmZAe6WwiExvEcR3CavHe8joZCdx4ZD';

// Use token from facebook account on device
//const DEBUG_TOKEN = null;

Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer(GRAPHQL_ROOT)
);

export const updateRelayAuthHeader = (token) => {
    if (__DEV__ && DEBUG_TOKEN && !USE_STAGING) {
        console.info('!!! USING DEBUG TOKEN !!!');
        token = DEBUG_TOKEN;
    }
    Relay.injectNetworkLayer(
        new Relay.DefaultNetworkLayer(GRAPHQL_ROOT, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
    );
};

export const getViewerId = () => viewerId$(store.getState());