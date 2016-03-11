import {
    Linking
} from 'react-native';
import UrlPattern from 'url-pattern';
import {ROOT} from '../utils/urls';
import {playEpisode} from '../redux/modules/player';
import store from '../redux/create';

/**
 * Respond to urls by manipulating application state in redux
 */
let playEpisodePatten = new UrlPattern(`/:podcastId/:episodeId(/:viewerId)`, {
    segmentValueCharset: 'a-zA-Z0-9-_~ %='
});
function handleLink(url) {
    let path = url.split(ROOT)[1];
    console.info('handling url', url, path);
    if (playEpisodePatten.match(path)) {
        let {podcastId, episodeId, viewerId} = playEpisodePatten.match(path);
        console.info(podcastId, episodeId, viewerId);
        // Play this episode
        store.dispatch(playEpisode(episodeId))
    } else {
        console.warn('failed to parse path: ', path, 'from URL: ', url);
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