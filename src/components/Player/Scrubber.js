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
    View
} from 'react-native';

import colors from './../../colors';
import TinyUser from './../TinyUser';
import Times from './Times';

import {connect} from 'react-redux/native';
import {scrubber$, seekTo} from '../../redux/modules/player.js';

class Scrubber extends Component {

    static defaultProps = {
        duration: 1138,
        currentTime: 0
    };

    state = {
        frac: 0,
        scrubbing: false,
        dashOpacity: new Animated.Value(0),
        waveformWidth: 1173
    };

    _touching = false;
    _momentumScrolling = false;
    _autoScrolling = false;
    _autoScrollCancelTimeout = null;
    _ignoringTimeUpdates = false;
    _ignoringTimeUpdatesCancelTimeout = null;

    // when releasing - the first thing you get is an updated current time event
    // then it scrolls to current time
    // then it sets scrubbing = false

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: () => {
                this._touching = true;
                this._autoScrolling = false; // cancel autoscrolls
                this.checkScrubbing();
            },
            onPanResponderMove: () => {},
            onPanResponderRelease: () => {
                this._touching = false;
                // Wait a minute to allow the first momentum scroll event to come through
                setTimeout(() => {
                    //console.info('--- doing deferred check');
                    this.checkScrubbing();
                }, 64)
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.scrubbing) {
            Animated.spring(this.state.dashOpacity, {
                toValue: 1
            }).start();
        } else {
            Animated.spring(this.state.dashOpacity, {
                toValue: 0
            }).start();
        }

        if (this.props.currentTime != prevProps.currentTime) this.handleUpdatedCurrentTime()
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
            if (!scrubbing) this.handleScrubEnd();
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
        this.props.dispatch(seekTo(targetTime));

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
        this.refs.scroller.scrollTo(0, targetX);

        // After a bit, stop ignoring these scroll events
        clearTimeout(this._autoScrollCancelTimeout);
        this._autoScrollCancelTimeout = setTimeout(() => {
            this._autoScrolling = false;
        }, 500)
    }

    renderUsers() {
        return <View />;
        return [
            <TinyUser
                profilePhotoUrl="https://scontent-lax3-1.xx.fbcdn.net/hphotos-xaf1/v/t1.0-0/p206x206/24567_1315611770255_1155488_n.jpg?oh=bbd8882c52d4abd567db280f76d0b87a&oe=56FBD84D"
                style={[styles.tinyUser, {left: 200}]}
                key="lah"
            />,
            <TinyUser
                profilePhotoUrl="https://pbs.twimg.com/profile_images/617806122544566272/Pm6KPI9P_400x400.jpg"
                style={[styles.tinyUser, {left: 357}]}
                key="dee"
            />,
            <TinyUser
                profilePhotoUrl="https://scontent-lax3-1.xx.fbcdn.net/hprofile-xft1/v/t1.0-1/c0.0.320.320/p320x320/12510375_10153732937455867_8269122392597910250_n.jpg?oh=267f72be655437a1be7ea666b0b2accf&oe=5705AA7A"
                style={[styles.tinyUser, {left: 462}]}
                key="dah"
            />
        ]
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

                {/** Left half background */}
                <View style={styles.bgWrapper}>
                    <Image style={[styles.bgImage, {left: 0}]} source={blurredBgSrc} />
                </View>

                {/** Bottom component of the right half background */}
                <View style={[styles.coverWrapper, {opacity: 0.99}]} pointerEvents='none'>
                    <Image style={[styles.bgCover, {right: 0}]} source={blurredBgSrc} />
                </View>

                {/** Scroller */}
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
                    <View style={styles.waveform}>
                        <View style={[styles.spacer, {marginRight: 3}]} />
                        <Image style={styles.fakeWaveform} source={require('image!waveform')} />
                        <View style={[styles.spacer, {marginLeft: 3}]} />
                        {this.renderUsers()}
                    </View>
                </ScrollView>

                {/** Top component of the right half background */}
                <View style={[styles.coverWrapper, {opacity: 0.8}]} pointerEvents='none'>
                    <Image style={[styles.bgCover, {right: 0}]} source={blurredBgSrc} />
                </View>

                {/** Play head */}
                <View style={[styles.playHead]} pointerEvents='none' />

                <TouchableOpacity style={{width: 80, height: 80, backgroundColor: 'transparent', position: 'absolute', top: 0, left: 0, paddingTop: 20}} onPress={this.props.hidePlayer}>
                    <Image style={{position: 'absolute', left: 20, top: 30}} source={require('image!backChevron')}/>
                </TouchableOpacity>

                {this.renderTime()}
            </View>
        );
    }
}

//const blend = (alphaBelow, alphaAbove)

let waveformHeight = 32;
let windowWidth = Dimensions.get('window').width;
let windowHeight = Dimensions.get('window').height;

let styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    bgWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,//windowWidth/2,
        overflow: 'hidden'
    },
    bgImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        overflow: 'hidden'
    },
    coverWrapper: {
        backgroundColor: 'transparent',
        position: 'absolute',
        left: windowWidth/2,
        right: 0,
        top: windowHeight/2 - waveformHeight/2,
        bottom: windowHeight/2 - waveformHeight/2,
        overflow: 'hidden'
    },
    bgCover: {
        position: 'absolute',
        top: -windowHeight/2 + waveformHeight/2,
        bottom: 0
    },
    scroller: {
        backgroundColor: 'transparent'
    },
    scrollContent: {
        //backgroundColor: 'green',
        //width: 1000,
    },

    waveform: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: windowHeight/2 - waveformHeight/2,
        position: 'relative'
    },
    spacer: {
        width: windowWidth/2,
        height: 1,
        backgroundColor: colors.lightGrey,
        opacity: 0.09
    },
    fakeWaveform: {
        height: waveformHeight
    },

    tinyUser: {
        position: 'absolute',
        top: -waveformHeight/2 - 16
    },

    playHead: {
        width: 2,
        height: 32,
        borderRadius: 1,
        backgroundColor: colors.lightGrey,
        position: 'absolute',
        top: windowHeight/2 - 16,
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
    }
});

export default connect(scrubber$)(Scrubber);