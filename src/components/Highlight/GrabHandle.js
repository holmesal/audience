import React, {
    Animated,
    Component,
    Image,
    PanResponder,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import _ from 'lodash';
import DebugView from '../common/DebugView';
import colors from '../../colors';

export default class GrabHandle extends Component {

    _resetting = false;

    static defaultProps = {
        maxDisplacement: 60,

        onVelocityChange: () => {},
        onGrab: () => {},
        onRelease: () => {}
    };

    constructor(props) {
        super(props);
        const drag = new Animated.Value(0);
        const translateX = drag.interpolate({
            inputRange: [-100, 0, 100],
            outputRange: [-100, 0, 100]
        });
        drag.addListener(this.observeDragUpdate.bind(this));

        this.reportVelocityChange = _.throttle(velocity => {
            this.props.onVelocityChange(velocity);
        }, 100, {leading: true, trailing: true});

        this.state = {
            drag,
            translateX
        };
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                // The guesture has started. Show visual feedback so the user knows
                // what is happening!
                console.info('grabhandle is now panning')
                this.setState({resetting: false});
                // gestureState.{x,y}0 will be set to zero now
                this.props.onGrab();
            },
            onPanResponderMove: Animated.event([null, {
                dx: this.state.drag
            }]),
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded
                // send a fake event to indicate that we've stopped dragging
                this.observeDragUpdate({value: 0});
                // we are now resetting so
                this.setState({resetting: true});
                Animated.spring(this.state.drag, {
                    toValue: 0
                }).start(() => {
                    this.setState({resetting: false});
                });
                // Notify our parent that the handle was released
                this.props.onRelease();
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // Another component has become the responder, so this gesture
                // should be cancelled
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // Returns whether this component should block native components from becoming the JS
                // responder. Returns true by default. Is currently only supported on android.
                return true;
            },
        });
    }

    observeDragUpdate(val) {
        if (!this.state.resetting) {
            //console.info('translation update', val)
            this.reportVelocityChange(val.value / this.props.maxDisplacement)
        }
    }


    render() {
        return (
            <Animated.View style={[styles.wrapper, this.props.style, {transform: [{translateX: this.state.translateX}]}]} {...this._panResponder.panHandlers}>
                <View style={styles.indicator} />
            </Animated.View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        backgroundColor: colors.blue,
        alignItems: 'center',
        justifyContent: 'center'
    },
    indicator: {
        flex: 1,
        width: 4,
        backgroundColor: colors.darkGrey
    }
});