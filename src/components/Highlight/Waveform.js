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

const waveformWidth = 3060;

export default class Waveform extends Component {

    static propTypes = {
        episodeDuration: PropTypes.number.isRequired,
        highlightWidth: PropTypes.number.isRequired,
        minimumDuration: PropTypes.number.isRequired,
        startTime: PropTypes.object.isRequired,
        endTime: PropTypes.object.isRequired
    };

    render() {

        /**
         * Now figure out the scale
         * For a highlight that enclosed everything, the highlightDuration would be the same as the episode
         *      duration, and we'd scale the waveform so that it was the same width as the highlight area.
         * This is the scale factor that we'd scale to in that case:
         */
        //const scaleFactor = this.props.highlightWidth / waveformWidth;
        //const negativeStartTime = this.props.startTime.interpolate({
        //    inputRange: [0, this.props.episodeDuration],
        //    outputRange: [0, -this.props.episodeDuration]
        //});
        //const animatedDuration = Animated.add(this.props.endTime, negativeStartTime);
        //console.info(animatedDuration)
        //
        ////const animatedDuration = new Animated.Value(this.props.episodeDuration);
        //
        //const scaleX = animatedDuration.interpolate({
        //    inputRange: [this.props.minimumDuration, this.props.episodeDuration],
        //    outputRange: [1, scaleFactor]
        //});
        //
        ////const rightHandleOffset = scaleX.interpolate({
        ////    inputRange: [0, 0.21, 1],
        ////    outputRange: [0, 0, -255]
        ////});
        //
        //
        //
        //// It's currently scaling around it's own center, so we need to shift it left
        //// So that it scales around the center of our window
        ////const shiftLeft = scaleX.interpolate({
        ////    inputRange: [scaleFactor - 0.00000001, scaleFactor, 1],
        ////    outputRange: [0, -waveformWidth/2, 0]
        ////});
        //const centered = new Animated.Value(-waveformWidth/2 + this.props.highlightWidth/2);
        ////const scaledShift = Animated.multiply(scaleX, shiftLeft);
        //
        //const leftHandle = Animated.add(centered, scaleX.interpolate({
        //    inputRange: [scaleFactor, 1],
        //    outputRange: [0, waveformWidth/2 - this.props.highlightWidth/2]
        //}));
        //
        //const rightHandle = Animated.add(leftHandle, scaleX.interpolate({
        //    inputRange: [scaleFactor, 1],
        //    outputRange: [0, -waveformWidth + this.props.highlightWidth]
        //}));
        //
        //const totalX = this.props.scaleAround === 'start' ? rightHandle : leftHandle;
        //
        //
        //
        ///**
        // * Figure out how far left to translate the waveform, based on how much of the episode we've played
        // */
        //const translateX = this.props.startTime.interpolate({
        //    inputRange: [0, this.props.episodeDuration],
        //    outputRange: [0, -waveformWidth]
        //});

        // Scale the startTime translation
        //const scaledTranslate = Animated.multiply(scaleX, translateX);

        //const leftOrigin = Animated.add(shiftLeft, Animated.multiply(-this.props.highlightWidth/2, scaleX))


        //let totalX = Animated.add(scaledTranslate, shiftLeft);
        //let totalX = Animated.add(scaledTranslate, leftOrigin);
        //totalX = Animated.add(totalX, Animated.multiply(rightHandleOffset, scaleX));
        //totalX = Animated.add(totalX, Animated.multiply(scaleX, rightHandleOffset));

        // Pixels per millisecond
        const rho = this.props.highlightWidth / this.props.minimumDuration; // px/ms
        //const rho = waveformWidth / this.props.episodeDuration; // px/ms

        // The number of pixels in the maximum duration
        //const wMaxDuration = rho * this.props.episodeDuration;
        //
        //// The scale factor between the minimum duration and the maximum duration
        //const SFMaxDuration = this.props.highlightWidth / wMaxDuration;
        //console.info('SFMaxDuration: ', SFMaxDuration);

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
        const minNewPixels = rho * this.props.minimumDuration;
        const maxNewPixels = rho * this.props.episodeDuration;

        // What scale factor will fit this number of pixels into the highlight?
        // TODO - this isn't returning the proper values
        const oneOverNewPixels = newPixels.interpolate({
            inputRange: [0, maxNewPixels],
            outputRange: [0, 1/maxNewPixels],
            easing: t => 1 / t
        });

        const scaleFactor = Animated.multiply(this.props.highlightWidth, oneOverNewPixels);

        //const scaleFactor = duration.interpolate({
        //    inputRange: [this.props.minimumDuration, this.props.episodeDuration],
        //    outputRange: [1, 1],
        //    easing: val => {
        //        console.info('interp: ', val)
        //        return 1/newPixels.__getValue();
        //    }
        //});

        //// The minimum width the waveform will ever be
        const minWaveformWidth = this.props.minimumDuration * rho;
        // The maximum width the waveform will ever be
        const maxWaveformWidth = this.props.episodeDuration * rho;
        //
        //const scaleFactor = newPixels.interpolate({
        //    inputRange: [minWaveformWidth, maxWaveformWidth],
        //    outputRange: [1, waveformWidth/maxWaveformWidth]
        //});

        //const newWaveformWidth = Animated.multiply(scaleFactor, waveformWidth);

        console.info({
            startTime: this.props.startTime.__getValue(),
            endTime: this.props.endTime.__getValue(),
            duration: duration.__getValue(),
            newPixels: newPixels.__getValue(),
            scaleFactor: scaleFactor.__getValue(),
            pixelsPerMs: rho,
            minWaveformWidth,
            maxWaveformWidth,
            scaleFactor: scaleFactor.__getValue(),
            oneOverNewPixels: oneOverNewPixels.__getValue()
        });
        //console.info('scale factor is: ', scaleFactor.__getValue());

        /**
         * Runs these transforms in order
         */

        const outerTransforms = [
            {translateX: -waveformWidth/2},
            // Scale by the scale factor
            {scaleX: scaleFactor},
            {scaleY: scaleFactor},
            {translateX: waveformWidth/2},
            {translateX: Animated.multiply(fracStart, Animated.multiply(waveformWidth, -1))},
        ];


        const innerTransforms = [
            // Move the center of the waveform to the left handle
            //{translateX: -waveformWidth/2},
            //{translateX: Animated.multiply(newWaveformWidth, 0.5)},
            //{translateX: Animated.multiply(fracStart, Animated.multiply(newWaveformWidth, -1))},

            // Stick the left edge back at 0
            // Offset by the current time
        ];




        return (
            <View style={[styles.wrapper, this.props.style]}>
                <Animated.View style={[{transform: outerTransforms}]}>
                    <Animated.View style={{transform: innerTransforms}}>
                        <Image style={styles.waveform} source={require('image!waveform')} />
                    </Animated.View>
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
        alignItems: 'center'
    },
    waveform: {
        width: waveformWidth,
        tintColor: colors.darkGrey
    }
});