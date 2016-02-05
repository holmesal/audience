import {createReducer} from 'redux-immutablejs';
import {createSelector} from 'reselect';
import Immutable from 'immutable';
import request from 'superagent';
import log from '../../utils/log';
import moment from 'moment';
import _ from 'lodash';
import MTAudio from '../../lib/MTAudio';

const SHOW_PLAYER = 'audience/player/SHOW_PLAYER';
const HIDE_PLAYER = 'audience/player/HIDE_PLAYER';
const UPDATE_EPISODE = 'audience/player/UPDATE_EPISODE';
const UPDATE_PLAYING = 'audience/player/UPDATE_PLAYING';
const UPDATE_BUFFERING = 'audience/player/UPDATE_BUFFERING';
const UPDATE_DURATION = 'audience/player/UPDATE_DURATION';
const UPDATE_CURRENT_TIME = 'audience/player/UPDATE_CURRENT_TIME';
const SKIP = 'audience/player/SKIP';

const initialState = Immutable.fromJS({
    visible: false,
    episodeId: null,
    podcastId: null,
    playing: false,
    buffering: false,
    duration: null,
    currentTime: null
});

export default createReducer(initialState, {

    [SHOW_PLAYER]: (state, action) => state.set('visible', true),
    [HIDE_PLAYER]: (state, action) => state.set('visible', false),

    [UPDATE_EPISODE]: (state, action) => state.merge({podcastId: action.podcastId, episodeId: action.episodeId}),

    [UPDATE_PLAYING]: (state, action) => state.set('playing', action.playing),

    [UPDATE_BUFFERING]: (state, action) => state.set('buffering', action.buffering),

    [UPDATE_DURATION]: (state, action) => state.set('duration', action.duration),


    [UPDATE_CURRENT_TIME]: (state, action) => state.set('currentTime', action.currentTime)

})

// Selectors
export const duration$ = state => state.getIn(['player', 'duration']);
export const episodeId$ = state => state.getIn(['player', 'episodeId']);
export const podcastId$ = state => state.getIn(['player', 'podcastId']);
export const currentTime$ = state => state.getIn(['player', 'currentTime']);
export const visible$ = state => state.getIn(['player', 'visible']);
export const playing$ = state => state.getIn(['player', 'playing']);
export const buffering$ = state => state.getIn(['player', 'buffering']);

export const player$ = createSelector(visible$, (visible) => ({
    visible
}));

export const scrubber$ = createSelector(currentTime$, duration$, (currentTime, duration) => ({
    currentTime,
    duration
}));

export const controls$ = createSelector(playing$, buffering$, (playing, buffering) => ({
    playing,
    buffering
}));

export const share$ = createSelector(podcastId$, episodeId$, (podcastId, episodeId) => ({
    podcastId,
    episodeId
}));

// Actions
export const updateEpisode = (podcastId, episodeId) => ({
    type: UPDATE_EPISODE,
    podcastId,
    episodeId
});
export const playEpisode = (podcastId, episodeId) => {
    return (dispatch, getState) => {
        console.info(podcastId, episodeId);
        let podcastTitle = getState().getIn(['podcasts', podcastId, 'collectionName']);
        let audio = getState().getIn(['episodes', podcastId]).find((ep) => ep.get('uid') === episodeId, null, Immutable.Map());
        let url = audio.getIn(['audio', 'url']);
        let episodeTitle = audio.get('title');
        if (!url || !podcastTitle || !episodeTitle) console.error(`Could not play this episode due to missing information:   podcastTitle:${podcastTitle}   episodeTitle:${episodeTitle}   url:${url}`);
        MTAudio.play(url, podcastTitle, episodeTitle);
        //MTAudio.play(url, title, description)
        //let mp3Url =
        dispatch(updateEpisode(podcastId, episodeId));
        dispatch(showPlayer());
    }
};

export const seekTo = (time) => {
    return (dispatch, getState) => {
        MTAudio.seekTo(time);
    }
};
export const resume = () => {
    return (dispatch, getState) => {
        MTAudio.resume();
    }
};
export const pause = () => {
    return (dispatch, getState) => {
        MTAudio.pause();
    }
};

export const showPlayer = () => ({type: SHOW_PLAYER});
export const hidePlayer = () => ({type: HIDE_PLAYER});

export const updatePlaying = (playing) => ({
    type: UPDATE_PLAYING,
    playing
});
export const updateBuffering = (buffering) => ({
    type: UPDATE_BUFFERING,
    buffering
});
export const updateDuration = (duration) => ({
    type: UPDATE_DURATION,
    duration
});
export const updateCurrentTime = (currentTime) => ({
    type: UPDATE_CURRENT_TIME,
    currentTime
});

export const skip = (offset) => {
    return (dispatch, getState) => {
        let currentTime = currentTime$(getState());
        let duration = duration$(getState());
        let target = currentTime + offset;
        if (target < 0) target = 0;
        else if (target > duration) target = duration;

        dispatch(seekTo(target));
    }
};