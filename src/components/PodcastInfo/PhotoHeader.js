import React, {
    Animated,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Relay from 'react-relay';

class PhotoHeader extends Component {

    state = {
        imageOpacity: new Animated.Value(0),
        //titleOpacity: 0,
        titleOffset: 100
    };

    componentWillReceiveProps(nextProps) {
        console.info('next photoHeader props', nextProps);
        if (!nextProps.podcast) {
            console.info('resetting!')
            this.state.imageOpacity.setValue(0);
        }
    }

    handleImageLoad() {
        console.info('image loaded!');
        Animated.timing(this.state.imageOpacity, {
            toValue: 1
        }).start()
    }

    renderArtwork() {
        return (
            <Image
                source={{uri: this.props.podcast.artwork}}
                style={[styles.stretch]}
                onLoad={this.handleImageLoad.bind(this)}
            />
        )
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <Animated.View style={{flex: 1, alignSelf: 'stretch', opacity: this.state.imageOpacity}}>
                    {!this.props.loading && this.renderArtwork()}
                    <View style={[styles.stretch, styles.tint]} />
                </Animated.View>

                <View style={[styles.stretch, styles.titleWrapper]}>
                    {!this.props.loading && <Text style={styles.title}>{this.props.podcast.name.toUpperCase()}</Text>}
                </View>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        height: 265,
        backgroundColor: '#212121'
    },
    stretch: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    tint: {
        backgroundColor: '#3e3e3e',
        opacity: 0.8
    },
    titleWrapper: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: 'white',
        fontFamily: 'Oswald-Light',
        fontSize: 30,
        letterSpacing: 3,
        textAlign: 'center'
    }


});

export default Relay.createContainer(PhotoHeader, {
    initialVariables: {
        size: 'large'
    },
    fragments: {
        podcast: () => Relay.QL`
            fragment on Podcast {
                name
                artwork(size:$size)
            }
        `
    }
})