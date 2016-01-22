import React, {
    Animated,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';

export default class TouchableFade extends Component {

    static propTypes = {

    };

    static defaultProps = {
        duration: 200,
        underlayColor: 'DB4B23'
    };

    state = {
        underlayOpacity: new Animated.Value(0)
    };

    flash() {
        this.fadeIn(this.fadeOut)
    }

    fadeIn(cb) {
        Animated.timing(this.state.underlayOpacity, {
            toValue: 1,
            duration: this.props.duration/2
        }).start(cb && cb.bind(this))
    }

    fadeOut() {
        Animated.timing(this.state.underlayOpacity, {
            toValue: 0,
            duration: this.props.duration/2
        }).start();
    }

    handlePress(ev) {
        this.flash();
        if (this.props.onPress) this.props.onPress(ev);
    }

    handlePressIn(ev) {
        this.fadeIn();
        if (this.props.onPressIn) this.props.onPressIn(ev);
    }

    handlePressOut(ev) {
        this.fadeOut();
        if (this.props.onPressOut) this.props.onPressOut(ev);
    }

    render() {
        return (
            <TouchableWithoutFeedback {...this.props}
                onPress={this.handlePress.bind(this)}
                onPressIn={this.handlePressIn.bind(this)}
                onPressOut={this.handlePressOut.bind(this)}
            >
                <View style={[styles.wrapper, this.props.style]}>
                    <Animated.View style={[styles.underlay,
                        {opacity: this.state.underlayOpacity,
                        backgroundColor: this.props.underlayColor
                    }]} />
                    {this.props.children}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        backgroundColor: 'transparent'
    },
    underlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0
    }
});