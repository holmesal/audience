import React, {
    Animated,
    Component,
    View
} from 'react-native';

export default class EasingTest extends Component {

    state = {
        input: new Animated.Value(0)
    };

    componentDidMount() {
        const max = 2;
        const output = this.state.input.interpolate({
            inputRange: [0,max],
            outputRange: [0,1/max],
            easing: t => 1 / t
        });

        setInterval(() => {
            const input = this.state.input.__getValue();
            const expected = 1 / input;
            const actual = output.__getValue();
            const error = Math.abs(expected - actual) / max;
            console.info(`f(${input}) = ${actual}   (expected ${expected}, error ${Math.round(error * 100)}%`);
        }, 200);

        Animated.timing(this.state.input, {
            toValue: max,
            duration: 10000
        }).start();
    }


    render() {
        return <View />
    }
}