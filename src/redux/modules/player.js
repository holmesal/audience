import {createReducer} from 'redux-immutablejs';
import {createSelector} from 'reselect';
import Immutable from 'immutable';
import request from 'superagent';
import log from '../../utils/log';
import moment from 'moment';
import _ from 'lodash';
import MTAudio from '../../lib/MTAudio';
import {updateLastHeardTime, getLastHeardTime} from './lastHeard';

const SHOW_PLAYER = 'audience/player/SHOW_PLAYER';
const HIDE_PLAYER = 'audience/player/HIDE_PLAYER';
const UPDATE_EPISODE = 'audience/player/UPDATE_EPISODE';
const UPDATE_NEXT_EPISODE = 'audience/player/UPDATE_NEXT_EPISODE';
const UPDATE_PLAYING = 'audience/player/UPDATE_PLAYING';
const UPDATE_BUFFERING = 'audience/player/UPDATE_BUFFERING';
const UPDATE_DURATION = 'audience/player/UPDATE_DURATION';
const UPDATE_CURRENT_TIME = 'audience/player/UPDATE_CURRENT_TIME';
const UPDATE_LAST_TARGET_TIME = 'audience/player/UPDATE_LAST_TARGET_TIME';
const SKIP = 'audience/player/SKIP';
const UPDATE_CHOOSING_EMOJI = 'audience/player/UPDATE_CHOOSING_EMOJI';
const UPDATE_SENDING_EMOJI = 'audience/player/UPDATE_SENDING_EMOJI';
const UPDATE_SENDING_COMMENT = 'audience/player/UPDATE_SENDING_COMMENT';

const initialState = Immutable.fromJS({
    visible: false,
    episodeId: null, //'RXBpc29kZToyOTAz',
    nextEpisodeId: null, //'RXBpc29kZTo1MTc1',
    playing: false,
    buffering: false,
    duration: null,
    currentTime: null,
    lastTargetTime: 0,

    choosingEmoji: false,
    sendingEmoji: false,
    sendingComment: false
});

export default createReducer(initialState, {

    [SHOW_PLAYER]: (state, action) => state.set('visible', true),
    [HIDE_PLAYER]: (state, action) => state.set('visible', false),

    [UPDATE_EPISODE]: (state, action) => state.set('episodeId', action.episodeId),
    [UPDATE_NEXT_EPISODE]: (state, action) => state.set('nextEpisodeId', action.nextEpisodeId),

    [UPDATE_PLAYING]: (state, action) => state.set('playing', action.playing),

    //[UPDATE_BUFFERING]: (state, action) => state.set('buffering', action.buffering),

    [UPDATE_DURATION]: (state, action) => state.set('duration', action.duration),


    [UPDATE_CURRENT_TIME]: (state, action) => state.set('currentTime', action.currentTime),
    [UPDATE_LAST_TARGET_TIME]: (state, action) => state.set('lastTargetTime', action.lastTargetTime),

    [UPDATE_CHOOSING_EMOJI]: (state, action) => state.set('choosingEmoji', action.choosingEmoji),
    [UPDATE_SENDING_EMOJI]: (state, action) => state.set('sendingEmoji', action.sendingEmoji),
    [UPDATE_SENDING_COMMENT]: (state, action) => state.set('sendingComment', action.sendingComment)

})

// Selectors
export const duration$ = state => state.getIn(['player', 'duration']);
export const episodeId$ = state => state.getIn(['player', 'episodeId']);
export const nextEpisodeId$ = state => state.getIn(['player', 'nextEpisodeId']);
export const currentTime$ = state => state.getIn(['player', 'currentTime']);
export const lastTargetTime$ = state => state.getIn(['player', 'lastTargetTime']);
export const visible$ = state => state.getIn(['player', 'visible']);
export const playing$ = state => state.getIn(['player', 'playing']);
export const buffering$ = state => state.getIn(['player', 'buffering']);
export const choosingEmoji$ = state => state.getIn(['player', 'choosingEmoji']);
export const sendingEmoji$ = state => state.getIn(['player', 'sendingEmoji']);
export const sendingComment$ = state => state.getIn(['player', 'sendingComment']);

export const player$ = createSelector(visible$, playing$, (visible, playing) => ({
    playing
}));

export const audio$ = createSelector(playing$, (playing) => ({
    playing
}));

export const episodePlayer$ = createSelector(playing$, lastTargetTime$, duration$, currentTime$, (playing, lastTargetTime, duration, currentTime) => ({
    playing,
    lastTargetTime,
    duration,
    currentTime
}));

export const scrubber$ = createSelector(currentTime$, duration$, playing$, (currentTime, duration, playing) => ({
    currentTime,
    duration,
    playing
}));

