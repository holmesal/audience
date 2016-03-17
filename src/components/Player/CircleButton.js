import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default class CircleButton extends Component {

    static propTypes = {
        onPress: PropTypes.func,
        size: PropTypes.number
    };

    static defaultProps = {
        onPress: () => {},
        size: 60
    };

    render() {
        let runtimeStyles = {
            width: this.props.size,
            height: this.props.size,
            borderRadius: this.props.size/2
        };
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={[styles.wrapper, runtimeStyles, this.props.style]}
                {...this.props}
            >
                {this.props.children}
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(216,216,216,0.8)',
        position: null
    }
});