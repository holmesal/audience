import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default class NavbarButton extends Component {

    render() {
        return (
            <TouchableOpacity
                style={styles.wrapper}
                onPress={this.props.onPress}
            >
                {this.props.children}
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        width: 52,
        alignSelf: 'stretch',
        //borderWidth: 1,
        //borderColor: 'red',
        alignItems: 'center',
        justifyContent: 'center'
    }
});