import React, {
    Animated,
    Easing,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import DebugView from '../common/DebugView';
import colors from '../../colors';

export default class SelectedSegment extends Component {

    static propTypes = {

        // The current playback mode
        loopMode: PropTypes.oneOf(['full', 'start', 'end']),

        // The duration of the selected segment, in milliseconds
        duration: PropTypes.number,

        // How much time (in milliseconds) to offset the loop from the end/start
        edgeLoopAmount: PropTypes.number
    };

    static defaultProps = {
        loopMode: 'full',
        duration: 5000,
        edgeLoopAmount: 1000
    };

    state = {
        playheadPosition: new Animated.Value(0),
        width: 0
    };

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

        this.state.playheadPosition.setValue(startValue);
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
        })
    }

    handleLayout(ev) {
        const {x, y, width, height} = ev.nativeEvent.layout;
        console.info(width);
        this.setState({width});
        this.animate(this.props.loopMode);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.loopMode != this.props.loopMode
        ) {
            return true;
        }

        return false;

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.loopMode != prevProps.loopMode) this.animate(this.props.loopMode);
    }

    render() {
        return (
            <View style={[styles.wrapper, this.props.style]} onLayout={this.handleLayout.bind(this)}>
                <Animated.View style={[styles.playHead, {transform: [{translateX: this.state.playheadPosition}]}]} />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        backgroundColor: colors.yellow,
        position: 'relative',
        opacity: 0.5
    },
    playHead: {
        position: 'absolute',
        width: 2,
        top: 0,
        bottom: 0,
        backgroundColor: colors.red
    }
});