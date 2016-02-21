import React, {
    Component,
    Image,
    PropTypes,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import store from '../../redux/create';
import {updateViewerId} from '../../redux/modules/auth';

import Relay from 'react-relay';

/**
 * Note - this component currently is reponsible for setting the viewerId in redux, which is needed when
 * making api requests that have fat queries involving the viewer
 */
class Viewer extends Component {

    componentDidMount() {
        store.dispatch(updateViewerId(this.props.viewer.id));
    }


    render() {
        const photoUrl = `http://graph.facebook.com/v2.5/${this.props.viewer.facebookId}/picture?type=square&height=160`;
        return (
            <ScrollView style={styles.wrapper} contentContainerStyle={styles.scrollContent}>
                <Image source={{uri:photoUrl}} style={styles.photo} />
                <Text style={styles.name}>{this.props.viewer.displayName}</Text>
            </ScrollView>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingTop: 20,
    },
    scrollContent: {
        alignItems: 'center',
        paddingTop: 40
    },
    name: {
        color: 'white',
        fontFamily: 'System',
        fontSize: 20,
        fontWeight: '300',
        marginTop: 24
    },
    photo: {
        height: 80,
        width: 80,
        borderRadius: 6
    }
});

export default Relay.createContainer(Viewer, {
    fragments: {
        viewer: () => Relay.QL`
          fragment on User {
            id
            facebookId
            displayName
          }
        `
    }
});