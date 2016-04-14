import {combineReducers} from 'redux-immutablejs';
import search from './search';
import podcastInfo from './podcastInfo';
import player from './player';
import auth from './auth';
import tabs from './tabs';
import lastHeard from './lastHeard';
import clip from './clip';

export default combineReducers({
    search,
    podcastInfo,
    player,
    auth,
    tabs,
    lastHeard,
    clip
});