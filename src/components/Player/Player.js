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
import EpisodePlayer from './EpisodePlayer';
import Info from './Info';
import MiniPlayer from './MiniPlayer';

import Navbar from './Navbar';
import Annotations from './../Annotations/AnnotationsListview';
import AnnotationSpawner from '../Annotations/AnnotationSpawner';
import EmojiSpawner from '../EmojiSploder/EmojiSpawner';
import CompactScrubber from './CompactScrubber';
import Compose from './Compose';
import ButtonRow from './ButtonRow';
import ScrollableAnnotationView from '../Annotations/ScrollableAnnotationView';
import ScrollableAnnotationContainer from '../Annotations/ScrollableAnnotationContainer';

import EmojiSploder from '../EmojiSploder/EmojiSploder';

const OFFSCREEN = Dimensions.get('window').height + 50;
const windowWidth = Dimensions.get('window').width;

class Player extends Component {

    static propTypes = {};

    static defaultProps = {};

    state = {
        opacity: new Animated.Value(0),
        offset: new Animated.Value(OFFSCREEN),
        composeVisible: false,
        duration: 0,
        currentTime: 0,
        lastTargetTime: 0,
        scrubbing: false,
        keyboardHeight: new Animated.Value(0),
        emojiSploderVisible: false,
        globalEmojiButtonPosition: null
    };

    _keyboardSpring = {
        tension: 50,
        friction: 12
    };

    componentWillMount() {
        DeviceEventEmitter.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        DeviceEventEmitter.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
    }

    componentDidMount() {
        this.updateVisibility();
    }

