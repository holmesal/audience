import React, {
    Component,
    Image,
    PropTypes,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import Relay from 'react-relay';

import PodcastResult from './PodcastResult';

class Results extends Component {

    gotoPodcast(podcastId) {
        //console.info('navigating to podcast: ', podcastId);
        this.props.dispatch(showPodcastInfo(podcastId));
        this.props.onSelect();
    }

    renderResults() {
        //console.info('got podcast search results!', this.props.search.results);
        return this.props.search.results.edges.map(edge => {
            return <PodcastResult
                key={edge.node.id}
                podcast={edge.node}
            />
        });
    }

    render() {

        return (
            <ScrollView style={styles.wrapper}
                        contentContainerStyle={{paddingTop: 64}}
                        keyboardShouldPersistTaps={true}
                        keyboardDismissMode="interactive"
            >
                {this.renderResults()}
                <TouchableOpacity onPress={this.props.showPlayer}><View  style={{flex: 1, alignSelf: 'stretch', height: 300}}></View></TouchableOpacity>
            </ScrollView>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});

export default Relay.createContainer(Results, {
    fragments: {
        search: () => Relay.QL`
            fragment on Search {
                results {
                    edges {
                        node {
                            id
                            ${PodcastResult.getFragment('podcast')}
                        }
                    }
                }
            }
        `
    }
});