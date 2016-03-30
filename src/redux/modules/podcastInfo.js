import {createReducer} from 'redux-immutablejs';
import Immutable from 'immutable';
import {createSelector} from 'reselect';

const SHOW = 'audience/podcastInfo/SHOW';
const HIDE = 'audience/podcastInfo/HIDE';


const initialState = Immutable.fromJS({
    visible: false,
    podcastId: null
});

export default createReducer(initialState, {

    [SHOW]: (state, action) => state.merge({
        visible: true,
        podcastId: action.podcastId
    }),
    [HIDE]: (state, action) => state.merge({
        visible: false
    })
})


// Selectors
export const podcastId$ = state => state.getIn(['podcastInfo', 'podcastId']);
export const visible$ = state => state.getIn(['podcastInfo', 'visible']);
export const podcastInfo$ = createSelector(visible$, (visible) => ({
    visible
}));

// Actions
export const showPodcastInfo = (podcastId) => ({
    type: SHOW,
    podcastId: podcastId
});

export const hidePodcastInfo = () => ({
    type: HIDE
});