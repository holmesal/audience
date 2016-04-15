import React, {
    Animated,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default class AnimatedTab extends Component {

    static propTypes = {
        index: PropTypes.number,
        current: PropTypes.number
    };

    state = {
        visibility: new Animated.Value(0),
        opacity: new Animated.Value(0),
        touches: false
    };

    componentDidMount() {
        this.updateVisibility();
    }


    componentDidUpdate(prevProps, prevState) {
        this.updateVisibility();
    }

    updateVisibility() {
        //const target = this.props.visible ? 1 : 0;
        const current = this.props.current - this.props.index;
        if (current <= -1) {
            this.state.visibility.setValue(-1);
            if (this.state.touches) this.setState({touches: false});
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 50
            }).start();
        } else if (current >= 1) {
            this.state.visibility.setValue(1);
            if (this.state.touches) this.setState({touches: false});
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 50
            }).start();
        } else {
            Animated.spring(this.state.visibility, {
                toValue: current,
                //tension: 100,
                //friction: 30
            }).start();
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 50
            }).start();
            if (!this.state.touches) this.setState({touches: true});
        }
    }

    render() {
        const pointerEvents = this.state.touches ? 'auto' : 'none';
        const scale = this.state.visibility.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [1, 1,1]
        });
        const translate = this.state.visibility.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [3, 0, -3]
        });
        const opacity = this.state.visibility.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [0, 1, 0]
        });
        return (
            <Animated.View style={[styles.wrapper, {opacity: this.state.opacity, transform: [{translateX: translate}, {scale}]}]} pointerEvents={pointerEvents}>
                {this.props.children}
            </Animated.View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
});