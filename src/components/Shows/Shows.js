import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

export default class Shows extends Component {

    static propTypes = {

    };

    static defaultProps = {
        
    };

    render() {
        return (
            <View style={styles.wrapper}>
                <Text>I am the Shows component!</Text>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});

export default Relay.createContainer(Shows, {
    fragments: {
        viewer: Relay.QL`
            fragment on Viewer {
                subscriptions: {}
            }
        `
    }
})