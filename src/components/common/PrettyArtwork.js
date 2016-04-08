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
import LinearGradient from 'react-native-linear-gradient';

import DebugView from '../common/DebugView';
import colors from '../../colors';

const windowWidth = Dimensions.get('window').width;

class PrettyArtwork extends Component {

    state = {
        dominantColor: [35,35,35],
        visibility: new Animated.Value(0)
    };

    handleLoad(ev, image) {
        console.info('loaded image', ev.nativeEvent, image)
        ColorCube.getColors(this.props.podcast.artwork, (err, colors) => {
            console.info('got colors: ', colors);
            if (colors.length > 0) {
                let dom = colors[0];
                let rgb = dom.split(',').map(x => parseFloat(x) * 255);
                console.info(rgb);
                this.setState({
                    dominantColor: rgb
                });
                Animated.spring(this.state.visibility, {
                    toValue: 1
                }).start();
            }
        })
    }

    render() {
        const gradientStops = [
            `rgba(${this.state.dominantColor.join(',')},1.0)`,
            `rgba(${this.state.dominantColor.join(',')},0.60)`,
            //`rgba(${this.state.dominantColor.join(',')},0.60)`,
            `rgba(${this.state.dominantColor.join(',')},1.0)`
        ];
        console.info(gradientStops);
        return (
            <Animated.View style={{opacity: this.state.visibility}}>
                <Image style={styles.image} source={{uri: this.props.podcast.artwork}} onLoad={this.handleLoad.bind(this)} />
                <Surface width={windowWidth} height={windowWidth}>
                    <Blur factor={2} passes={8}>
                        {this.props.podcast.artwork}
                    </Blur>
                </Surface>
                <LinearGradient colors={gradientStops} style={[styles.cover, styles.gradient]} />
                <View style={[styles.cover, styles.mask]} />
            </Animated.View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        position: 'relative'
    },
    image: {
        opacity: 0,
        width: 10,
        height: 10
    },
    cover: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
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