import {createReducer} from 'redux-immutablejs';
import Immutable from 'immutable';
import request from 'superagent';

const UPDATE_PODCAST = 'audience/podcasts/UPDATE_PODCAST';

const initialState = Immutable.fromJS({
});

export default createReducer(initialState, {

    [UPDATE_PODCAST]: (state, action) => state.setIn([action.podcastId], Immutable.fromJS(action.podcast))

})

// Selectors
export const podcasts$ = state => state.getIn(['podcasts']);

// Actions
import {fetchEpisodes} from './episodes';
export const updatePodcast = (podcastId, podcast) => ({
    type: UPDATE_PODCAST,
    podcastId,
    podcast
});

export const fetchPodcast = (podcastId) => {
    return (dispatch, getState) => {
        let existing = getState().getIn(['podcasts', podcastId]);
        //console.info('existing podcast: ', existing);

        if (!existing) {
            //console.info('fetching ', podcastId);
            request
                .get('https://itunes.apple.com/lookup')
                .accept('application/json')
                .query({
                    limit: 5,
                    id: podcastId
                })
                .end((err, res) => {
                    if (err) console.error(err);
                    let body = JSON.parse(res.text);
                    //console.info('podcast results for id ', podcastId, body);
                    let podcast = body.results[0];
                    if (podcast) {
                        dispatch(updatePodcast(podcastId, podcast));
                        dispatch(fetchEpisodes(podcastId));
                    } else {
                        console.error(`No iTunes podcast exists for id ${podcastId}`);
                    }
                });
        }
    }
}