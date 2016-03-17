import React, {
    Animated,
    Easing,
    Component,
    Dimensions,
    Image,
    PanResponder,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import _ from 'lodash';

import Emoji from 'react-native-emoji';

// window dimensions
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// padding (to account for navbar and bottom buttons)
const paddingTop = 20;
const paddingBottom = 50;

// effective area
const width = windowWidth;
let height = windowHeight - paddingTop - paddingBottom;

// size of emoji buttons and hitboxes
const emojiSize = 35;
const minHitBoxSize = emojiSize * 2;
const numCols = Math.floor(windowWidth / minHitBoxSize);
const hitBoxSize = windowWidth / numCols;

// "extra" height at the top/bottom to be taken up
const numRows = Math.floor(height / hitBoxSize);
const slackHeight = height - hitBoxSize * numRows;

// fake centerpoint
const focalPoint = {
    x: width / 2,
    y: height - 25
};

console.info(`rows: ${numRows}   cols: ${numCols}   hitBoxSize: ${hitBoxSize}`);

export default class EmojiSploder extends Component {

    state = {
        visibility: new Animated.Value(0),
        focused: null
    };

    rankedEmoji = [
        'clap',
        'joy',
        'hearts',
        'heart_eyes',
        '+1',
        'raised_hands',
        'unamused',
        'relaxed',
        'ok_hand',
        'grimacing',
        'kissing_heart',
        'blush',
        'pensive',
        'hankey',
        'weary',
        'sob',
        'smirk',
        'headphones',
        'grin',
        'flushed',
        'wink',
        'see_no_evil',
        'v',
        'expressionless',
        'disappointed',
        'cry',
        'sunglasses',
        'rage',
        'neutral_face',
        'scream',
        'broken_heart',
        'sweat_smile',
        'facepunch',
        'sweat'
    ];

    componentWillMount() {
        // Create a pan responder for the view
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                // The guesture has started. Show visual feedback so the user knows
                // what is happening!
                console.info('pan responder granted!');

                // gestureState.{x,y}0 will be set to zero now
                //this.show();
            },
            onPanResponderMove: (ev, gestureState) => {
                //console.info(ev.nativeEvent);
                const {locationX, locationY} = ev.nativeEvent;
                this.focusCellUnderTouch(locationX, locationY);

                // The most recent move distance is gestureState.move{X,Y}

                // The accumulated gesture distance since becoming responder is
                // gestureState.d{x,y}
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded
                this.hide();
                console.info('picked emoji!', this.state.focused);
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
        // Set up the list of cells
        this.initCells();
    }

    shouldComponentUpdate(nextProps, nextState) {
        //if (nextProps.visible != this.props.visible || nextState != this.state) return true
        return true;

    }

    componentWillUpdate(nextProps, nextState) {
        //console.info('updating!', nextProps, nextState);
        if (nextProps.visible != this.props.visible) {
            if (nextProps.visible) this.show();
            else this.hide();
        }
    }

    show() {
        console.info('showing!');
        Animated.timing(this.state.visibility, {
            toValue: 1,
            duration: 250
        }).start()
    }

    hide() {
        console.info('hiding!');
        Animated.timing(this.state.visibility, {
            toValue: 0,
            duration: 200
        }).start(() => {
            this.setState({focused: null});
        });
    }

    //componentDidMount() {
    //    setTimeout(this.show.bind(this), 1000);
    //    setTimeout(this.hide.bind(this), 4000);
    //}

    initCells() {
        let cells = [];
        for (let ix = 0; ix < numCols; ix++) {
            for (let iy = 0; iy < numRows; iy++) {
                // Calculate on-screen position
                let cell = {
                    left: hitBoxSize * ix,
                    top: hitBoxSize * iy + paddingTop,
                    width: hitBoxSize,
                    height: hitBoxSize,
                    key: `${ix},${iy}`
                };
                // Cell centers
                cell.cx = cell.left + cell.width/2;
                cell.cy = cell.top + cell.height/2;
                // Calculate offsets to the focal point
                let xOffset = focalPoint.x - cell.cx;
                let yOffset = focalPoint.y - cell.cy;
                cell.distanceFromFocalPoint = Math.sqrt(Math.pow(xOffset, 2) + Math.pow(yOffset, 2));
                // Calculate the percentage of the visibility animation that this cell should activate at
                const activateAt = cell.distanceFromFocalPoint / Math.sqrt(Math.pow(windowWidth, 2) + Math.pow(windowHeight, 2));
                // Create animations for opacity and scale
                cell.opacity = new Animated.Value(0);
                Animated.spring(cell.opacity, {
                    toValue: this.state.visibility.interpolate({
                        inputRange: [0, activateAt - 0.001, activateAt, 1],
                        outputRange: [0, 0, 1, 1]
                    }),
                    friction: 7,
                    tension: 60,
                    //duration: 200
                }).start();
                // Scale animation
                cell.scale = new Animated.Value(0.3);
                Animated.spring(cell.scale, {
                    toValue: this.state.visibility.interpolate({
                        inputRange: [0, activateAt - 0.001, activateAt, 1],
                        outputRange: [0.3, 0.3, 0.5, 0.5]
                    }),
                    friction: 4,
                    tension: 50
                }).start();
                // Spring for hovering
                cell.hoverScale = new Animated.Value(1);
                //console.info(`[${ix},${iy}]   ${cell.distanceFromFocalPoint}`);
                // Add the cell to the array
                cells.push(cell);
            }
        }
        this._cells = cells;

        // Order cells by distance from origin
        let distanceOrderedCells = _.sortBy(this._cells, 'distanceFromFocalPoint');
        // Create the views
        this._cellViews = distanceOrderedCells.map((cell, idx) => {
            let emojiName = cell.emojiName = this.rankedEmoji[idx] || 'coffee';
            return <View
                key={cell.key}
                style={[
                    styles.cellView,
                    {
                        top: cell.top,
                        left: cell.left,
                        width: cell.width,
                        height: cell.height,
                        //opacity: 1 - (cell.distanceFromFocalPoint/windowHeight)
                    }
                ]}>
                <Animated.View style={[styles.emojiWrapper, {
                    opacity: cell.opacity,
                    transform: [{scale: cell.scale}]
                }]}>
                    <Animated.View style={[{transform: [{scale: cell.hoverScale}]}]}>
                        <Text style={{color: '#fefefe', fontSize: 70}}><Emoji name={emojiName} /></Text>
                    </Animated.View>
                </Animated.View>
            </View>
        });
    }

    focusCellUnderTouch(x, y) {
        let col = Math.floor(x / hitBoxSize);
        let row = Math.floor(y / hitBoxSize);
        if (col >= 0 && col < numCols && row >= 0 && row < numRows) {
            let focused = this._cells[(col * numRows) + row];
            this.setState({focused});
        } else {
            this.setState({focused: null});
        }
    }

    render() {
        //console.info(this.state.focused);
        let pointerEvents = this.props.visible ? 'auto' : 'none';
        return (
            <View
                style={styles.wrapper}
                {...this._panResponder.panHandlers}
                pointerEvents={pointerEvents}
            >
                {this._cellViews}
            </View>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.focused && this.state.focused != prevState.focused) {
            //console.info('de-focusing', prevState.focused);
            Animated.spring(prevState.focused.hoverScale, {
                toValue: 1
            }).start();
        }
        if (this.state.focused) {
            Animated.spring(this.state.focused.hoverScale, {
                toValue: 1.5,
                friction: 8,
                tension: 80
            }).start();
        }
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignSelf: 'stretch',
        //backgroundColor: 'red',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    cellView: {
        //borderWidth: 1,
        //borderRadius: hitBoxSize/2,
        //borderColor: '#fefefe',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    },
    //emojiWrapper: {
    //    overflow: 'visible',
    //    backgroundColor: 'red',
    //    flex: 1,
    //    alignSelf: 'stretch'
    //}
});