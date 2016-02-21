import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default class CircleCaptionButton extends Component {

    static propTypes = {
        content: PropTypes.string,
        caption: PropTypes.string,
        onPress: PropTypes.func
    };

    render() {
        return (
            <TouchableOpacity style={styles.wrapper} onPress={this.props.onPress}>
                <View style={[styles.button, this.props.buttonStyle]}>
                    <Text style={{fontSize: 30}}>{this.props.content}</Text>
                </View>
                <Text style={styles.caption}>{this.props.caption}</Text>
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center'
    },
    button: {
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.28)',
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    caption: {
        fontFamily: 'System',
        fontSize: 12,
        color: '#7C7C7C',
        fontWeight: '200'
    }
});