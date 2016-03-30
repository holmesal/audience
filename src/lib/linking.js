import {
    Linking
} from 'react-native';
import UrlPattern from 'url-pattern';
import qs from 'qs';
import {WEB_ROOT} from '../utils/urls';
import {playEpisode, updateLastTargetTime} from '../redux/modules/player';
import store from '../redux/create';

/**
 * Respond to urls by manipulating application state in redux
 */
let playEpisodePatten = new UrlPattern(`/listen/:episodeId`, {
    segmentValueCharset: 'a-zA-Z0-9-_~ %='
});
function handleLink(url) {
    if (url.indexOf(WEB_ROOT) === -1) {
        console.error(`got a URL without WEB_ROOT: ${WEB_ROOT} - bailing. url was: ${url}`);
        return false;
    }
    try {
        let afterRoot = url.split(WEB_ROOT)[1];
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
            store.dispatch(playEpisode(episodeId, time));
        } else {
            console.warn('failed to parse path: ', path, 'from URL: ', url);
        }
    } catch (err) {
        console.error(`error parsing deeplink`, err);
    }
}

// Listen for deeplinks while app is running
Linking.addEventListener('url', (ev) => {
    console.info('got url event', ev);
    handleLink(ev.url);
});

// If the app was launched from a deeplink, handle it
Linking.getInitialURL().then(url => {
    console.info(url)
    if (url) handleLink(url);
});