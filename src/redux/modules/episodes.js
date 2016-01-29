import {createReducer} from 'redux-immutablejs';
import {createSelector} from 'reselect';
import Immutable from 'immutable';
import request from 'superagent';
import log from '../../utils/log';
import moment from 'moment';
import _ from 'lodash';

const UPDATE_EPISODES = 'audience/episodes/UPDATE_EPISODES';

const initialState = Immutable.fromJS({});

export default createReducer(initialState, {

    [UPDATE_EPISODES]: (state, action) => state.updateIn([action.podcastId], Immutable.List(), episodes => episodes.merge(action.episodes).sortBy(ep => ep.pubDate))

})

// Selectors
export const episodes$ = state => state.getIn(['episodes']);
// smelly - this should be declared over in podcastInfo, but importing it creates some circular dependancy problems
const podcastId$ = state => state.getIn(['podcastInfo', 'podcastId']);
export const episodeList$ = createSelector(episodes$, podcastId$, (episodes, podcastId) => {
    return {
        episodes: episodes.get(podcastId, Immutable.List()).toJS(),
        podcastId
    }
});

// Actions
export const updateEpisodes = (podcastId, episodes) => ({
    type: UPDATE_EPISODES,
    podcastId,
    episodes
});

export const fetchEpisodes = (podcastId) => {
    return (dispatch, getState) => {
        let feedUrl = getState().getIn(['podcasts', podcastId, 'feedUrl']);

        if (!feedUrl) {
            console.error(`no feed url found for podcast ${podcastId}`);
            return false;
        }
        request
            //.get('http://localhost:9200/feed')
            .get('http://audience-backend.alonso.io/feed')
            .query({
                url: feedUrl,
                limit: 20
            })
            .end((err, res) => {
                if (err) log.error(err);
                let episodes = Immutable.fromJS(res.body.episodes);
                dispatch(updateEpisodes(podcastId, episodes));
            });
    }
};