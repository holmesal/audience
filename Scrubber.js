import React, {
    Animated,
    Component,
    Dimensions,
    Image,
    PanResponder,
    ScrollView,
    Text,
    View
} from 'react-native';

import colors from './colors';
import TinyUser from './TinyUser';
import Times from './Times';

export default class Scrubber extends Component {

    static defaultProps = {

    };

    state = {
        frac: 0,
        scrubbing: false
    };

    _touching = false;
    _momentumScrolling = false;

    componentWillMount() {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: () => {
                this._touching = true;
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

        }
    }


    handleScroll(ev) {
        let {contentOffset, contentSize} = ev.nativeEvent;
        let frac = contentOffset.x / (contentSize.width - windowWidth);
        //console.info(contentOffset, frac);
        if (frac < 0) frac = 0;
        else if (frac > 1) frac = 1;
        // If we're not touching then we're momentum scrolling
        this._momentumScrolling = !this._touching;
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
        let scrubbing = this._touching || this._momentumScrolling;
        //console.info('touching?', this._touching, '    momentum scrolling?', this._momentumScrolling, '   ===> ', timesVisible);
        if (scrubbing != this.state.scrubbing) this.setState({scrubbing});
    }

    renderUsers() {
        return [
            <TinyUser
                profilePhotoUrl="https://scontent-lax3-1.xx.fbcdn.net/hphotos-xaf1/v/t1.0-0/p206x206/24567_1315611770255_1155488_n.jpg?oh=bbd8882c52d4abd567db280f76d0b87a&oe=56FBD84D"
                style={[style.tinyUser, {left: 200}]}
                key="lah"
            />,
            <TinyUser
                profilePhotoUrl="https://pbs.twimg.com/profile_images/617806122544566272/Pm6KPI9P_400x400.jpg"
                style={[style.tinyUser, {left: 357}]}
                key="dee"
            />,
            <TinyUser
                profilePhotoUrl="https://scontent-lax3-1.xx.fbcdn.net/hprofile-xft1/v/t1.0-1/c0.0.320.320/p320x320/12510375_10153732937455867_8269122392597910250_n.jpg?oh=267f72be655437a1be7ea666b0b2accf&oe=5705AA7A"
                style={[style.tinyUser, {left: 462}]}
                key="dah"
            />
        ]
    }

    renderTime() {
        return (
            <View>
                <Image style={style.dashedTimeIndicator} source={require('image!dashedTimeIndicator')}/>
                <Times fraction={this.state.frac}
                       length={1138}
                       style={style.times}
                       visible={this.state.scrubbing}
                />
            </View>
        )
    }

    render() {
        return (
            <View style={style.wrapper}>

                {/** Left half background */}
                <View style={style.bgWrapper}>
                    <Image style={[style.bgImage, {left: 0}]} source={require('image!bg')} />
                </View>

                {/** Bottom component of the right half background */}
                <View style={[style.coverWrapper, {opacity: 0.99}]} pointerEvents='none'>
                    <Image style={[style.bgCover, {right: 0}]} source={require('image!bg')} />
                </View>

                {/** Scroller */}
                <ScrollView horizontal
                            showsHorizontalScrollIndicator={false}
                            style={style.scroller}
                            contentContainerStyle={style.scrollContent}
                            onScroll={this.handleScroll.bind(this)}
                            onMomentumScrollEnd={this.handleScrollEnd.bind(this)}
                            scrollEventThrottle={32}
                            {...this._panResponder.panHandlers}
                >
                    <View style={style.waveform}>
                        <View style={[style.spacer, {marginRight: 3}]} />
                        <Image style={style.fakeWaveform} source={require('image!waveform')} />
                        <View style={[style.spacer, {marginLeft: 3}]} />
                        {this.renderUsers()}
                    </View>
                </ScrollView>

                {/** Top component of the right half background */}
                <View style={[style.coverWrapper, {opacity: 0.8}]} pointerEvents='none'>
                    <Image style={[style.bgCover, {right: 0}]} source={require('image!bg')} />
                </View>

                {/** Play head */}
                <View style={[style.playHead]} pointerEvents='none' />

                {this.renderTime()}
            </View>
        );
    }
}

//const blend = (alphaBelow, alphaAbove)

let waveformHeight = 32;
let windowWidth = Dimensions.get('window').width;
let windowHeight = Dimensions.get('window').height;

let style = {
    wrapper: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'white'
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
};