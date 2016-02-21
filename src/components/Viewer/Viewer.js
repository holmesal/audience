import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import viewerRoute from '../../routes/ViewerRoute';

class Viewer extends Component {

    render() {
        console.info(this.props.viewer)
        return (
            <View style={styles.wrapper}>
                <Text style={styles.text}>{this.props.viewer.id}</Text>
            </View>
        );
    }
}

let ViewerContainer = Relay.createContainer(Viewer, {
    fragments: {
        viewer: () => Relay.QL`
          fragment on User {
            id
          }
        `
    }
});

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    text: {
        color: 'white'
    }
});

export default class ViewerRootComponent extends Component {

    render() {
        return (
            <Relay.RootContainer
                Component={ViewerContainer}
                route={ new viewerRoute()}
            />
        )
    }
}