export const controls$ = createSelector(playing$, buffering$, (playing, buffering) => ({
    playing,
    buffering
}));

export const emojiButton$ = createSelector(choosingEmoji$, sendingEmoji$, (choosingEmoji, sendingEmoji) => ({
    choosingEmoji,
    sendingEmoji
}));

export const commentButton$ = createSelector(sendingComment$, (sendingComment) => ({
    sendingComment
}));

//export const share$ = createSelector(podcastId$, episodeId$, (podcastId, episodeId) => ({
//    podcastId,
//    episodeId
//}));

// Actions
export const updateEpisode = (episodeId) => ({
    type: UPDATE_EPISODE,
    episodeId
});
export const playEpisode = (episodeId, startTime) => {
    return (dispatch, getState) => {

        // Only do this if we haven't been asked to play the episode that's currently playing
        if (episodeId != episodeId$(getState())) {
            // Update to the new episode
            dispatch(updateEpisode(episodeId));
            // Show the player
            dispatch(showPlayer());
            // Stop the player - will be started again by the audio component when it re-renders
            dispatch(updatePlaying(true));
            // Update the duration to null
            dispatch(updateDuration(null));
        }

        // Either way, if a startTime is passed we should seek to it
        //let targetTime = startTime;
        // If we weren't asked to seek anywhere specific
        if (!startTime && startTime != 0) {
            // Check if we stored a lastHeard time for this episode
            // Will return 0 if we haven't stored a lastHeardTime
            startTime = getLastHeardTime(getState(), episodeId);
        }
        // Seek to this time
        console.info('playing with start time: ', startTime);
        dispatch(updateLastTargetTime(startTime));
    }
};

export const playNextEpisode = () => {
    return (dispatch, getState) => {
        let nextEpisodeId = nextEpisodeId$(getState());
        if (nextEpisodeId) {
            // play the next episode
            dispatch(playEpisode(nextEpisodeId));
            // clear the next episode
            dispatch(updateNextEpisode(null));
        } else {
            // is this the right place to do this?
            dispatch(hidePlayer());
            dispatch(playEpisode(null));
        }
    }
};

export const updateNextEpisode = (nextEpisodeId) => ({type: UPDATE_NEXT_EPISODE, nextEpisodeId});

//export const seekTo = (time) => {
//    return (dispatch, getState) => {
//        MTAudio.seekTo(time);
//    }
//};
export const resume = () => {
    return (dispatch, getState) => {
        dispatch(updatePlaying(true));
        //MTAudio.resume();
    }
};
export const pause = () => {
    return (dispatch, getState) => {
        dispatch(updatePlaying(false));
        //MTAudio.pause();
    }
};

export const showPlayer = () => ({type: SHOW_PLAYER});
export const hidePlayer = () => ({type: HIDE_PLAYER});

export const updatePlaying = (playing) => ({
    type: UPDATE_PLAYING,
    playing
});
//export const updateBuffering = (buffering) => ({
//    type: UPDATE_BUFFERING,
//    buffering
//});
export const updateDuration = (duration) => ({
    type: UPDATE_DURATION,
    duration
});

//export const updateCurrentTime = (currentTime) => ({
//    type: UPDATE_CURRENT_TIME,
//    currentTime
//});

const debouncedLastHeardTimeUpdate = _.throttle(
    (dispatch, getState, currentTime) => dispatch(updateLastHeardTime(episodeId$(getState()), currentTime)), 5000, {leading: true, trailing: false}
);
export const updateCurrentTime = (currentTime) => {
    return (dispatch, getState) => {
        debouncedLastHeardTimeUpdate(dispatch, getState, currentTime);
        dispatch({
            type: UPDATE_CURRENT_TIME,
            currentTime
        });
    }
};

export const updateLastTargetTime = (lastTargetTime) => ({
    type: UPDATE_LAST_TARGET_TIME,
    lastTargetTime
});

export const updateChoosingEmoji = (choosingEmoji) => ({
    type: UPDATE_CHOOSING_EMOJI,
    choosingEmoji
});
export const updateSendingEmoji = (sendingEmoji) => ({
    type: UPDATE_SENDING_EMOJI,
    sendingEmoji
});
export const updateSendingComment = (sendingComment) => ({
    type: UPDATE_SENDING_COMMENT,
    sendingComment
});

//export const skip = (offset) => {
//    return (dispatch, getState) => {
//        let currentTime = currentTime$(getState());
//        let duration = duration$(getState());
//        let target = currentTime + offset;
//        if (target < 0) target = 0;
//        else if (target > duration) target = duration;
//
//        dispatch(seekTo(target));
//    }
//};