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

export default class PhotoHeader extends Component {

    static propTypes = {
        photoUrl: PropTypes.string,
        title: PropTypes.string
    };

    state = {
        imageOpacity: new Animated.Value(0),
        //titleOpacity: 0,
        titleOffset: 100
    };

    handleImageLoad() {
        console.info('image loaded!');
        Animated.timing(this.state.imageOpacity, {
            toValue: 1
        }).start()
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <Animated.View style={{flex: 1, alignSelf: 'stretch', opacity: this.state.imageOpacity}}>
                    <Image
                        source={{uri: this.props.photoUrl}}
                        style={[styles.stretch]}
                        onLoad={this.handleImageLoad.bind(this)}
                    />
                    <View style={[styles.stretch, styles.tint]} />
                </Animated.View>

                <View style={[styles.stretch, styles.titleWrapper]}>
                    <Text style={styles.title}>{this.props.title.toUpperCase()}</Text>
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