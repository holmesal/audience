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
import { BoldCaps } from '../../type';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {MTAudio} from 'NativeModules';
import AudioStreamIOS from '../Player/AudioStreamIOS';
import moment from 'moment';

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
        // Get duration
        const duration = moment.duration(this.props.clip.endTime - this.props.clip.startTime, 'seconds');
        const minutes = duration.minutes();
        const seconds = duration.seconds();
        console.info('duration: ', minutes, seconds, duration);
        // Build length string
        let length = '';
        if (minutes > 0) length += `${minutes} MINUTE`;
        if (minutes > 1) length += 'S';
        if (minutes > 0) length += ` `;
        if (seconds > 0) length += `${seconds} SECOND`;
        if (seconds > 1) length += 'S';
        return (
            <TouchableOpacity style={styles.wrapper}
                              activeOpacity={0.7}
                              onPress={this.togglePlay.bind(this)}>
                <Icon name={this.state.playing ? 'pause-circle-outline' : 'play-circle-outline'}
                      color={colors.white}
                      style={styles.icon}
                      size={60}/>
                <BoldCaps style={styles.length}>{length}</BoldCaps>
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
        alignSelf: 'stretch',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 160,
        marginTop: -12
    },
    icon: {
        backgroundColor: 'transparent'
    },
    length: {
        marginTop: 12
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