import {createReducer} from 'redux-immutablejs';
import Immutable from 'immutable';
import request from 'superagent';
import {createSelector} from 'reselect';

const SHOW = 'audience/podcastInfo/SHOW';
const HIDE = 'audience/podcastInfo/HIDE';


const initialState = Immutable.fromJS({
    visible: true,
    podcastId: null
});

export default createReducer(initialState, {

    [SHOW]: (state, action) => state.merge({
        visible: true,
        podcastId: action.podcastId
    }),
    [HIDE]: (state, action) => state.merge({
        visible: false,
        podcastId: null
    })
})


// Selectors
import {podcasts$} from './podcasts';
export const podcastId$ = state => state.getIn(['podcastInfo', 'podcastId']);
export const visible$ = state => state.getIn(['podcastInfo', 'visible']);
export const podcast$ = createSelector(podcastId$, podcasts$, (podcastId, podcasts) => podcasts.get(podcastId));
export const podcastInfo$ = createSelector(visible$, podcast$, (visible, podcast) => ({visible, podcast}));


// Actions
import {fetchPodcast} from './podcasts';
export const showPodcastInfo = (podcastId) => {
    return (dispatch, getState) => {
        // Fetch this podcast
        dispatch(fetchPodcast(podcastId));
        // Immediately show the podcast info view
        dispatch({
            type: SHOW,
            visible: true,
            podcastId: podcastId
        })
    }
};

export const hidePodcastInfo = () => ({
    type: HIDE
});