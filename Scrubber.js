import React, {
    Animated,
    Component,
    Dimensions,
    Image,
    ScrollView,
    Text,
    View
} from 'react-native';

import colors from './colors';
import TinyUser from './TinyUser';

export default class Scrubber extends Component {

    static defaultProps = {

    };

    handleScroll(ev) {
        console.info(ev)
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
    }
};