import {
    Linking
} from 'react-native';
import UrlPattern from 'url-pattern';
import qs from 'qs';
import {WEB_ROOT, STAGING_WEB, PROD_WEB} from '../utils/urls';
import {playEpisode, updateLastTargetTime} from '../redux/modules/player';
import store from '../redux/create';

/**
 * Respond to urls by manipulating application state in redux
 */
const opts = { segmentValueCharset: 'a-zA-Z0-9-_~ %=' };
let playEpisodePatten = new UrlPattern(`/listen/:episodeId`, opts);
let annotationPattern = new UrlPattern(`/annotation/:annotationId`, opts);
let clipPattern = new UrlPattern(`/clip/:clipId`, opts);
let showPattern = new UrlPattern(`/show/:showId`, opts);

export function handleLink(url) {
    if (!url) return;
    try {
        let afterRoot;
        if (url.indexOf(STAGING_WEB) != -1) afterRoot = url.split(STAGING_WEB)[1];
        else if (url.indexOf(PROD_WEB) != -1) afterRoot = url.split(PROD_WEB)[1];
        else {
            console.info(`got a URL with an unknown root... bailing. url was: ${url}`);
            return false;
        }
        console.info('afterroot is ', afterRoot);
        // don't care about the root
        let path = afterRoot.split('?')[0];
        // parse query params
        let q = qs.parse(afterRoot.split('?')[1]);
        console.info('handling url', url, path, q);

        // try to match the episode path
        if (playEpisodePatten.match(path)) {
            let {episodeId} = playEpisodePatten.match(path);
            let time = parseInt(q.time);
            //console.info('got time: ')
            console.info('matched play episode path!', episodeId, time);
            // Play this episode
            return {
                type: 'episode',
                episodeId,
                time
            };
            //store.dispatch(playEpisode(episodeId, time));
        }

        // try to match the annotation path
        if (annotationPattern.match(path)) {
            let {annotationId} = annotationPattern.match(path);
            return {
                type: 'annotation',
                annotationId
            }
        }

        // try to match the clip path
        if (clipPattern.match(path)) {
            let {clipId} = clipPattern.match(path);
            return {
                type: 'clip',
                clipId
            }
        }

        // try to match the show path
        if (showPattern.match(path)) {
            let {showId} = showPattern.match(path);
            return {
                type: 'show',
                showId
            }
        }

        // Return unknown
        return null;
    } catch (err) {
        console.error(`error parsing deeplink`, err);
    }
}

//// Listen for deeplinks while app is running
Linking.addEventListener('url', (ev) => {
    console.info('linking library got url event', ev);
    //handleLink(ev.url);
});
//
//// If the app was launched from a deeplink, handle it
//Linking.getInitialURL().then(url => {
//    console.info(url)
//    if (url) handleLink(url);
//});