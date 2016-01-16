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
        return (
            <TinyUser
                profilePhotoUrl="https://pbs.twimg.com/profile_images/617806122544566272/Pm6KPI9P_400x400.jpg"
                style={style.tinyUser}
            />
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
                <View style={[style.coverWrapper, {opacity: 0.97}]} pointerEvents='none'>
                    <Image style={[style.bgImage, {right: 0}]} source={require('image!bg')} />
                </View>

                {/** Scroller */}
                <ScrollView horizontal
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
                    <Image style={[style.bgImage, {right: 0}]} source={require('image!bg')} />
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
        right: windowWidth/2,
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
        top: 0,//windowHeight/2 - waveformHeight/2,
        bottom: 0,//windowHeight/2 - waveformHeight/2,
        overflow: 'hidden'
    },
    bgCover: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 200,
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
        marginTop: windowHeight/2 - 18,
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
        top: -waveformHeight/2,
        left: 250,
        marginLeft: -16,
        marginTop: -16
    }
};