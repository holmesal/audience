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
        onFinish: PropTypes.func,
        onSkip: PropTypes.func
    };

    static defaultProps = {
        onCurrentTimeChange: () => {},
        onDurationChange: () => {},
        onPlayingChange: () => {},
        onStateChange: () => {},
        onFinish: () => {},
        onSkip: () => {}
    };

    state = {
        currentTime: 0,
        playerState: 'STOPPED',
        duration: 0
    };

    _lastCurrentTime = 0;
    _ignoringNextFinishEvent = false;
    _startedPlaying = 0;

    componentDidMount() {
        this._subscriptions = [];
        // Listen for changes to the audio state
        this._subscriptions.push(NativeAppEventEmitter.addListener('MTAudio.updateState', this.handleNativeAudioStateChange.bind(this)));
        // Emit changes to play/pause state
        this._subscriptions.push(NativeAppEventEmitter.addListener('MTAudio.commandCenterPlayButtonTapped', this.handleCommandCenterPlayButtonTap.bind(this)));
        this._subscriptions.push(NativeAppEventEmitter.addListener('MTAudio.commandCenterPauseButtonTapped', this.handleCommandCenterPauseButtonTap.bind(this)));
        // Handle command center skips
        this._subscriptions.push(NativeAppEventEmitter.addListener('MTAudio.commandCenterSkipForwardButtonTapped', this.handleCommandCenterSkipForwardButtonTap.bind(this)));
        this._subscriptions.push(NativeAppEventEmitter.addListener('MTAudio.commandCenterSkipBackwardButtonTapped', this.handleCommandCenterSkipBackwardButtonTap.bind(this)));
        // Handle finished episodes
        this._subscriptions.push(NativeAppEventEmitter.addListener('MTAudio.finishedPlaying', this.handleFinishedPlaying.bind(this)));
        // Play the episode
        console.info('audiostreamios props', this.props)
        if (this.props.url && this.props.playing) {
            this.play(this.props);
            //this._startedPlaying = Date.now();
            //MTAudio.play(this.props.url, this.props.title, this.props.artist, this.props.artworkUrl);
            //this.props.onPlayingChange(true);
            //// Seek to this time
            //setTimeout(() => this.seekTo(this.props.time), 0);
        }
    }

    componentWillUnmount() {
        this._subscriptions.forEach(subscription => subscription.remove());
    }

    handleFinishedPlaying() {
        console.info('episode player saw native audio finish playing');
        if (this._ignoringNextFinishEvent) this._ignoringNextFinishEvent = false;
        else this.props.onFinish()
    }

    handleNativeAudioStateChange(audio) {
        if (audio.source != this.props.url) {
            //console.info('disregarding audio: ', audio);
            return false;
        }
        console.info('got state change', audio);
        // rounding duration to the nearest 10th of a second
        audio.duration = Math.ceil(audio.duration * 10)/10;

        // If the audio player send currentTime and duration as 0, interpret this as the episode ending
        if (audio.duration === 0 && audio.currentTime == 0 && Date.now() - this._startedPlaying > 10000) {
            console.info(`[AudioPlayer] ignoring currentTime=0 and duration=0 because I think we finished`);
            this.handleFinishedPlaying();
            return false;
        }

        // Emit duration changes
        if (audio.duration != this.state.duration) {
            console.info('audioplayer sent duration: ', audio.duration);
            this.props.onDurationChange(audio.duration);
        }
        // Emit time changes
        if (audio.currentTime != this.state.currentTime) {
            console.info('audioplayer sent current time: ', audio.currentTime);
            if (audio.currentTime === 0 && Date.now() - this._startedPlaying < 1000) {
                console.info(`ignoring currentTime=0 update, as it's probably fake. Has been ${Date.now() - this._startedPlaying}ms since we began playing.`);
            } else {
                this.props.onCurrentTimeChange(audio.currentTime);
            }
        }
        // Emit player state changes
        if (audio.playerState != this.state.playerState) {
            this.props.onStateChange(audio.playerState);
            //console.info(audio.playerState);
            //if (audio.playerState === 'PLAYBACK_COMPLETED') this.props.onFinish()
            //if (audio.playerState === 'STOPPED' || audio.playerState === 'PLAYBACK_COMPLETED') {
            //    this.props.onFinish();
            //    this.reset();
            //}
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
            MTAudio.seekToTime(time);
        } else {
            //console.info('skipping!');
        }
    }

    play(props) {
        console.info('playing!', props)
        this._startedPlaying = Date.now();
        MTAudio.play(props.url, props.title, props.artist, props.artworkUrl);
        props.onPlayingChange(true);
        setTimeout(() => this.seekTo(props.time), 0);

        // Ignore the finish event immeditely fired
        this._ignoringNextFinishEvent = true;
        // But stop ignoring them if you don't get one in a second
        setTimeout(() => this._ignoringNextFinishEvent = false, 1000);
    }

    reset() {
        MTAudio.pause();
        this._startedPlaying = 0;
    }

    componentWillReceiveProps(nextProps) {
        //console.info('audio stream time: ', this.props.time);
        // When the url changes, stop playback and play the new URL
        if (nextProps.url != this.props.url) {
            this.reset();
            //console.info('audio source changed!');
            this.play(nextProps);
        }

        // When the playing state changes, start or stop playback
        if (nextProps.playing != this.props.playing) {
            //console.info(`[AudioStreamIOS] setting MTAudio playing state to ${nextProps.playing} from ${this.props.playing}`);
            if (nextProps.playing) {
                if (this._startedPlaying) {
                    MTAudio.resume()
                } else {
                    this.play(nextProps)
                }
            } else {
                MTAudio.pause();
            }
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