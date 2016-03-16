import React, {
    Animated,
    Component,
    Dimensions,
    Image,
    PanResponder,
    PropTypes,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Relay from 'react-relay';
import colors from './../../colors';
import TinyUser from './TinyUser';
import Times from './Times';
import TimeRemaining from './TimeRemaining';
import PrettyTime from './PrettyTime';
import FacebookAvatar from '../common/FacebookAvatar';

class CompactScrubber extends Component {

    static propTypes = {
        onSeek: PropTypes.func.isRequired,
        onWaveformPress: PropTypes.func
    };

    static defaultProps = {
        duration: 1138,
        currentTime: 0,
        onScrubStart: () => {},
        onScrubEnd: () => {},
        onWaveformPress: () => {},
        onHotSeek: () => {}
    };

    state = {
        frac: 0,
        scrubbing: false,
        dashOpacity: new Animated.Value(0),
        remainingOpacity: new Animated.Value(1),
        waveformWidth: 1173,
        waveformScaleY: new Animated.Value(1),
        hintOpacity: new Animated.Value(1)
    };

    _touching = false;
    _momentumScrolling = false;
    _autoScrolling = false;
    _autoScrollCancelTimeout = null;
    _ignoringTimeUpdates = false;
    _ignoringTimeUpdatesCancelTimeout = null;

    _touchStartTime = null;

    // when releasing - the first thing you get is an updated current time event
    // then it scrolls to current time
    // then it sets scrubbing = false

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (ev, gestureState) => {
                console.info('touch down!');
                this._touchStartTime = ev.nativeEvent.timestamp;
                return true;
            },
            onStartShouldSetPanResponderCapture: (evt, gestureState) => {
                return true;
            },
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: () => {
                console.info('scroll view has been granted responder')
                this._touching = true;
                this._autoScrolling = false; // cancel autoscrolls
                this.checkScrubbing();
            },
            onPanResponderMove: () => {
                //console.info('touch move!');
            },
            onPanResponderRelease: (ev, gestureState) => {
                let {dx, dy} = gestureState;
                let elapsed = ev.nativeEvent.timestamp - this._touchStartTime;
                //console.info('touch release!', dx+dy, elapsed);
                this._touching = false;
                // If we didn't move at all, this was a tap
                if (Math.abs(dx) + Math.abs(dy) < 5 && !this._momentumScrolling) {
                    this.props.onWaveformPress()
                }
                setTimeout(() => {
                    //console.info('--- doing deferred check');
                    this.checkScrubbing();
                }, 64);
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.scrubbing) {
            Animated.spring(this.state.dashOpacity, {
                toValue: 1
            }).start();
            Animated.spring(this.state.remainingOpacity, {
                toValue: 0.3
            }).start();
        } else {
            Animated.spring(this.state.dashOpacity, {
                toValue: 0
            }).start();
            Animated.spring(this.state.remainingOpacity, {
                toValue: 1
            }).start();
        }

        if (this.props.currentTime != prevProps.currentTime) this.handleUpdatedCurrentTime()

        // Grow/shrink the waveform based on playing state
        if (this.props.playing) Animated.spring(this.state.waveformScaleY, { toValue: 1 }).start();
        else Animated.spring(this.state.waveformScaleY, { toValue: 0.1 }).start();

        // Fade the hint
        Animated.timing(this.state.hintOpacity, {
            toValue: 1 - (this.state.frac/0.03),
            duration: 50
        }).start()
    }

    handleUpdatedCurrentTime() {
        if (!this.state.scrubbing && !this._ignoringTimeUpdates) {
            //console.info('got updated current time - scrolling there', this.props.currentTime, this.state.scrubbing);
            this.scrollToCurrentTime();
        }
    }


    handleScroll(ev) {

        // Grab the info from the event
        let {contentOffset, contentSize} = ev.nativeEvent;
        let frac = contentOffset.x / (contentSize.width - windowWidth);
        //console.info(contentOffset, frac);
        if (frac < 0) frac = 0;
        else if (frac > 1) frac = 1;
        // If we're not touching then we're momentum scrolling
        this._momentumScrolling = !this._touching && !this._autoScrolling;
        this.checkScrubbing();
        // Update the state
        this.setState({
            frac
        });
    }

    handleScrollEnd() {
        //console.info('momentum scroll done!');
        // Wait a bit in case there's a straggling scroll event
        setTimeout(() => {
            //console.info('--- doing final scroll check');
            this._momentumScrolling = false;
            this.checkScrubbing();
        }, 32);
    }

    checkScrubbing() {
        let scrubbing = (this._touching || this._momentumScrolling);
        //console.info('touching?', this._touching, '    momentum scrolling?', this._momentumScrolling, '   ===> ', scrubbing);
        if (scrubbing != this.state.scrubbing) {
            //console.info('-------------------- scrubbing=', scrubbing);
            this.setState({scrubbing});
            if (scrubbing) {
                this.props.onScrubStart();
            } else {
                this.handleScrubEnd();
                this.props.onScrubEnd();
            }
        }
    }

    handleScrubEnd() {
        //console.info('handling scrub end');
        let targetTime = this.state.frac * this.props.duration;
        //console.info('seeking to ', targetTime);
        this._ignoringTimeUpdates = true;
        //console.info('now ignoring time updates');
        if (this._ignoringTimeUpdatesCancelTimeout) clearTimeout(this._ignoringTimeUpdatesCancelTimeout);
        this._ignoringTimeUpdatesCancelTimeout = setTimeout(() => {
            //console.info('no longer ignoring time updates');
            this._ignoringTimeUpdates = false;
        }, 500); // this time is how long it takes an event to flow over the bridge

        // Seek to this time
        console.info('scrubbing has ended, seeking to target time!')
        this.props.onSeek(targetTime);

    }

    //widthForTime(time) {
    //    return time / this.props.duration * this.state.waveformWidth;
    //}
    //
    //timeForWidth(width) {
    //    return width / this.state.waveformWidth * this.props.duration;
    //}

    scrollToCurrentTime() {
        //console.info('scrolling to current time!');
        // This animated scroll will generate some scroll events, so we need to set a flag to ignore them
        this._autoScrolling = true;

        // Actually perform the scroll
        let targetX = this.props.currentTime / this.props.duration * this.state.waveformWidth;
        this.refs.scroller.scrollTo({x: targetX});

        // After a bit, stop ignoring these scroll events
        clearTimeout(this._autoScrollCancelTimeout);
        this._autoScrollCancelTimeout = setTimeout(() => {
            this._autoScrolling = false;
        // IMPORTANT - if it actually takes longer than this to scroll properly (like when debugging on deive
        // with chrome runtime on laptop over usb or slow wifi) then this isn't enough, causing seek events
        // whcih causes skippy audio
        }, __DEV__ ? 1000 : 500)
    }

    waveformWasTouched() {
        //console.info('waveform was touched!');
        // In a few hundred ms, check if this was a swipe or a drag
        //clearTimeout(this._checkTapTimeout);
        //this._checkTapTimeout = setTimeout(() => {
        //    let scrubbing = (this._touching || this._momentumScrolling);
        //    if (!scrubbing) {
        //        //console.info('broadcasting press!')
        //        this.props.onWaveformPress();
        //    }
        //}, 60)
        return false;
    }

    renderUsers() {
        if (!this.props.duration) return <View />;
        return this.props.episode.annotations.edges.map(edge => {
            let frac = edge.node.time / this.props.duration;
            if (!frac) frac = 0;
            let left = (frac * waveformWidth) + windowWidth/2 - avatarSize/2;
            return (<FacebookAvatar user={edge.node.user}
                                    style={[styles.avatar, {left: left}]}
                                    key={edge.node.id}
                                    size={avatarSize}
            />);
        })
    }

    renderTime() {
        return (
            <View>
                <Animated.Image style={[styles.dashedTimeIndicator, {opacity: this.state.dashOpacity}]} source={require('image!dashedTimeIndicator')}/>
                <Times fraction={this.state.frac}
                       length={this.props.duration}
                       style={styles.times}
                       visible={this.state.scrubbing}
                />
            </View>
        )
    }

    render() {
        let blurredBgSrc = require('image!bgDark');//require('image!bg');
        return (
            <View style={styles.wrapper}>

                {/** Scroller */}
                <View style={{flex: 1}}>
                    <ScrollView horizontal
                                ref="scroller"
                                showsHorizontalScrollIndicator={false}
                                style={styles.scroller}
                                contentContainerStyle={styles.scrollContent}
                                onScroll={this.handleScroll.bind(this)}
                                onMomentumScrollEnd={this.handleScrollEnd.bind(this)}
                                scrollEventThrottle={32}
                                {...this._panResponder.panHandlers}
                    >
                        <TouchableOpacity style={styles.waveform} onPress={this.props.onWaveformPress} activeOpacity={1}>
                            <View style={[styles.spacer, {marginRight: 3}]} />
                            <Animated.Image
                                style={[styles.fakeWaveform, {transform: [{scaleY: this.state.waveformScaleY}]}]}
                                source={require('image!waveform')} />
                            <View style={[styles.spacer, {marginLeft: 3}]} />
                            {this.renderUsers()}
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/** Top component of the right half background */}
                <View style={styles.waveformMask} pointerEvents='none' />

                {/** Play head */}
                <View style={[styles.playHead]} pointerEvents='none' />

                <View style={styles.currentWrapper} pointerEvents='none' >
                    <PrettyTime
                        style={[styles.timestamp, styles.current]}
                        time={Math.floor(this.props.duration * this.state.frac)}
                        monospace
                    />
                </View>

                <PrettyTime
                    style={[styles.timestamp, styles.remaining]}
                    time={Math.floor(this.props.duration - (this.props.duration * this.state.frac))}
                    monospace
                    negative
                />
                
                <Animated.View style={[styles.hintWrapper, {opacity: this.state.hintOpacity}]} pointerEvents='none' >
                    <Text style={[styles.hint, {marginBottom: 4}]}>Tap to {this.props.playing ? 'pause' : 'play'}</Text>
                    <Text style={styles.hint}>Drag to seek</Text>
                </Animated.View>
            </View>
        );
    }
}

