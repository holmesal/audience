import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

class Recommendation extends Component {

    render() {
        return (
            <View style={styles.wrapper}>
                <Text>I am the  component!</Text>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});

export default Relay.createContainer(EpisodeActivity, {
    fragments: {
        recommendation: () => Relay.QL`
            fragment on Recommendation {
                user {
                    displayName
                }
            }
        `
    }
});