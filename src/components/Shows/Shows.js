import React, {
    Component,
    Image,
    PropTypes,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import PodcastListItem from './PodcastListItem';

class Shows extends Component {

    static propTypes = {

    };

    static defaultProps = {
        
    };

    renderShowsList() {
        return this.props.viewer.subscriptions.edges.map(edge =>
            <PodcastListItem
                key={edge.node.id}
                podcast={edge.node}
            />
        )
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {this.renderShowsList()}
            </ScrollView>
        );
    }
}

let styles = StyleSheet.create({
    scrollContainer: {
        paddingTop: 20 + 12
    }
});

export default Relay.createContainer(Shows, {
    fragments: {
        viewer: () => Relay.QL`
            fragment on User {
                subscriptions(first:100) {
                    edges {
                        node {
                            id
                            ${PodcastListItem.getFragment('podcast')}
                        }
                    }
                }
            }
        `
    }
})