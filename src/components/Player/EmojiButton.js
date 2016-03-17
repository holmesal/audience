import React, {
    Component,
    Image,
    PanResponder,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import CircleButton from './CircleButton';
import colors from '../../colors';

import EmojiSploder from '../EmojiSploder/EmojiSploder';

export default class EmojiButton extends Component {

    static propTypes = {};

    static defaultProps = {};

    componentWillMount() {
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => {
                this.props.onPressIn();
                return false;
            },
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => false,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

            onPanResponderGrant: (evt, gestureState) => {
                // The guesture has started. Show visual feedback so the user knows
                // what is happening!
                console.info('pan responder granted!');
                //this.props.onPressIn();

                // gestureState.{x,y}0 will be set to zero now
                //this.show();
            },
            onPanResponderMove: (ev, gestureState) => {
                console.info('emoji button move');
                //const {locationX, locationY} = ev.nativeEvent;
                //this.focusCellUnderTouch(locationX, locationY);

                // The most recent move distance is gestureState.move{X,Y}

                // The accumulated gesture distance since becoming responder is
                // gestureState.d{x,y}
            },
            onPanResponderTerminationRequest: (evt, gestureState) => {
                console.info('emoji button termination request')
            },
            onPanResponderRelease: (evt, gestureState) => {
                // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded
                console.info('emoji button released')
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // Another component has become the responder, so this gesture
                // should be cancelled
                console.info('terminated!');
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // Returns whether this component should block native components from becoming the JS
                // responder. Returns true by default. Is currently only supported on android.
                return true;
            }
        });
    }


    render() {
        return (
            <View
                onPressIn={this.props.onPressIn}
                {...this._panResponder.panHandlers}
            >
                <Icon
                    name="android-happy"
                    size={24}
                    color={colors.lighterGrey}
                />
            </View>
        );
    }
}

let styles = StyleSheet.create({
});