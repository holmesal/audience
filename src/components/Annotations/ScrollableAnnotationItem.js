import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default class ScrollableAnnotationItem extends Component {

    static propTypes = {};

    static defaultProps = {};

    render() {
        return (
            <View style={styles.wrapper}>
                <Text style={styles.text}>{this.props.annotation.text}</Text>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        height: 80,
        borderWidth: 1,
        borderColor: 'red'
    },
    text: {
        color: '#fefefe'
    }
});