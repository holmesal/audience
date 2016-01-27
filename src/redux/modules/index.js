import {combineReducers} from 'redux-immutablejs';
import search from './search';
import podcasts from './podcasts';
import podcastInfo from './podcastInfo';
import episodes from './episodes';

export default combineReducers({
    search,
    podcasts,
    podcastInfo,
    episodes
});