const containerHeight = 84;
const waveformHeight = 32;
const waveformWidth = 1173;
const avatarSize = 10;
const avatarBottom = 4;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

let styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch',
        height: containerHeight,
        position: 'relative',
        backgroundColor: colors.darkGrey,
        borderTopWidth: 1,
        borderColor: colors.darkBorder
    },
    scroller: {
        flex: 1,
        alignSelf: 'stretch',
        //backgroundColor: 'green',
        backgroundColor: 'transparent'
    },
    scrollContent: {
        //backgroundColor: 'orange',
        alignItems: 'center',
        flex: 1
        //width: 1000,
    },

    waveform: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        //marginTop: windowHeight/2 - waveformHeight/2,
        position: 'relative'
    },
    waveformMask: {
        backgroundColor: colors.darkGrey,
        opacity: 0.8,
        position: 'absolute',
        top: 0,
        left: windowWidth/2,
        bottom: avatarSize + avatarBottom,
        right: 0
    },
    spacer: {
        width: windowWidth/2,
        height: 1,
        backgroundColor: colors.darkGrey,
        opacity: 0.09
    },
    fakeWaveform: {
        height: waveformHeight,
        tintColor: colors.lighterGrey
    },

    avatar: {
        position: 'absolute',
        bottom: 4,
        left: 0
    },

    playHead: {
        width: 2,
        height: 32,
        borderRadius: 1,
        backgroundColor: colors.attention,
        position: 'absolute',
        top: containerHeight/2 - 16,
        left: windowWidth/2 - 1
    },

    dashedTimeIndicator: {
        position: 'absolute',
        bottom: windowHeight/2 + waveformHeight/2 + 8,
        left: windowWidth/2 - 1,
        backgroundColor: 'transparent'
    },

    times: {
        position: 'absolute',
        bottom: windowHeight/2 + waveformHeight/2 + 8 + 88 + 12,
        left: 0,
        right: 0
    },

    timestamp: {
        color: colors.darkGrey,
        fontSize: 10,
        fontWeight: '400',
        letterSpacing: 0.58
    },

    remaining: {
        position: 'absolute',
        top: 2,
        right: 12,
    },

    currentWrapper: {
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    current: {},

    hintWrapper: {
        position: 'absolute',
        backgroundColor: 'transparent',
        left: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        paddingLeft: 20
    },
    hint: {
        fontSize: 12,
        fontFamily: 'System',
        color: '#A3A3A3'
    }
});

export default Relay.createContainer(CompactScrubber, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                annotations(first:1000) {
                    edges {
                        node {
                            id
                            time
                            user {
                                ${FacebookAvatar.getFragment('user')}
                            }
                        }
                    }
                }
            }
        `
    }
});