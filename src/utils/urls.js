import {NativeModules} from 'react-native';
let {MTDebugIP} = NativeModules;

export const USE_STAGING = true;

export const DEV_WEB = `http://${MTDebugIP.debugIP}:8082`;
export const STAGING_WEB = `https://podcastfoo-web-staging.herokuapp.com`;
export const PROD_WEB = `https://podcastfoo-web.herokuapp.com`;

export const DEV_API = `http://${MTDebugIP.debugIP}:5000`;
export const STAGING_API = `https://podcastfoo-staging.herokuapp.com`;
export const PROD_API = `https://podcastfoo.herokuapp.com`;

export const DEV_BUCKET = `audience-clips-dev`;
export const STAGING_BUCKET = `audience-clips`;
export const PROD_BUCKET = `audience-clips`;

export const WEB_ROOT = __DEV__ ?
    (USE_STAGING ? STAGING_WEB : DEV_WEB) :
    PROD_WEB;
export const API_ROOT = __DEV__ ?
    (USE_STAGING ? STAGING_API : DEV_API) :
    PROD_API;

export const BUCKET = __DEV__ ?
    (USE_STAGING ? STAGING_BUCKET : DEV_BUCKET) :
    PROD_BUCKET;

export const GRAPHQL_AUTHENTICATED_ROOT = `${API_ROOT}/graphql`;
export const GRAPHQL_PUBLIC_ROOT = `${API_ROOT}/graphql-public`;

export const episodeShareLink = (podcastId, episodeId, userId, time) => {
    let url = `${WEB_ROOT}/${podcastId}/${episodeId}/${userId}`;
    if (time) url = `${url}?time=${time}`;
    return url;
};

export const clipShareLink = clipId => {
    return `${WEB_ROOT}/clip/${clipId}`;
};

export const annotationShareLink = annotationId => {
    return `${WEB_ROOT}/annotation/${annotationId}`;
};