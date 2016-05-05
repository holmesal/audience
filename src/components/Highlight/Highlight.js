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

// How tall is the scrubber?
const scrubberHeight = 44;
const paddingBottom = 44;
const paddingTop = 44;

const totalHeight = paddingTop + scrubberHeight + paddingBottom;

// How sensitive are the handles?
// default = 1
const sensitivity = 10;

// What is the minimum chunk of time a user can highlight?
const minimumDuration = 5000;
// And the default?
const defaultDuration = 20000;
// And the maximum?
const maximumDuration = 60 * 5 * 1000; // 5 minutes

// How wide is the "highlighted" area on-screen?
const highlightWidth = width - (2 * sidePadding);

/**
 * TODO
 * enforce a minimum highlight duration
 */

export default class Highlight extends Component {

    static propTypes = {
        // Duration of the episode, in MILLISECONDS
        episodeDuration: PropTypes.number.isRequired,
        // Initial end time for the clip, IN MILLISECONDS
        initialEndTime: PropTypes.number.isRequired
    };

    state = {
        startTime: new Animated.Value(0),
        endTime: new Animated.Value(0),
        activeHandle: null,
        startSeconds: 0,
        endSeconds: 0
    };

    componentWillMount() {
        // Listen for changes to start and end times
        this.state.startTime.addListener(this.handleUpdatedTime.bind(this));
        this.state.endTime.addListener(this.handleUpdatedTime.bind(this));
        // Set initial values for start/end times
        this.setToDefaultPositionAndDuration(this.props.initialEndTime);
        // Update the non-animated seconds values
        this.handleUpdatedTime();
    }

    setToDefaultPositionAndDuration(initialEndTime) {
        this.state.endTime.setValue(initialEndTime);
        this.state.startTime.setValue(initialEndTime - defaultDuration);
    }

    handleUpdatedTime() {
        // Log the time range
        //console.info(`${_.round(this.state.startTime._value/1000, 2)} --- ${_.round(this.state.endTime._value/1000, 2)}`);

        // Handle updated seconds
        const s = Math.round(this.state.startTime._value/1000);
        const e = Math.round(this.state.endTime._value/1000);

        if (s != this.state.startSeconds || e != this.state.endSeconds) {
            this.setState({
                startSeconds: s,
                endSeconds: e
            });
        }
    }

    /**
     * Update the rate at which the duration is growing or shrinking
     * @param which - the start or end time?
     * @param velocity - the velocity with which the time is changing, in seconds per second
     */
    updateRateOfTimeChange(which, velocity) {
        // How many seconds out to project
        const howManySeconds = 60;
        //console.info(`updating velocity for ${which.toUpperCase()} to ${velocity}`);
        let projectionLength = 1000 * howManySeconds;
        // Get the animated value for the time we're referring to
        const animatedTime = (which === 'start') ? this.state.startTime : this.state.endTime;
        //console.info(animatedTime);
        // Project out to the value that we would hit if we maintained this velocity for {projectionLegth) seconds
        let projectedValue = animatedTime._value + projectionLength * velocity * sensitivity * howManySeconds;

        // Make sure the projected value is inside the bounds
        const currentStartTime = this.state.startTime._value;
        const currentEndTime = this.state.endTime._value;
        if (which === 'start') {
            // Can't be before the beginning
            if (projectedValue < 0) projectedValue = 0;
            // Can't be later than {minimumDuration} seconds before the end time
            if (projectedValue > currentEndTime - minimumDuration) {
                projectedValue = currentEndTime - minimumDuration;
            }
            // Can't make the clip longer than the max duration
            if (currentEndTime - projectedValue > maximumDuration) {
                projectedValue = currentEndTime - maximumDuration
            }
        } else {
            // Can't be before {minimumDuration} seconds after the start time
            if (projectedValue < currentStartTime + minimumDuration) {
                projectedValue = currentStartTime + minimumDuration;
            }
            // Can't be after the end
            if (projectedValue > this.props.episodeDuration){
                projectedValue = this.props.episodeDuration;
            }
            // Can't make the clip longer than the max duration
            if (projectedValue - currentStartTime > maximumDuration) {
                projectedValue = currentStartTime + maximumDuration;
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
                    //this.updateRateOfTimeChange(which, velocity);
                }
            });
        }
    }

    getCurrentLoopMode() {
        switch(this.state.activeHandle) {
            case 'start':
                return 'start';
            case 'end':
                return 'end';
            default:
                return 'full';
        }
    }

    renderWaveform() {
        /**
         * This is disabled until we can divide Animated values
         */
        //return <Waveform startTime={this.state.startTime}
        //                 endTime={this.state.endTime}
        //                 episodeDuration={this.props.episodeDuration}
        //                 style={styles.waveform}
        //                 minimumDuration={minimumDuration}
        //                 highlightWidth={highlightWidth}
        //                 scaleAround={this.state.activeHandle}
        //        />
    }

    render() {

        // Shrink height as a function of duration
        const negativeStartTime = Animated.multiply(this.state.startTime, -1);
        const duration = Animated.add(this.state.endTime, negativeStartTime);
        const scaleY = duration.interpolate({
            inputRange: [defaultDuration, maximumDuration],
            outputRange: [1, 0.5],
            extrapolate: 'clamp'
        });
        const shrinkable = {transform: [{scaleY}]};

        return (
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, alignSelf: 'stretch'}}>
                <View style={styles.wrapper}>

                    {this.renderWaveform()}

                    <Animated.View style={[styles.spacer, shrinkable]} />
                    <SelectedSegment style={[styles.highlighted]}
                                     loopMode={this.getCurrentLoopMode()}
                                     duration={(this.state.endSeconds - this.state.startSeconds) * 1000}
                                     edgeLoopAmount={1000}
                                     shrinkTransform={shrinkable}
                    />
                    <Animated.View style={[styles.spacer, shrinkable]} />


                    <GrabHandle style={[styles.handle, {left: sidePadding - handleWidth/2}]}
                                maxDisplacement={sidePadding}
                                paddingBottom={paddingBottom}
                                time={this.state.startSeconds}
                                onVelocityChange={v => this.updateRateOfTimeChange('start', v)}
                                onGrab={() => this.setState({activeHandle: 'start'})}
                                onRelease={() => this.setState({activeHandle: null})}
                    />
                    <GrabHandle style={[styles.handle, {right: sidePadding - handleWidth/2}]}
                                maxDisplacement={sidePadding}
                                paddingBottom={paddingBottom}
                                time={this.state.endSeconds}
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
        height: totalHeight,
        alignSelf: 'stretch',
        backgroundColor: colors.white,
        //alignItems: 'flex-end',
        flexDirection: 'row',
        position: 'relative',
        paddingBottom: 44,
        paddingTop: 44
    },
    spacer: {
        width: sidePadding,
        backgroundColor: '#F6F6F6',
        height: scrubberHeight
    },
    highlighted: {
        flex: 1,
        height: scrubberHeight
        //marginLeft: sidePadding,
        //marginRight: sidePadding
    },
    handle: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        height: totalHeight,
        //paddingBottom: paddingBottom,
        width: handleWidth
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