import {combineReducers} from 'redux-immutablejs';
import search from './search';
import podcastInfo from './podcastInfo';
import player from './player';
import auth from './auth';

export default combineReducers({
    search,
    podcastInfo,
    player,
    auth
});