import React, {
    ActivityIndicatorIOS,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default class LoadingSpinner extends Component {

    render() {
        return (
            <View style={styles.wrapper}>
                <ActivityIndicatorIOS />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});