    componentDidUpdate(prevProps, prevState) {
        this.updateVisibility();
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

    updateVisibility() {
        if (this.props.visible) {
            Animated.spring(this.state.offset, {
                toValue: 0,
                tension: 32,
                friction: 8
            }).start();
        } else {
            Animated.spring(this.state.offset, {
                toValue: OFFSCREEN,
                tension: 31,
                friction: 9
            }).start();
        }
    }

    handleSkip(amount) {
        console.info('handling skip!');
        let lastTargetTime = this.state.currentTime + amount;
        if (lastTargetTime < 0) lastTargetTime = Math.random() * 0.0001; //rly small but still causes seek
        else if (lastTargetTime > this.state.duration) lastTargetTime = this.state.duration;
        this.setState({lastTargetTime});
    }

    handleWaveformPress() {
        //console.info('waveform was pressed, and playing is: ', this.props.playing);
        if (this.props.playing) this.props.dispatch(pause());
        else this.props.dispatch(resume())
    }

    renderAnnotationsCompose() {
        return <View style={{flex: 1}} />
        //return (
        //    <Animated.View style={{flex: 1, transform: [{translateY: this.state.keyboardHeight}]}}>
        //
        //        <Annotations
        //            episode={this.props.episode}
        //            style={styles.annotations}
        //        />
        //
        //        <Compose
        //            episode={this.props.episode}
        //        />
        //
        //    </Animated.View>
        //)
    }
    //
    //measureEmojiButtonRelativeToContainer(buttonRef) {
    //    let handle = React.findNodeHandle(buttonRef);
    //    let ancestorHandle = React.findNodeHandle(this.refs.wrapper);
    //    console.info(UIManager)
    //    UIManager.measureLayoutRelativeToParent(handle, ancestorHandle, (x, y, w, h, px, py) => {
    //        console.log('offset', x, y, w, h, px, py);
    //        //let scrollTarget = y - this.state.containerHeight + h;
    //        ////console.info('scrolLTarget', scrollTarget);
    //        //this.scrollTo({y: scrollTarget});
    //        //Animated.spring(this.state.opacity, {toValue: 1}).start();
    //        this.setState({globalEmojiButtonPosition: {
    //            x: px,
    //            y: py,
    //            w: w,
    //            h: h
    //        }});
    //    });
    //}

    oldRender() {
        if (!this.props.episode) {
            console.warn('player got null episode :-(');
            return <View />;
        }
        //console.info('player render!', this.state.emojiSploderVisible);
        let pointerEvents = this.props.visible ? 'auto' : 'none';
        return (
            <Animated.View
                ref="wrapper"
                style={[styles.wrapper, {transform: [{translateY: this.state.offset}]}]}
                pointerEvents={pointerEvents}
            >

                <View style={styles.content}>
                    <AnnotationSpawner
                        episode={this.props.episode}
                    />
                    <EmojiSpawner
                        episode={this.props.episode}
                    />
                </View>


                <Navbar
                    style={styles.navbar}
                    episode={this.props.episode}
                    podcast={this.props.episode.podcast}
                />

                <ButtonRow
                    style={styles.buttonRow}
                    onCommentPress={() => this.setState({composeVisible: true})}
                />

                <CompactScrubber
                    duration={this.state.duration}
                    currentTime={this.state.currentTime}
                    playing={this.props.playing}
                    onSeek={lastTargetTime => this.setState({lastTargetTime})}
                    hidePlayer={() => this.props.dispatch(hidePlayer())}
                    onScrubStart={() => this.setState({scrubbing: true})}
                    onScrubEnd={() => this.setState({scrubbing: false})}
                    onWaveformPress={this.handleWaveformPress.bind(this)}
                    episode={this.props.episode}
                    style={{top: this.state.keyboardHeight}}
                />

                <EpisodePlayer
                    ref="audio"
                    episode={this.props.episode}
                    podcast={this.props.episode.podcast}
                    lastTargetTime={this.state.lastTargetTime}
                    onDurationChange={duration => this.setState({duration})}
                    onCurrentTimeChange={currentTime => this.setState({currentTime})}
                    onSkip={this.handleSkip.bind(this)}
                />

                <EmojiSploder
                    targetLayout={{
                        left: windowWidth/2 - 30,
                        bottom: buttonRowBottom,
                        width: 60,
                        height: 60
                    }}
                />

            </Animated.View>
        );
    }

    render() {
        if (!this.props.episode) {
            console.warn('player got null episode :-(');
            return <View />;
        }
        console.info('player is visible? ', this.props.visible);
        let pointerEvents = this.props.visible ? 'auto' : 'none';
        return (
            <Animated.View
                ref="wrapper"
                style={[styles.wrapper, {transform: [{translateY: this.state.offset}]}]}
                pointerEvents={pointerEvents}
            >

                <View style={styles.content}>

                    <ScrollableAnnotationContainer
                        episode={this.props.episode}
                    />

                    <CompactScrubber
                        duration={this.state.duration}
                        currentTime={this.state.currentTime}
                        playing={this.props.playing}
                        onSeek={lastTargetTime => this.setState({lastTargetTime})}
                        hidePlayer={() => this.props.dispatch(hidePlayer())}
                        onScrubStart={() => this.setState({scrubbing: true})}
                        onScrubEnd={() => this.setState({scrubbing: false})}
                        onWaveformPress={this.handleWaveformPress.bind(this)}
                        episode={this.props.episode}
                    />

                    <ButtonRow
                        style={styles.buttonRow}
                        onCommentPress={() => this.setState({composeVisible: true})}
                        visible={this.props.visible && this.state.currentTime}
                    />

                    <MiniPlayer episode={this.props.episode} />

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
                        lastTargetTime={this.state.lastTargetTime}
                        onDurationChange={duration => this.setState({duration})}
                        onCurrentTimeChange={currentTime => this.setState({currentTime})}
                        onSkip={this.handleSkip.bind(this)}
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

            </Animated.View>
        );
    }
}

const buttonRowBottom = 35 + 60;

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
                podcast {
                    ${EpisodePlayer.getFragment('podcast')}
                    ${Navbar.getFragment('podcast')}
                }
            }
        `
    }
})