import React, {
    Animated,
    Component,
    Image,
    PanResponder,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import CircleButton from './CircleButton';
import colors from '../../colors';
import {connect} from 'react-redux';
import {emojiButton$} from '../../redux/modules/player';

import EmojiSploder from '../EmojiSploder/EmojiSploder';

class EmojiButton extends Component {

    static propTypes = {};

    static defaultProps = {};

    state = {
        buttonScale: new Animated.Value(1),
        opacity: new Animated.Value(1)
    };

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

    componentWillReceiveProps(nextProps) {
        if (nextProps.choosingEmoji) {
            Animated.spring(this.state.buttonScale, {
                toValue: 0.9,
                tension: 70
            }).start()
        } else {
            Animated.spring(this.state.buttonScale, {
                toValue: 1
            }).start()
        }
    }

    measure() {
        //console.info(this.refs.button);
        //this.props.onEmojiButtonLayout(this.refs.button);
        //let handle = React.findNodeHandle(this.refs.button);
        //UIManager.measure(handle, (x, y, w, h, px, py) => {
        //    console.log('offset', x, y, w, h, px, py);
        //    //let scrollTarget = y - this.state.containerHeight + h;
        //    ////console.info('scrolLTarget', scrollTarget);
        //    //this.scrollTo({y: scrollTarget});
        //    //Animated.spring(this.state.opacity, {toValue: 1}).start();
        //    this.props.onEmojiGlobalPositionCalculated({
        //        x: px,
        //        y: py,
        //        w: w,
        //        h: h
        //    });
        //});
    }

    componentDidUpdate(prevProps, prevState) {
        console.info('emoji button updated!')
        if (this.props.sendingEmoji) {
            this.fadeOutAndIn()
        }
    }

    fadeOutAndIn() {
        Animated.timing(this.state.opacity, {
            toValue: 0.3
        }).start(() => {
            if (!this.props.sendingEmoji) {
                Animated.spring(this.state.opacity, {
                    toValue: 1
                }).start()
            } else {
                Animated.timing(this.state.opacity, {
                    toValue: 0.5
                }).start((s) => {
                    this.fadeOutAndIn();
                })
            }
        })
    }

    render() {
        return (
            <TouchableOpacity
                ref="button"
                style={styles.wrapper}
                onPressIn={this.props.onPressIn}
                {...this._panResponder.panHandlers}
                onLayout={this.measure.bind(this)}
            >
                <Animated.Image
                    style={[styles.buttonImage, {
                        opacity: this.state.opacity,
                        transform: [
                            {scale: this.state.buttonScale}
                        ]
                    }]}
                    source={require('image!buttonEmoji')}
                />
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10
    },
    buttonImage: {
        width: 90,
        height: 90
    }
});

export default connect(emojiButton$)(EmojiButton);