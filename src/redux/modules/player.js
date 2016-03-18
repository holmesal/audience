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
const UPDATE_CHOOSING_EMOJI = 'audience/player/UPDATE_CHOOSING_EMOJI';
const UPDATE_SENDING_EMOJI = 'audience/player/UPDATE_SENDING_EMOJI';
const UPDATE_SENDING_COMMENT = 'audience/player/UPDATE_SENDING_COMMENT';

const initialState = Immutable.fromJS({
    visible: true,
    episodeId: 'RXBpc29kZToyOTAz',
    playing: false,
    buffering: false,
    duration: null,
    currentTime: null,
    duration: null,

    choosingEmoji: false,
    sendingEmoji: false,
    sendingComment: true,
});

export default createReducer(initialState, {

    [SHOW_PLAYER]: (state, action) => state.set('visible', true),
    [HIDE_PLAYER]: (state, action) => state.set('visible', false),

    [UPDATE_EPISODE]: (state, action) => state.set('episodeId', action.episodeId),

    [UPDATE_PLAYING]: (state, action) => state.set('playing', action.playing),

    //[UPDATE_BUFFERING]: (state, action) => state.set('buffering', action.buffering),

    [UPDATE_DURATION]: (state, action) => state.set('duration', action.duration),


    [UPDATE_CURRENT_TIME]: (state, action) => state.set('currentTime', action.currentTime),

    [UPDATE_CHOOSING_EMOJI]: (state, action) => state.set('choosingEmoji', action.choosingEmoji),
    [UPDATE_SENDING_EMOJI]: (state, action) => state.set('sendingEmoji', action.sendingEmoji),
    [UPDATE_SENDING_COMMENT]: (state, action) => state.set('sendingComment', action.sendingComment)

})

// Selectors
export const duration$ = state => state.getIn(['player', 'duration']);
export const episodeId$ = state => state.getIn(['player', 'episodeId']);
export const currentTime$ = state => state.getIn(['player', 'currentTime']);
export const visible$ = state => state.getIn(['player', 'visible']);
export const playing$ = state => state.getIn(['player', 'playing']);
export const buffering$ = state => state.getIn(['player', 'buffering']);
export const choosingEmoji$ = state => state.getIn(['player', 'choosingEmoji']);
export const sendingEmoji$ = state => state.getIn(['player', 'sendingEmoji']);
export const sendingComment$ = state => state.getIn(['player', 'sendingComment']);

export const player$ = createSelector(visible$, playing$, (visible, playing) => ({
    visible,
    playing
}));

export const audio$ = createSelector(playing$, (playing) => ({
    playing
}));

//export const scrubber$ = createSelector(currentTime$, duration$, (currentTime, duration) => ({
//    currentTime,
//    duration
//}));

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
export const playEpisode = (episodeId) => {
    return (dispatch, getState) => {
        //console.info(podcastId, episodeId);
        //let podcastTitle = getState().getIn(['podcasts', podcastId, 'collectionName']);
        //let audio = getState().getIn(['episodes', podcastId]).find((ep) => ep.get('uid') === episodeId, null, Immutable.Map());
        //let url = audio.getIn(['audio', 'url']);
        //let episodeTitle = audio.get('title');
        //if (!url || !podcastTitle || !episodeTitle) console.error(`Could not play this episode due to missing information:   podcastTitle:${podcastTitle}   episodeTitle:${episodeTitle}   url:${url}`);
        //MTAudio.play(url, podcastTitle, episodeTitle);

        dispatch(updateEpisode(episodeId));
        dispatch(showPlayer());
        // Stop the player - will be started again by the audio component when it re-renders
        dispatch(updatePlaying(false));
    }
};

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
export const updateCurrentTime = (currentTime) => ({
    type: UPDATE_CURRENT_TIME,
    currentTime
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