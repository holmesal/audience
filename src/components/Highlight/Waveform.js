import React, {
    Animated,
    Component,
    Easing,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import DebugView from '../common/DebugView';
import colors from '../../colors';
import ProcGenWaveform from './ProcGenWaveform';

//const waveformWidth = 3060;

export default class Waveform extends Component {

    static propTypes = {
        episodeDuration: PropTypes.number.isRequired,
        highlightWidth: PropTypes.number.isRequired,
        defaultDuration: PropTypes.number.isRequired,
        startTime: PropTypes.object.isRequired,
        endTime: PropTypes.object.isRequired,
        height: PropTypes.number.isRequired
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.episodeDuration != this.props.episodeDuration ||
            nextProps.highlightWidth != this.props.highlightWidth ||
            nextProps.highlightWidth != this.props.highlightWidth ||
            nextProps.defaultDuration != this.props.defaultDuration ||
            nextProps.startTime != this.props.startTime ||
            nextProps.endTime != this.props.endTime ||
            nextProps.height != this.props.height
        ) return true;
        return false;
    }

    render() {
        console.info('Highlight.Waveform is rendering!')

        // Pixels per millisecond
        const rho = this.props.highlightWidth / this.props.defaultDuration; // px/ms

        // The fraction of the episode duration that the start time starts at
        const fracStart = this.props.startTime.interpolate({
            inputRange: [0, this.props.episodeDuration],
            outputRange: [0, 1]
        });

        // Calculate the new duration that needs to fit in the window
        const negativeStartTime = Animated.multiply(this.props.startTime, -1);
        const duration = Animated.add(this.props.endTime, negativeStartTime);

        // How many pixels represent this new duration?
        const newPixels = Animated.multiply(duration, rho);

        // The maximum number of new pixels is the same as the waveform's width, which is set by the episode's duration
        const waveformWidth = rho * this.props.episodeDuration;

        // What scale factor will fit this number of pixels into the highlight?
        // BLACK MAGIC VODOO EASING FUNCTION
        const oneOverNewPixels = newPixels.interpolate({
            inputRange: [0, waveformWidth],
            outputRange: [0, 1/waveformWidth],
            easing: t => 1 / t
        });

        const scaleFactor = Animated.multiply(this.props.highlightWidth, oneOverNewPixels);

        const scaleY = scaleFactor.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp'
            // TODO - ease the "bump" when we transition from SF > 1 to SF < 1
            //easing: Easing.ease
        });

        // The maximum width the waveform will ever be
        const maxWaveformWidth = this.props.episodeDuration * rho;

        console.info({
            startTime: this.props.startTime.__getValue(),
            endTime: this.props.endTime.__getValue(),
            duration: duration.__getValue(),
            newPixels: newPixels.__getValue(),
            scaleFactor: scaleFactor.__getValue(),
            pixelsPerMs: rho,
            maxWaveformWidth,
            scaleFactor: scaleFactor.__getValue(),
            oneOverNewPixels: oneOverNewPixels.__getValue()
        });

        /**
         * Runs these transforms in order
         */

        const transforms = [
            {translateX: -waveformWidth/2},
            // Scale by the scale factor
            {scaleX: scaleFactor},
            {scaleY: scaleY},
            {translateX: waveformWidth/2},
            {translateX: Animated.multiply(fracStart, Animated.multiply(waveformWidth, -1))},
            //{translateY: Animated.multiply(scaleFactor, 0)}
        ];

        return (
            <View style={[styles.wrapper, this.props.style]}>
                <Animated.View style={[{transform: transforms}]}>
                    <ProcGenWaveform
                        style={[styles.waveform]}
                        width={waveformWidth}
                        height={this.props.height}
                        strokeColor={colors.darkGrey}
                    />
                </Animated.View>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        //flex: 1,
        //width: 1173
        flexDirection: 'row',
        alignItems: 'center',
        //backgroundColor: 'red',
        alignSelf: 'stretch',
        overflow: 'hidden'
    },
    waveform: {
        //width: waveformWidth,
        //tintColor: colors.darkGrey
    }
});