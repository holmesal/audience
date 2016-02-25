import React, {
    Animated,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import {connect} from 'react-redux/native';
import {player$, hidePlayer} from '../../redux/modules/player.js';
import colors from '../../colors.js';
import Scrubber from './Scrubber';
import Controls from './Controls';
import SocialButtons from './SocialButtons';
import ShareButton from './ShareButton';
import CommentCompose from './CommentCompose';
import AudioPlayer from './EpisodePlayer';

class Player extends Component {

    static propTypes = {};

    static defaultProps = {};

    state = {
        opacity: new Animated.Value(0),
        composeVisible: false,
        duration: 0,
        currentTime: 0,
        lastTargetTime: 0
    };

    componentDidMount() {
        this.updateVisibility();
    }

    componentDidUpdate(prevProps, prevState) {
        this.updateVisibility();
    }

    updateVisibility() {
        if (this.props.visible) {
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 200
            }).start();
        } else {
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 500
            }).start();
        }
    }

    handleSkip(amount) {
        let lastTargetTime = this.state.currentTime + amount;
        if (lastTargetTime < 0) lastTargetTime = Math.random() * 0.0001; //rly small but still causes seek
        else if (lastTargetTime > this.state.duration) lastTargetTime = this.state.duration;
        this.setState({lastTargetTime});
    }

    render() {
        if (!this.props.episode) {
            console.warn('player got null episode :-(');
            return <View />;
        }
        //console.info('player render!');
        let pointerEvents = this.props.visible ? 'auto' : 'none';
        return (
            <Animated.View style={[styles.wrapper, {opacity: this.state.opacity}]} pointerEvents={pointerEvents}>
                <AudioPlayer
                    ref="audio"
                    episode={this.props.episode}
                    podcast={this.props.episode.podcast}
                    lastTargetTime={this.state.lastTargetTime}
                    onDurationChange={duration => this.setState({duration})}
                    onCurrentTimeChange={currentTime => this.setState({currentTime})}
                    onSkip={this.handleSkip.bind(this)}
                />
                <Scrubber
                    duration={this.state.duration}
                    currentTime={this.state.currentTime}
                    onSeek={lastTargetTime => this.setState({lastTargetTime})}
                    hidePlayer={() => this.props.dispatch(hidePlayer())}
                />
                <Controls
                    onSkip={this.handleSkip.bind(this)}
                />
                {false && <ShareButton />}
                <SocialButtons
                    showCompose={() => this.setState({composeVisible: true})}
                    episode={this.props.episode}
                    podcast={this.props.episode.podcast}
                    currentTime={this.state.currentTime}
                />
                <CommentCompose visible={this.state.composeVisible} hideCompose={() => this.setState({composeVisible: false})} />
            </Animated.View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        opacity: 0.3,
        backgroundColor: colors.dark
    }
});

let ConnectedPlayer =  connect(player$)(Player);

export default Relay.createContainer(ConnectedPlayer, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                id
                ${SocialButtons.getFragment('episode')}
                ${AudioPlayer.getFragment('episode')}
                podcast {
                    ${SocialButtons.getFragment('podcast')}
                    ${AudioPlayer.getFragment('podcast')}
                }
            }
        `
    }
})