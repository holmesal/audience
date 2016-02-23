import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import store from '../../redux/create';
import {showPodcastInfo} from '../../redux/modules/podcastInfo';

import ResultItem from './ResultItem';

class PodcastResult extends Component {

    render() {
        return (
            <ResultItem
                key={this.props.podcast.id}
                primary={this.props.podcast.name}
                secondary={'Podcast'}
                photoUrl={this.props.podcast.artwork}
                photoShape={'square'}
                onPress={() => store.dispatch(showPodcastInfo(this.props.podcast.id))}
            />
        );
    }
}

export default Relay.createContainer(PodcastResult, {
    fragments: {
        podcast: () => Relay.QL`
            fragment on Podcast {
                id
                name
                artwork
            }
        `
    }
})