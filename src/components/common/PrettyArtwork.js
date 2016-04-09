import React, {
    Animated,
    Component,
    Dimensions,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import {ColorCube} from 'NativeModules';
import GL, {Surface} from 'gl-react-native';
import {Blur} from 'gl-react-blur';
import {ContrastSaturationBrightness} from "gl-react-contrast-saturation-brightness";
import LinearGradient from 'react-native-linear-gradient';

import DebugView from '../common/DebugView';
import colors from '../../colors';

const windowWidth = Dimensions.get('window').width;

class PrettyArtwork extends Component {

    state = {
        dominantColor: [35,35,35],
        visibility: new Animated.Value(0),
        width: 1,
        height: 1
    };

    handleLoad(ev, image) {
        //console.info('loaded image', ev.nativeEvent, image)
        ColorCube.getColors(this.props.podcast.artwork, (err, colors) => {
            //console.info('got colors: ', colors);
            if (colors.length > 0) {
                let dom = colors[0];
                let rgb = dom.split(',').map(x => parseFloat(x) * 255);
                //console.info(rgb);
                this.setState({
                    dominantColor: rgb
                });
                Animated.spring(this.state.visibility, {
                    toValue: 1
                }).start();
            }
        })
    }

    handleLayout(ev) {
        const {width, height} = ev.nativeEvent.layout;
        //console.info('pretty background laid out: ', {width, height})
        this.setState({width, height});
    }

    render() {
        const gradientStops = [
            `rgba(${this.state.dominantColor.join(',')},1.0)`,
            `rgba(${this.state.dominantColor.join(',')},0.60)`,
            //`rgba(${this.state.dominantColor.join(',')},0.60)`,
            `rgba(${this.state.dominantColor.join(',')},1.0)`
        ];
        //console.info(gradientStops);

        // "cover" mode for this image
        let w = this.state.width;
        let h = this.state.height;
        let left = 0;
        let top = 0;
        if (w > h) {
            top = -(w - h) / 2;
            h = w;
        } else {
            left = -(h - w) / 2;
            w = h;
        }
        //console.info('sized image: ', {w, h, left, top});

        return (
            <View style={[styles.wrapper, this.props.style]} onLayout={this.handleLayout.bind(this)}>
                <Image style={styles.image} source={{uri: this.props.podcast.artwork}} onLoad={this.handleLoad.bind(this)} />
                <Animated.View style={[styles.cover, {opacity: this.state.visibility, width: this.state.width, height: this.state.height}]}>
                    <Surface style={[styles.cover, {top, left}]} width={w || 1} height={h || 1}>
                        <ContrastSaturationBrightness saturation={1}>
                            <Blur factor={2} passes={8}>
                                {this.props.podcast.artwork}
                            </Blur>
                        </ContrastSaturationBrightness>
                    </Surface>
                    <LinearGradient colors={gradientStops} style={[styles.cover, styles.gradient]} />
                    <View style={[styles.cover, styles.mask]} />
                </Animated.View>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        overflow: 'hidden',
        //backgroundColor: colors.darkGreyLightContrast,
        flex: 1,
        alignSelf: 'stretch',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    rel: {
        position: 'relative',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        //backgroundColor: 'green'
    },
    surface: {
        position: 'absolute'
    },
    image: {
        position: 'absolute',
        opacity: 0,
        width: 1,
        height: 1
    },
    cover: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
        //width: 100,
        //height: 100
    },
    mask: {
        backgroundColor: '#555555',
        opacity: 0.7
    },
    gradient: {

    }
});

export default Relay.createContainer(PrettyArtwork, {
    initialVariables: {
        size: 'medium'
    },
    fragments: {
        podcast: () => Relay.QL`
            fragment on Podcast {
                artwork(size:$size)
            }
        `
    }
});