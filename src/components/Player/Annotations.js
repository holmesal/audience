import React, {
    Component,
    Image,
    PropTypes,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default class Annotations extends Component {

    static propTypes = {

    };

    static defaultProps = {

    };

    render() {
        return (
            <ScrollView style={styles.wrapper}>
                <Text>I am the Annotations component!</Text>
            </ScrollView>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});