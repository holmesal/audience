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

import {connect} from 'react-redux/native';
import {createSelector} from 'reselect';
import {results$} from '../../redux/modules/search';
import {showPodcastInfo} from '../../redux/modules/podcastInfo';

class Results extends Component {

    gotoPodcast(podcastId) {
        //console.info('navigating to podcast: ', podcastId);
        this.props.dispatch(showPodcastInfo(podcastId));
        this.props.onSelect();
    }

    renderResults() {
        console.info('got new results!', this.props.search.results);
        return this.props.search.results.edges.map(edge => {
            return <PodcastResult podcast={edge.node} />
        });
    }

    render() {

        return (
            <ScrollView style={styles.wrapper} contentContainerStyle={{paddingTop: 64}} keyboardShouldPersistTaps>
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

//let select = createSelector(results$, (results) => ({results}));
//export default connect(select)(Results);

export default Relay.createContainer(Results, {
    fragments: {
        search: () => Relay.QL`
            fragment on Search {
                results {
                    edges {
                        node {
                            ${PodcastResult.getFragment('podcast')}
                        }
                    }
                }
            }
        `
    }
})