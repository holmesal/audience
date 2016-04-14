import {createReducer} from 'redux-immutablejs';
import {createSelector} from 'reselect';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
    clipId: null,
    playing: false,
    currentTime: 0,
    duration: 0
});

const PLAY_CLIP = 'audience/clip/PLAY_CLIP';
const UPDATE_PLAYING = 'audience/clip/UPDATE_PLAYING';
const UPDATE_CURRENT_TIME = 'audience/clip/UPDATE_CURRENT_TIME';
const UPDATE_DURATION = 'audience/clip/UPDATE_DURATION';
const FINISHED_PLAYING = 'audience/clip/FINISHED_PLAYING';

export default createReducer(initialState, {

    [PLAY_CLIP]: (state, action) => state.merge({
        clipId: action.clipId,
        playing: true,
        currentTime: 0,
        duration: 0
    }),

    [UPDATE_PLAYING]: (state, action) => state.set('playing', action.playing),

    [UPDATE_CURRENT_TIME]: (state, action) => state.set('currentTime', action.currentTime),

    [UPDATE_DURATION]: (state, action) => state.set('duration', action.duration),

    [FINISHED_PLAYING]: (state, action) => state.merge(initialState),

});

export const clipId$ = state => state.getIn(['clip', 'clipId']);
export const playing$ = state => state.getIn(['clip', 'playing']);
export const currentTime$ = state => state.getIn(['clip', 'currentTime']);
export const duration$ = state => state.getIn(['clip', 'duration']);

export const player$ = createSelector(clipId$, playing$, (clipId, playing) => ({clipId, playing}))


/**
 Actions
*/
export const playClip = (clipId) => ({
    type: PLAY_CLIP,
    clipId
});

export const resume = () => ({
    type: UPDATE_PLAYING,
    playing: true
});

export const pause = () => ({
    type: UPDATE_PLAYING,
    playing: false
});

export const finishedPlaying = () => ({
    type: FINISHED_PLAYING
});