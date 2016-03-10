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
        visibility: new Animated.Value(0)
    };

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

                // gestureState.{x,y}0 will be set to zero now
                this.show();
            },
            onPanResponderMove: (evt, gestureState) => {
                console.info(evt.nativeEvent)
                // The most recent move distance is gestureState.move{X,Y}

                // The accumulated gesture distance since becoming responder is
                // gestureState.d{x,y}
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded
                this.hide();
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // Another component has become the responder, so this gesture
                // should be cancelled
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // Returns whether this component should block native components from becoming the JS
                // responder. Returns true by default. Is currently only supported on android.
                return true;
            }
        })
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
        }).start()
    }

    //componentDidMount() {
    //    setTimeout(this.show.bind(this), 1000);
    //    setTimeout(this.hide.bind(this), 4000);
    //}


    render() {
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
                cell.scale = new Animated.Value(0.6);
                Animated.spring(cell.scale, {
                    toValue: this.state.visibility.interpolate({
                        inputRange: [0, activateAt - 0.001, activateAt, 1],
                        outputRange: [0.6, 0.6, 1, 1]
                    }),
                    friction: 4,
                    tension: 50
                }).start();
                //console.info(`[${ix},${iy}]   ${cell.distanceFromFocalPoint}`);
                // Add the cell to the array
                cells.push(cell);
            }
        }

        // Order cells by distance from origin
        cells = _.sortBy(cells, 'distanceFromFocalPoint');

        let cellViews = cells.map((cell, idx) => {
            return <Animated.View
                key={cell.key}
                style={[
                    styles.cellView,
                    {
                        top: cell.top,
                        left: cell.left,
                        width: cell.width,
                        height: cell.height,
                        //opacity: 1 - (cell.distanceFromFocalPoint/windowHeight)
                    },
                    {
                    opacity: cell.opacity,
                    transform: [{scale: cell.scale}]
                    }
                ]}
            ><Text style={{color: '#fefefe', fontSize: 35}}>😁</Text></Animated.View>
        });
        return (
            <View style={styles.wrapper} {...this._panResponder.panHandlers}>
                {cellViews}
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'transparent'
    },
    cellView: {
        //borderWidth: 1,
        //borderRadius: hitBoxSize/2,
        //borderColor: '#fefefe',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    }
});