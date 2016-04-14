import React, {
    Animated,
    AppleEasing,
    Component,
    DeviceEventEmitter,
    Dimensions,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    UIManager,
    View
} from 'react-native';
import Relay from 'react-relay';

import {connect} from 'react-redux';
import {player$, hidePlayer, pause, resume} from '../../redux/modules/player.js';
import colors from '../../colors.js';
import Scrubber from './Scrubber';
import Controls from './Controls';
//import SocialButtons from './SocialButtons';
import ShareButton from './ShareButton';
import CommentCompose from './CommentCompose';
import EpisodePlayer from './../Audio/EpisodePlayer';
import Info from './Info';
import MiniPlayer from './MiniPlayer';

import Navbar from './Navbar';
import Annotations from './../PlayerAnnotations/AnnotationsListview';
import AnnotationSpawner from '../PlayerAnnotations/AnnotationSpawner';
import EmojiSpawner from '../EmojiSploder/EmojiSpawner';
import CompactScrubber from './CompactScrubber';
import Compose from './Compose';
import ButtonRow from './ButtonRow';
import ScrollableAnnotationView from '../PlayerAnnotations/ScrollableAnnotationView';
import ScrollableAnnotationContainer from '../PlayerAnnotations/ScrollableAnnotationContainer';

import EmojiSploder from '../EmojiSploder/EmojiSploder';

const OFFSCREEN = Dimensions.get('window').height + 50;
const windowWidth = Dimensions.get('window').width;

class Player extends Component {

    static propTypes = {};

    static defaultProps = {};

    state = {
        //opacity: new Animated.Value(1),
        //offset: new Animated.Value(OFFSCREEN),
        //opacity: new Animated.Value(1),
        //offset: new Animated.Value(0),
        composeVisible: false,
        keyboardHeight: new Animated.Value(0),
    };

    _keyboardSpring = {
        tension: 50,
        friction: 12
    };

    componentWillMount() {
        DeviceEventEmitter.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        DeviceEventEmitter.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
    }

    keyboardWillShow(ev) {
        if (this.props.visible) {
            //console.info('keyboard will show!', ev);
            Animated.spring(this.state.keyboardHeight, {
                toValue: -ev.endCoordinates.height,
                tension: 70,
                friction: 12
            }).start();
            this.props.dispatch(pause());
        }
    }

    keyboardWillHide(ev) {
        if (this.props.visible) {
            //console.info('keyboard will hide!');
            Animated.spring(this.state.keyboardHeight, {
                toValue: 0,
                tension: 60,
                friction: 10
            }).start();
            this.props.dispatch(resume());
        }
    }

    handleWaveformPress() {
        //console.info('waveform was pressed, and playing is: ', this.props.playing);
        if (this.props.playing) this.props.dispatch(pause());
        else this.props.dispatch(resume())
    }

    render() {
        if (!this.props.episode) {
            console.warn('player got null episode :-(');
            return <View />;
        }
        return (

            <View style={styles.content}>

                <ScrollableAnnotationContainer
                    episode={this.props.episode}
                />

                <CompactScrubber
                    episode={this.props.episode}
                    hidePlayer={() => this.props.dispatch(hidePlayer())}
                    onWaveformPress={this.handleWaveformPress.bind(this)}
                />

                <ButtonRow
                    episode={this.props.episode}
                    style={styles.buttonRow}
                    onCommentPress={() => this.setState({composeVisible: true})}
                    visible={true}
                />

                { false && <MiniPlayer
                    episode={this.props.episode}
                />}

                {/** views that come above everyhing*/}
                <CommentCompose
                    episode={this.props.episode}
                    visible={this.state.composeVisible}
                    scrubberHeight={84}
                    hide={() => this.setState({composeVisible: false})}
                />

                {/** non-views*/}
                <EpisodePlayer
                    ref="audio"
                    episode={this.props.episode}
                    podcast={this.props.episode.podcast}
                />

                <EmojiSploder
                    episode={this.props.episode}
                    targetLayout={{
                        left: windowWidth/2 - 40,
                        bottom: buttonRowBottom,
                        width: 80,
                        height: 80
                    }}
                />

            </View>
        );
    }
}

const buttonRowBottom = 40;

let styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: colors.darkGrey
    },
    navbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0
    },
    content: {
        flex: 1,
        position: 'relative',
        //backgroundColor: 'green'
    },
    buttonRow: {
        height: 135
    }
});

let ConnectedPlayer =  connect(player$)(Player);

export default Relay.createContainer(ConnectedPlayer, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                id
                ${EpisodePlayer.getFragment('episode')}
                ${CompactScrubber.getFragment('episode')}
                ${Info.getFragment('episode')}
                ${Navbar.getFragment('episode')}
                ${CommentCompose.getFragment('episode')}
                ${Annotations.getFragment('episode')}
                ${AnnotationSpawner.getFragment('episode')}
                ${MiniPlayer.getFragment('episode')}
                ${ScrollableAnnotationContainer.getFragment('episode')}
                ${EmojiSploder.getFragment('episode')}
                ${ButtonRow.getFragment('episode')}
                podcast {
                    ${EpisodePlayer.getFragment('podcast')}
                    ${Navbar.getFragment('podcast')}
                }
            }
        `
    }
})