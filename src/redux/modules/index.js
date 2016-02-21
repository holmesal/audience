import {combineReducers} from 'redux-immutablejs';
import search from './search';
import podcasts from './podcasts';
import podcastInfo from './podcastInfo';
import episodes from './episodes';
import player from './player';
import auth from './auth';

export default combineReducers({
    search,
    podcasts,
    podcastInfo,
    episodes,
    player,
    auth
});