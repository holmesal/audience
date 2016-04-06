import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import {ColorCube} from 'NativeModules';

import DebugView from '../common/DebugView';
import colors from '../../colors';

class PrettyArtwork extends Component {

    state = {
        dominantColor: null
    };

    handleLoad(ev, image) {
        console.info('loaded image', ev.nativeEvent, image)
        ColorCube.getColors(this.props.podcast.artwork, (err, colors) => {
            console.info('got colors: ', colors);
            let dom = colors[0];
            let rgb = dom.split(',').map(x => parseFloat(x) * 255);
            console.info(rgb);
            this.setState({
                dominantColor: rgb
            });
        })
    }

    render() {
        return (
            <View>
                <Image style={styles.image} source={{uri: this.props.podcast.artwork}} onLoad={this.handleLoad.bind(this)} />
                {this.state.dominantColor && <View style={[styles.wrapper, {backgroundColor: `rgb(${this.state.dominantColor.join(',')})`}]} /> }
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        width: 60,
        height: 60
    },
    image: {
        opacity: 0,
        width: 10,
        height: 10
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