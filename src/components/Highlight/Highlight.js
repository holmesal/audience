import React, {
    Animated,
    Component,
    Dimensions,
    Easing,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import _ from 'lodash';
import DebugView from '../common/DebugView';
import colors from '../../colors';
import GrabHandle from './GrabHandle';
import SelectedSegment from './SelectedSegment';
import Waveform from './Waveform';

const {width} = Dimensions.get('window');

const sidePadding = 60;
const handleWidth = 100;

// How sensitive are the handles?
// default = 1
const sensitivity = 10;

// What is the minimum chunk of time a user can highlight?
const minimumDuration = 5000;

// How wide is the "highlighted" area on-screen?
const highlightWidth = width - (2 * sidePadding);

/**
 * TODO
 * enforce a minimum highlight duration
 */

export default class Highlight extends Component {

    static propTypes = {
        // Duration, in MILLISECONDS
        duration: PropTypes.number
    };

    state = {
        startTime: new Animated.Value(0),
        endTime: new Animated.Value(23000),
        activeHandle: null
    };

    componentDidMount() {
        this.state.startTime.addListener(this.logTimeRange.bind(this));
        this.state.endTime.addListener(this.logTimeRange.bind(this));
    }

    logTimeRange() {
        //console.info(`${_.round(this.state.startTime._value/1000, 2)} --- ${_.round(this.state.endTime._value/1000, 2)}`);
    }

    /**
     * Update the rate at which the duration is growing or shrinking
     * @param which - the start or end time?
     * @param velocity - the velocity with which the time is changing, in seconds per second
     */
    updateRateOfTimeChange(which, velocity) {
        //console.info(`updating velocity for ${which.toUpperCase()} to ${velocity}`);
        let projectionLength = 1000;
        // Get the animated value for the time we're referring to
        const animatedTime = (which === 'start') ? this.state.startTime : this.state.endTime;
        //console.info(animatedTime);
        // Project out to the value that we would hit if we maintained this velocity for {projectionLegth) seconds
        let projectedValue = animatedTime._value + projectionLength * velocity * sensitivity;

        // Make sure the projected value is inside the bounds
        const currentStartTime = this.state.startTime._value;
        const currentEndTime = this.state.endTime._value;
        if (which === 'start') {
            // Can't be before the beginning
            if (projectedValue < 0) projectedValue = 0;
            // Can't be later than {minimumDuration} seconds before the end time
            else if (projectedValue > currentEndTime - minimumDuration) {
                projectedValue = currentEndTime - minimumDuration;
            }
        } else {
            // Can't be before {minimumDuration} seconds after the start time
            if (projectedValue < currentStartTime + minimumDuration) {
                projectedValue = currentStartTime + minimumDuration;
            }
            // Can't be after the end
            if (projectedValue > this.props.duration){
                projectedValue = this.props.duration;
            }
        }

        //  Recalc the projected time in case it changed
        projectionLength = (projectedValue - animatedTime._value) / (velocity * sensitivity);

        // If the velocity is 0, just stop the animation
        if (velocity === 0) {
            animatedTime.stopAnimation();
        } else {
            Animated.timing(animatedTime, {
                toValue: projectedValue,
                easing: Easing.linear,
                duration: projectionLength
            }).start(({finished}) => {
                // We should never finish this animation unless the velocity was 0
                if (finished && velocity != 0) {
                    //console.info('caught up to touch!');
                }
            });
        }
    }

    getCurrentLoopMode() {
        switch(this.state.activeHandle) {
            case 'left':
                return 'start';
            case 'right':
                return 'end';
            default:
                return 'full';
        }
    }

    render() {
        return (
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                <View style={styles.wrapper}>
                    <Waveform startTime={this.state.startTime}
                              endTime={this.state.endTime}
                              episodeDuration={this.props.duration}
                              style={styles.waveform}
                              minimumDuration={minimumDuration}
                              highlightWidth={highlightWidth}
                              scaleAround={this.state.activeHandle}
                    />
                    <SelectedSegment style={styles.highlighted}
                                     loopMode={this.getCurrentLoopMode()}
                                     duration={5000}
                                     edgeLoopAmount={1000}
                    />
                    <GrabHandle style={[styles.handle, {left: sidePadding - handleWidth/2}]}
                                maxDisplacement={sidePadding}
                                onVelocityChange={v => this.updateRateOfTimeChange('start', v)}
                                onGrab={() => this.setState({activeHandle: 'start'})}
                                onRelease={() => this.setState({activeHandle: null})}
                    />
                    <GrabHandle style={[styles.handle, {right: sidePadding - handleWidth/2}]}
                                maxDisplacement={sidePadding}
                                onVelocityChange={v => this.updateRateOfTimeChange('end', v)}
                                onGrab={() => this.setState({activeHandle: 'end'})}
                                onRelease={() => this.setState({activeHandle: null})}
                    />
                </View>
                <Text style={styles.speedo}>startTime: {_.round(this.state.startTime._value, 2)}</Text>
                <Text style={styles.speedo}>endTime: {_.round(this.state.endTime._value)}</Text>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        height: 200,
        alignSelf: 'stretch',
        backgroundColor: colors.white,
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative'
    },
    highlighted: {
        alignSelf: 'stretch',
        flex: 1,
        marginLeft: sidePadding,
        marginRight: sidePadding
    },
    handle: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: handleWidth,
        opacity: 0.5
    },
    speedo: {
        color: colors.white
    },
    waveform: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: sidePadding
        //flex: 1,
    }
});