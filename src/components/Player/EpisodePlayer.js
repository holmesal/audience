import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import {connect} from 'react-redux/native';
import {audio$, resume, updatePlaying} from '../../redux/modules/player.js';
import ListenToEpisodeMutation from '../../mutations/ListenToEpisode';
import {showRecommendNotification} from '../../notifications';

import AudioStreamIOS from './AudioStreamIOS';

class EpisodePlayer extends Component {

    static propTypes = {
        playing: React.PropTypes.bool,
        onDurationChange: React.PropTypes.func,
        onCurrentTimeChange: React.PropTypes.func
    };

    state = {
        listenInFlight: false,
        recommendationPushNotificationSent: false,
        currentTime: 0,
        duration: 0
    };

    componentWillReceiveProps(nextProps) {
        // Reset the push notification flag if this is a new episode
        if (nextProps.episode.id != this.props.episode.id) {
            this.setState({hasShownRecommendNotification: false, currentTime: 0, duration: 0});
        }
    }

    componentDidUpdate(prevProps, prevState) {

        // Mark this episode as listened if over 20% heard
        this.markHeard();

        // Check if we should send a push notification
        this.sendRecommendationPushNotification();
    }

    markHeard() {
        const {currentTime, duration} = this.state;
        if (currentTime != 0 &&
            duration != 0 &&
            !this.props.episode.viewerHasHeard &&
            currentTime / duration > 0.5 &&
            !this.state.listenInFlight
        ) {
            console.info('marking as listened!', this.props);
            this.setState({listenInFlight: true});
            Relay.Store.update(new ListenToEpisodeMutation({
                episodeId: this.props.episode.id
            }), {
                onFailure: (transaction) =>  {
                    console.error(transaction.getError());
                    this.setState({listenInFlight: false});
                },
                onSuccess: (res) => {
                    console.info('successfully marked episode as listened', res);
                    this.setState({listenInFlight: false});
                }
            })
        }
    }

    sendRecommendationPushNotification() {
        let {currentTime, duration} = this.state;
        if (currentTime != 0 &&
            duration != 0 &&
            !this.props.episode.viewerHasRecommended &&
            !this.state.hasShownRecommendNotification &&
            duration - currentTime < 60 * 5 // 5 minutes from the end
        ) {
            showRecommendNotification(this.props.episode.id);
            this.setState({hasShownRecommendNotification: true});
        }
    }

    handleCurrentTimeChange(currentTime) {
        this.setState({currentTime});
        this.props.onCurrentTimeChange(currentTime);
    }

    handleDurationChange(duration) {
        this.setState({duration});
        this.props.onDurationChange(duration);
    }

    handleSkip(amount) {

    }

    render() {
        return (
            <AudioStreamIOS
                url={this.props.episode.audioSource}
                title={this.props.episode.title}
                artist={this.props.podcast.name}
                artworkUrl={this.props.podcast.artwork}
                playing={this.props.playing}
                time={this.props.lastTargetTime}
                onCurrentTimeChange={this.handleCurrentTimeChange.bind(this)}
                onDurationChange={this.handleDurationChange.bind(this)}
                onPlayingChange={(playing) => this.props.dispatch(updatePlaying(playing))}
                onSkip={this.props.onSkip}
            />
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});

let connectedEpisodePlayer = connect(audio$)(EpisodePlayer);

export default Relay.createContainer(connectedEpisodePlayer, {
    initialVariables: {
        size: 'large'
    },
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                id
                title
                audioSource
                viewerHasHeard
            }
        `,
        podcast: () => Relay.QL`
            fragment on Podcast {
                name
                artwork(size:$size)
            }
        `
    }
})