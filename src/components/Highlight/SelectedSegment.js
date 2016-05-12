import React, {
    Animated,
    Easing,
    Component,
    Image,
    NativeAppEventEmitter,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import DebugView from '../common/DebugView';
import colors from '../../colors';
import {prettyFormatTime} from '../../utils';

export default class SelectedSegment extends Component {

    static propTypes = {

        // The current playback mode
        loopMode: PropTypes.oneOf(['full', 'start', 'end']),

        // The duration of the selected segment, in milliseconds
        duration: PropTypes.number,

        // How much time (in milliseconds) to offset the loop from the end/start
        edgeLoopAmount: PropTypes.number,

        // Method to play the audio from a specific relative segment time
        playFromRelativeSegmentTime: PropTypes.func.isRequired

    };

    static defaultProps = {
        loopMode: 'full',
        duration: 5000,
        edgeLoopAmount: 5000,
        playFromRelativeSegmentTime: (relSegTime) => {}
    };

    // The properties for the "next" animation
    _nextAnimProps = null;

    state = {
        playheadPosition: new Animated.Value(0),
        width: 0
    };

    componentDidMount() {
        this._nativeAudioStateSub = NativeAppEventEmitter.addListener('MTAudio.updateState', state => {
            console.info('[SelectedSegment] got new native audio state: ', state.playerState);
            if (this._nextAnimProps) {
                const distance = Math.abs(state.currentTime * 1000 - this._nextAnimProps.absoluteStartTime);
                console.info(Math.round(state.currentTime*1000), this._nextAnimProps.absoluteStartTime, distance);
                if (state.playerState === 'PLAYING' && distance < 2000) {
                    // Look for our specific start time:
                    console.info('running!')
                    this.startAnimation();
                }
            }
        });
    }

    componentWillUnmount() {
        this._nativeAudioStateSub.remove();
    }

    animate(loopMode) {
        //console.info('handling loopMode change: ', loopMode);
        //// Stop any running animations
        //this.state.playheadPosition.stopAnimation();
        // Animate, based on the loopMode

        let startValue, toValue, duration;
        if (loopMode === 'full') {
            startValue = 0;
            toValue = this.state.width;
            duration = this.props.duration;
            //console.info('loop loopMode - animating to: ', this.state.width)

        } else if (loopMode === 'start') {
            startValue = 0;
            toValue = (this.state.width / this.props.duration) * this.props.edgeLoopAmount;
            duration = this.props.edgeLoopAmount;
        } else if (loopMode === 'end') {
            startValue = this.state.width - (this.state.width / this.props.duration) * this.props.edgeLoopAmount;
            toValue = this.state.width;
            duration = this.props.edgeLoopAmount;
        }

        //console.info({startValue, toValue, duration});

        if (duration === 0) {
            console.warn('Not animating scrubber with 0 duration - that would create a call stack overflow, silly. Check yo shit.');
            return false;
        }

        // Seek to this offset in the audio
        const frac = startValue / this.state.width;
        const relativeStartTime = frac * this.props.duration;
        const absoluteStartTime = relativeStartTime + this.props.startTime._value;
        this.props.playFromRelativeSegmentTime(relativeStartTime);

        // Store these animation props for use in the next animation
        // This animation will be automatically kicked off when the next "playing" event comes through from the native audio component
        setTimeout(() => {
            this._nextAnimProps = {
                startValue, toValue, duration,
                absoluteStartTime
            };
        }, 0);

        // Set the playhead to where we'll start from
        this.state.playheadPosition.setValue(startValue);
    }

    startAnimation() {
        if (this._nextAnimProps) {
            // Grab and clear the animation properties
            const {startValue, toValue, duration} = this._nextAnimProps;
            this._nextAnimProps = null;
            // Do the animation
            Animated.timing(this.state.playheadPosition, {
                toValue,
                easing: Easing.linear,
                duration
            }).start(({finished}) => {
                // Only loop again if this animation wasn't cancelled
                if (finished) {
                    //console.info('animation finished!');
                    this.animate(this.props.loopMode);
                }
            });
        }
    }

    handleLayout(ev) {
        const {x, y, width, height} = ev.nativeEvent.layout;
        console.info(width);
        this.setState({width});
        this.animate(this.props.loopMode);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.loopMode != this.props.loopMode ||
            nextProps.duration != this.props.duration
        ) {
            return true;
        }

        return false;

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.loopMode != prevProps.loopMode && this.props.loopMode != 'full') this.animate(this.props.loopMode);
    }

    render() {
        return (
            <View style={[styles.wrapper, this.props.style]} onLayout={this.handleLayout.bind(this)}>
                <Animated.View style={[styles.shrinkable, this.props.shrinkTransform]}>
                    <Animated.View style={[styles.playHead, {transform: [{translateX: this.state.playheadPosition}]}]} />
                </Animated.View>
                <Text style={styles.time}>{prettyFormatTime(this.props.duration / 1000)}</Text>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center'
    },
    shrinkable: {
        backgroundColor: 'rgba(255, 234, 88, 0.76)',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    playHead: {
        position: 'absolute',
        width: 2,
        top: 0,
        bottom: 0,
        backgroundColor: colors.blue
    },
    time: {
        fontFamily: 'System',
        fontSize: 20,
        color: colors.darkGrey,
        letterSpacing: 0.38,
        fontWeight: '600',
        backgroundColor: 'transparent',
        marginBottom: -88
    }
});