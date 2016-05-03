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

import DebugView from '../common/DebugView';
import colors from '../../colors';

const waveformWidth = 1173;

export default class Waveform extends Component {

    static propTypes = {
        episodeDuration: PropTypes.number.isRequired,
        highlightWidth: PropTypes.number.isRequired,
        minimumDuration: PropTypes.number.isRequired
    };

    render() {
        const translateX = this.props.startTime.interpolate({
            inputRange: [0, this.props.episodeDuration],
            outputRange: [0, -waveformWidth]
        });

        /**
         * Now figure out the scale
         * For a highlight that enclosed everything, the highlightDuration would be the same as the episode
         *      duration, and we'd scale the waveform so that it was the same width as the highlight area.
         * This is the scale factor that we'd scale to in that case:
         */
        const scaleFactor = this.props.highlightWidth / waveformWidth;
        //const scaleX = Animated.this.props.highlightDuration.interpolate({
        //    inputRange: [this.props.minimumDuration, this.props.episodeDuration],
        //    outputRange: [1, scaleFactor]
        //});
        return (
            <Animated.View style={[styles.wrapper, this.props.style, {transform: [{translateX}]}]}>
                <Image style={styles.waveform} source={require('image!waveform')} />
            </Animated.View>
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