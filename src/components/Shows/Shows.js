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
import {SecondaryText} from '../../type';
import PodcastListItem from './PodcastListItem';
import AddShowButton from './AddShowButton';

class Shows extends Component {

    static propTypes = {

    };

    static defaultProps = {
        
    };

    renderHelp() {
        return (
            <SecondaryText style={styles.help}>Once you start following a few shows, they'll appear here.</SecondaryText>
        );
    }

    renderShowsList() {
        return this.props.viewer.subscriptions.edges.map(edge =>
            <PodcastListItem
                key={edge.node.id}
                podcast={edge.node}
            />
        )
    }

    render() {
        let hasShows = this.props.viewer.subscriptions.edges.length > 0;
        return (
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {!hasShows && this.renderHelp()}
                {this.renderShowsList()}
                <AddShowButton />
                {hasShows && <SecondaryText style={styles.help}>Long-press on an episode to see options</SecondaryText>}
            </ScrollView>
        );
    }
}

let styles = StyleSheet.create({
    scrollContainer: {
        paddingTop: 20 + 12
    },
    help: {
        textAlign: 'center',
        padding: 20,
        marginTop: 100,
        marginBottom: 100
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