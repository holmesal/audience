import React, {
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

    renderControls() {
        return (
            <View>

            </View>
        )
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <Image source={{uri: this.props.photoUrl}} style={styles.stretch} />
                <View style={[styles.stretch, styles.tint]} />

                <View style={[styles.stretch, styles.titleWrapper]}>
                    <Text style={styles.title}>{this.props.title.toUpperCase()}</Text>
                </View>

                {this.renderControls()}
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        height: 265
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
        opacity: 0.6
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
        letterSpacing: 3
    },


});