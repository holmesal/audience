import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default class Discover extends Component {

    render() {
        return (
            <View style={styles.wrapper}>
                <Text>I am the Discover component!</Text>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});