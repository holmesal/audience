import React, {
    Component,
    NativeAppEventEmitter,
    PropTypes,
    View
} from 'react-native';

import {PFAudio} from 'NativeModules';

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

    _lastCurrentTime = 0;

    componentDidMount() {
        this._subscriptions = [];
        // Listen for changes to the audio state
        this._subscriptions.push(NativeAppEventEmitter.addListener('PFAudio.updateState', this.handleNativeAudioStateChange.bind(this)));
        // Emit changes to play/pause state
        this._subscriptions.push(NativeAppEventEmitter.addListener('PFAudio.commandCenterPlayButtonTapped', this.handleCommandCenterPlayButtonTap.bind(this)));
        this._subscriptions.push(NativeAppEventEmitter.addListener('PFAudio.commandCenterPauseButtonTapped', this.handleCommandCenterPauseButtonTap.bind(this)));
        // Handle command center skips
        this._subscriptions.push(NativeAppEventEmitter.addListener('PFAudio.commandCenterSkipForwardButtonTapped', this.handleCommandCenterSkipForwardButtonTap.bind(this)));
        this._subscriptions.push(NativeAppEventEmitter.addListener('PFAudio.commandCenterSkipBackwardButtonTapped', this.handleCommandCenterSkipBackwardButtonTap.bind(this)));
        // Play the episode
        if (this.props.url) {
            PFAudio.play(this.props.url, this.props.title, this.props.artist, this.props.artworkUrl);
            this.props.onPlayingChange(true);
            // Seek to this time
            setTimeout(() => this.seekTo(this.props.time), 0);
        }
    }

    componentWillUnmount() {
        this._subscriptions.forEach(subscription => subscription.remove());
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

    handleCommandCenterPlayButtonTap() {
        this.props.onPlayingChange(true);
    }

    handleCommandCenterPauseButtonTap() {
        this.props.onPlayingChange(false);
    }

    handleCommandCenterSkipForwardButtonTap() {
        this.props.onSkip(15);
    }

    handleCommandCenterSkipBackwardButtonTap() {
        this.props.onSkip(-15);
    }

    seekTo(time) {
        if (Math.abs(this.state.currentTime - time) > 1) {
            console.info(`[AudioStreamIOS] seeking to ${time}`);
            PFAudio.seekToTime(time);
        } else {
            //console.info('skipping!');
        }
    }

    componentWillReceiveProps(nextProps) {
        //console.info('audio stream time: ', this.props.time);
        // When the url changes, stop playback and play the new URL
        if (nextProps.url != this.props.url) {
            //console.info('audio source changed!');
            PFAudio.play(nextProps.url, nextProps.title, nextProps.artist, this.props.artworkUrl);
            this.props.onPlayingChange(true);
            setTimeout(() => this.seekTo(this.props.time), 0);
        }

        // When the playing state changes, start or stop playback
        if (nextProps.playing != this.props.playing) {
            //console.info(`[AudioStreamIOS] setting PFAudio playing state to ${nextProps.playing} from ${this.props.playing}`);
            nextProps.playing ? PFAudio.resume() : PFAudio.pause();
        }

        // When the target time changes, seek to that time
        if (nextProps.time != this.props.time
            //Math.abs(nextProps.time - this.state.currentTime) > 1000
        ) {
            this.seekTo(nextProps.time);
        }
    }

    //shouldComponentUpdate() {
    //    return false;
    //}

    render() {
        return <View />
    }
}