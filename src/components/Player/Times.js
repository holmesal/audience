import React, {
    Animated,
    Component,
    Dimensions,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

import colors from './../../colors';
import {prettyFormatTime} from './../../utils';

let initialTextX = 10;

export default class Times extends Component {

    static propTypes = {
        fraction: React.PropTypes.number.isRequired,
        length: React.PropTypes.number.isRequired
    };

    state = {
        sepScale: new Animated.Value(0),
        leftTextX: new Animated.Value(initialTextX),
        rightTextX: new Animated.Value(-initialTextX),
        textOpacity: new Animated.Value(0)
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            Animated.spring(this.state.sepScale, {
                toValue: 1,
                tension: 80,
                friction: 12
            }).start();
            Animated.spring(this.state.textOpacity, {
                toValue: 1,
                tension: 200,
                friction: 12
            }).start();

            // Animated text
            Animated.spring(this.state.leftTextX, {
                toValue: 0,
                tension: 40,
                friction: 12
            }).start();
            Animated.spring(this.state.rightTextX, {
                toValue: 0,
                tension: 40,
                friction: 12
            }).start()
        } else {
            Animated.spring(this.state.sepScale, {
                toValue: 0,
                tension: 30,
                friction: 12
            }).start();
            Animated.spring(this.state.textOpacity, {
                toValue: 0,
                tension: 10,
                friction: 12
            }).start();
            Animated.spring(this.state.leftTextX, {
                toValue: initialTextX/3,
                tension: 20,
                friction: 12
            }).start(() => this.state.leftTextX.setValue(initialTextX));
            Animated.spring(this.state.rightTextX, {
                toValue: -initialTextX/3,
                tension: 20,
                friction: 12
            }).start(() => this.state.rightTextX.setValue(-initialTextX))
        }
    }

    render() {
        return (
            <View style={[styles.wrapper, this.props.style]}>
                <Animated.Text style={[styles.text, styles.left, {transform: [{translateX: this.state.leftTextX}], opacity: this.state.textOpacity}]} monospace>{prettyFormatTime(this.props.fraction * this.props.length)}</Animated.Text>
                <Animated.View style={[styles.sep, {transform: [{scaleY: this.state.sepScale}], opacity: this.state.textOpacity}]} />
                <Animated.Text style={[styles.text, styles.right, {transform: [{translateX: this.state.rightTextX}], opacity: this.state.textOpacity}]} monospace>{prettyFormatTime(this.props.length)}</Animated.Text>
            </View>
        );
    }
}

let windowWidth = Dimensions.get('window').width;
let windowHeight = Dimensions.get('window').height;
let textPadding = 28;

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    sep: {
        width: 2,
        height: 18,
        backgroundColor: colors.white,
        position: 'absolute',
        left: windowWidth/2 - 1,
        bottom: 0
    },
    text: {
        position: 'absolute',
        fontSize: 24,
        color: colors.white,
        bottom: -6,
        letterSpacing: 3.24,
        fontFamily: 'System'
    },
    left: {
        right: windowWidth/2 + textPadding,
        textAlign: 'right'
    },
    right: {
        left: windowWidth/2 + textPadding,
        textAlign: 'right'
    }
});