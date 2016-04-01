import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Relay from 'react-relay';
import {BUCKET} from '../../utils/urls';
import DebugView from '../common/DebugView';
import colors from '../../colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {MTAudio} from 'NativeModules';
import AudioStreamIOS from '../Player/AudioStreamIOS';

class PlayClipButton extends Component {

    state = {
        playing: false,
        finished: false,
        targetTime: 0
    };

    togglePlay() {
        this.setState({
            playing: !this.state.playing
        });
    }

    handleFinish() {
        this.setState({
            playing: false
        });
    }

    render() {
        console.info(this.props.clip, this.state.playing);
        const {clip} = this.props;
        const clipUrl = `http://s3-us-west-1.amazonaws.com/${BUCKET}/${clip.id}.mp3`;
        return (
            <TouchableOpacity style={styles.wrapper}
                              onPress={this.togglePlay.bind(this)}>
                <Icon name={this.state.playing ? 'pause' : 'play'}
                      color={colors.white}
                      size={24}/>
                <AudioStreamIOS url={clipUrl}
                                title={clip.episode.title}
                                artist={clip.episode.podcast.name}
                                artworkUrl={clip.episode.podcast.artwork}
                                playing={this.state.playing}
                                time={this.state.targetTime}
                                onPlayingChange={playing => this.setState({playing})}
                                onFinish={this.handleFinish.bind(this)}
                />

            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default Relay.createContainer(PlayClipButton, {
    initialVariables: {
        size: 'large'
    },
    fragments: {
        clip: () => Relay.QL`
            fragment on Clip {
                id
                startTime
                endTime
                episode {
                    title
                    podcast {
                        name
                        artwork(size:$size)
                    }
                }
            }
        `
    }
});