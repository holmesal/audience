import React, {
    Animated,
    Component,
    Dimensions,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

import colors from '../../colors';

export default class Waveform extends Component {

    state = {
        scaleY: new Animated.Value(1)
    };

    static propTypes = {
        width: PropTypes.number.isRequired,
        collapsed: PropTypes.bool.isRequired
    };

    static defaultProps = {
        collapsed: false
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.width != this.props.width ||
            nextProps.collapsed != this.props.collapsed
        ) {
            return true;
        }
        return false;
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.collapsed != this.props.collapsed) {
            // Grow/shrink the waveform based on playing state
            if (!nextProps.collapsed) Animated.spring(this.state.scaleY, { toValue: 1 }).start();
            else Animated.spring(this.state.scaleY, { toValue: 0.1 }).start();
        }
    }

    renderFakeWaveforms() {
        const howManyWaveforms = Math.ceil(this.props.width / waveformSegmentWidth);
        //console.info(`${howManyWaveforms} waveforms needed!`);
        return _.map(_.range(0, howManyWaveforms), i => <Image key={`fakeWaveform-${i}`} style={[styles.fakeWaveform]} source={require('image!waveform')} />);
    }

    render() {
        console.info('waveform render!', this.props.width);
        return (
            <View style={styles.wrapper}>
                <View style={[styles.spacer, {marginRight: 0}]} />
                <Animated.View style={[styles.fakeWaveformWrapper, {transform: [{scaleY: this.state.scaleY}], width: this.props.width}]}>
                    {this.renderFakeWaveforms()}
                </Animated.View>
                <View style={[styles.spacer, {marginLeft: 0}]} />
            </View>
        );
    }
}

const waveformHeight = 40;
const waveformSegmentWidth = 1173;
const windowWidth = Dimensions.get('window').width;

let styles = StyleSheet.create({
    wrapper: {
        //flex: 1
        alignSelf: 'stretch',
        flexDirection: 'row'
    },
    spacer: {
        width: windowWidth/2,
        height: 1,
        backgroundColor: colors.darkGrey,
        opacity: 0.09
    },
    fakeWaveformWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        position: 'relative',
        //backgroundColor: 'rgba(255,0,0,0.3)',
        overflow: 'hidden'
    },
    fakeWaveform: {
        height: waveformHeight,
        tintColor: colors.lighterGrey
    },
});