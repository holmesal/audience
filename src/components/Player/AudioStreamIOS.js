import React, {
    Component,
    NativeAppEventEmitter,
    PropTypes,
    View
} from 'react-native';

import {MTAudio} from 'NativeModules';

/**
 * This component should hide the mask the imperative nature of interacting with the ios api
 * and provide a declarative react component
 * It's also a controlled component
 */
export default class AudioStreamIOS extends Component {

    static propTypes = {
        // Properties to control the player
        url: PropTypes.string.isRequired,
        title: PropTypes.string,
        artist: PropTypes.string,
        artworkUrl: PropTypes.string,
        playing: PropTypes.bool.isRequired,
        time: PropTypes.number.isRequired,

        // Events that the player can emit
        onCurrentTimeChange: PropTypes.func,
        onDurationChange: PropTypes.func,
        onStateChange: PropTypes.func,
        onSkip: PropTypes.func
    };

    static defaultProps = {
        onCurrentTimeChange: () => {},
        onDurationChange: () => {},
        onPlayingChange: () => {}
    };

    state = {
        currentTime: 0,
        playerState: 'STOPPED',
        duration: 0
    };

    componentDidMount() {
        // Listen for changes to the audio state
        NativeAppEventEmitter.addListener('MTAudio.updateState', this.handleNativeAudioStateChange.bind(this));
        // Emit changes to play/pause state
        NativeAppEventEmitter.addListener('MTAudio.commandCenterPlayButtonTapped', () => this.props.onPlayingChange(true));
        NativeAppEventEmitter.addListener('MTAudio.commandCenterPauseButtonTapped', () => this.props.onPlayingChange(false));
        // Handle command center skips
        NativeAppEventEmitter.addListener('MTAudio.commandCenterSkipForwardButtonTapped', () => this.props.onSkip(15));
        NativeAppEventEmitter.addListener('MTAudio.commandCenterSkipBackwardButtonTapped', () => this.props.onSkip(-15));
        // Play the episode
        if (this.props.url) {
            MTAudio.play(this.props.url, this.props.title, this.props.artist, this.props.artworkUrl);
            this.props.onPlayingChange(true);
        }
    }

    handleNativeAudioStateChange(audio) {
        if (audio.source != this.props.url) {
            //console.info('disregarding audio: ', audio);
            return false;
        }
        //console.info('got state change', audio);
        // rounding duration to the nearest 10th of a second
        audio.duration = Math.ceil(audio.duration * 10)/10;
        // Emit duration changes
        if (this.props.onDurationChange && audio.duration != this.state.duration) {
            this.props.onDurationChange(audio.duration);
        }
        // Emit time changes
        if (this.props.onCurrentTimeChange && audio.currentTime != this.state.currentTime) {
            this.props.onCurrentTimeChange(audio.currentTime);
        }
        // Emit player state changes
        if (this.props.onStateChange && audio.playerState != this.state.playerState) {
            this.props.onStateChange(audio.playerState);
        }
        this.setState(audio);
    }

    componentWillReceiveProps(nextProps) {
        // When the url changes, stop playback and play the new URL
        if (nextProps.url != this.props.url) {
            MTAudio.play(nextProps.url, nextProps.title, nextProps.artist, this.props.artworkUrl);
            this.props.onPlayingChange(true);
        }

        // When the playing state changes, start or stop playback
        if (nextProps.playing != this.props.playing) {
            //console.info(`[AudioStreamIOS] setting MTAudio playing state to ${nextProps.playing} from ${this.props.playing}`);
            nextProps.playing ? MTAudio.resume() : MTAudio.pause();
        }

        // When the target time changes, seek to that time
        if (nextProps.time != this.props.time
            //Math.abs(nextProps.time - this.state.currentTime) > 1000
        ) {
            console.info(`[AudioStreamIOS] seeking to ${nextProps.time}`);
            MTAudio.seekToTime(nextProps.time);
        }
    }

    //shouldComponentUpdate() {
    //    return false;
    //}

    render() {
        return <View />
    }
}