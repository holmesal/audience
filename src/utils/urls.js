import {NativeModules} from 'react-native';
let {MTDebugIP} = NativeModules;


export const DEV_SERVER = `http://${MTDebugIP.debugIP}:5000`;
export const STAGING_SERVER = `https://podcastfoo-staging.herokuapp.com`;
export const PROD_SERVER = `https://podcastfoo.herokuapp.com`;

export const ROOT = __DEV__ ? DEV_SERVER : PROD_SERVER;

export const episodeShareLink = (podcastId, episodeId, userId, time) => {
    let url = `${PROD_SERVER}/${podcastId}/${episodeId}/${userId}`;
    if (time) url = `${url}?time=${time}`;
    return url;
};