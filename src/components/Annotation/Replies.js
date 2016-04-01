import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import DebugView from '../common/DebugView';
import colors from '../../colors';

class Replies extends Component {

    render() {
        return (
            <View style={styles.wrapper}>
                <DebugView text={`I am the Replies component!`}/>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});

export default Relay.createContainer(Replies, {
    fragments: {
        annotation: () => Relay.QL`
            fragment on Annotation {
                id
            }
        `
    }
})