import React, {
    Component,
    Image,
    NativeAppEventEmitter,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import {MTAudio} from 'NativeModules';
import {connect} from 'react-redux/native';
import {audio$} from '../../redux/modules/player.js';

// Where should current time live?
// Well, (a), in this component's State


class Audio extends Component {

    static propTypes = {
        playing: React.PropTypes.bool,
        onDurationChange: React.PropTypes.func,
        onCurrentTimeChange: React.PropTypes.func
    };

    state = {
        audio: {
            playerState: null,
            duration: 0,
            currentTime: 0
        }
    };

    handleNativeAudioStateChange(audio) {
        // rounding duration to the nearest 10th of a second
        audio.duration = Math.ceil(audio.duration * 10)/10;
        //console.info(audio)
        if (this.props.onDurationChange && audio.duration != this.state.audio.duration) {
            this.props.onDurationChange(audio.duration);
        }
        if (this.props.onCurrentTimeChange && audio.currentTime != this.state.audio.currentTime) {
            this.props.onCurrentTimeChange(audio.currentTime);
        }
        this.setState({audio});
    }

    playEpisode() {
        // TODO - re-implement this
        //this.hasShownRecommendNotification = false;
        // Play this audio file
        let {audioSource, title} = this.props.episode;
        let {name, artwork} = this.props.podcast;
        console.info(`playing ${name} - ${title} (${audioSource})`);
        MTAudio.play(audioSource, name, title);
        // this.playOrResume();
    }

    pauseOrResume() {
        if (this.props.playing) MTAudio.resume();
        else MTAudio.pause();
    }

    componentDidMount() {
        // Listen for changes to the audio source
        NativeAppEventEmitter.addListener('MTAudio.updateState', this.handleNativeAudioStateChange.bind(this));
        if (this.props.episode.audioSource) this.playEpisode();
    }

    componentDidUpdate(prevProps, prevState) {
        // When the audio source changes, play the episode
        if (this.props.episode.audioSource != prevProps.episode.audioSource) {
            this.playEpisode();
        }
        if (this.props.playing != prevProps.playing) {
            this.pauseOrResume();
        }
        if (this.props.lastTargetTime != prevProps.lastTargetTime) {
            //console.info('seeking to target time: ', this.props.lastTargetTime)
            MTAudio.seekToTime(this.props.lastTargetTime);
        }
    }

    syncWithMTAudio() {

    }

    render() {
        return (
            <View />
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});

let connectedAudio = connect(audio$)(Audio);

export default Relay.createContainer(connectedAudio, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                title
                audioSource
            }
        `,
        podcast: () => Relay.QL`
            fragment on Podcast {
                name
            }
        `
    }
})