import {
    NativeAppEventEmitter
} from 'react-native';

import {MTAudio} from 'NativeModules';

import {updatePlaying, updateBuffering, updateDuration, updateCurrentTime, duration$, currentTime$} from '../redux/modules/player';
import store from '../redux/create';

class MTAudioBridge {

    constructor() {
        NativeAppEventEmitter.addListener('MTAudio.updateState', this.updateState);
    }

    updateState(state) {
        console.info('got updated state', state);
        //console.info(updatePlaying, store.dispatch);
        let handlers = {
            'PLAYING': () => store.dispatch(updatePlaying(true)),

            'BUFFERING': () => {
                store.dispatch(updateBuffering(true))
            },

            'STOPPED': () => store.dispatch(updatePlaying(false)),

            'PAUSED': () => store.dispatch(updatePlaying(false))
        };

        if (handlers[state.playerState]) handlers[state.playerState]();
        else console.warn('got unknown state: ', state);

        if (state.duration != duration$(store.getState())) store.dispatch(updateDuration(state.duration));
        if (state.currentTime != currentTime$(store.getState())) store.dispatch(updateCurrentTime(state.currentTime));
    }

    play(url, podcastTitle, episodeTitle) {
        MTAudio.play(url, podcastTitle, episodeTitle);
    }
}

export default new MTAudioBridge();