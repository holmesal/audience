import {createReducer} from 'redux-immutablejs';
import Immutable from 'immutable';
import request from 'superagent';

const UPDATE_EPISODES = 'audience/podcasts/UPDATE_EPISODES';

const initialState = Immutable.fromJS({
});

export default createReducer(initialState, {

    [UPDATE_EPISODES]: (state, action) => state.get(action.podcastId).merge(action.episodes)

})

// Selectors
export const episodes$ = state => state.getIn(['episodes']);

// Actions
export const updateEpisodes = (podcastId, episodes) => ({
    type: UPDATE_EPISODES,
    podcastId,
    episodes
});

export const fetchEpisodes = (podcastId) => {
    return (dispatch, getState) => {
        //let existing = getState().getIn(['episodes', podcastId, episodeId]);
        //console.info('existing podcast: ', existing);
        let feedUrl = getState().getIn(['podcasts', podcastId, 'feedUrl']);
        console.info('fetching latest episodes for ', podcastId, feedUrl);

        // get the feed url for this podcast


        //if (!existing) {
        //    //request
        //    //    .get('https://itunes.apple.com/lookup')
        //    //    .accept('application/json')
        //    //    .query({
        //    //        limit: 5,
        //    //        id: podcastId
        //    //    })
        //    //    .end((err, res) => {
        //    //        if (err) console.error(err);
        //    //        let body = JSON.parse(res.text);
        //    //        //console.info('podcast results for id ', podcastId, body);
        //    //        let podcast = body.results[0];
        //    //        if (podcast) {
        //    //            dispatch(updatePodcast(podcastId, podcast))
        //    //        } else {
        //    //            console.error(`No iTunes podcast exists for id ${podcastId}`);
        //    //        }
        //    //    });
        //}
    }
}