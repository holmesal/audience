import {
    NativeAppEventEmitter
} from 'react-native';

import {MTAudio} from 'NativeModules';
import {showRecommendNotification} from '../notifications';

import {updatePlaying, updateBuffering, updateDuration, updateCurrentTime, duration$, currentTime$, playing$, buffering$, episodeId$} from '../redux/modules/player';
import store from '../redux/create';

class MTAudioBridge {

    constructor() {
        NativeAppEventEmitter.addListener('MTAudio.updateState', this.updateState);
    }

    updateState(state) {
        //console.info('got updated state', state);
        //console.info(updatePlaying, store.dispatch);
        let handlers = {
            'PLAYING': () => {
                if (!playing$(store.getState())) store.dispatch(updatePlaying(true));
            },

            'BUFFERING': () => {
                if (!buffering$(store.getState())) store.dispatch(updateBuffering(true))
            },

            'STOPPED': () => store.dispatch(updatePlaying(false)),

            'PAUSED': () => store.dispatch(updatePlaying(false))
        };

        if (handlers[state.playerState]) handlers[state.playerState]();
        else console.warn('got unknown state: ', state);

        if (state.duration != duration$(store.getState())) store.dispatch(updateDuration(state.duration));
        if (state.currentTime != currentTime$(store.getState())) store.dispatch(updateCurrentTime(state.currentTime));

        if (state.playerState === 'PLAYING' &&
            state.duration - state.currentTime < 100 &&
            !this.hasShownRecommendNotification
        ) {
            showRecommendNotification(episodeId$(store.getState()));
            this.hasShownRecommendNotification = true;
        }
    }

    play(url, podcastTitle, episodeTitle) {
        // Reset
        this.hasShownRecommendNotification = false;
        // Play this audio file
        MTAudio.play(url, podcastTitle, episodeTitle);
    }

    pause() {
        MTAudio.pause()
    }

    resume() {
        MTAudio.resume()
    }

    seekTo(time) {
        MTAudio.seekToTime(time);
    }
}

export default new MTAudioBridge();