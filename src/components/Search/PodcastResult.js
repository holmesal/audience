import React, {
    Component,
    Image,
    NavigationExperimental,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
const {
    Container: NavigationContainer
} = NavigationExperimental;
import PodcastActionSheet from '../common/PodcastActionSheet';

import store from '../../redux/create';
import {showPodcastInfo} from '../../redux/modules/podcastInfo';
import {blur} from '../../redux/modules/search';
import {showShowInfo} from '../Nav/tabs/Search';

import ResultItem from './ResultItem';

class PodcastResult extends Component {

    state = {
        actionSheetVisible: false
    };

    handlePress() {
        store.dispatch(blur());
        //store.dispatch(showPodcastInfo(this.props.podcast.id));
        console.info(this.props.podcast.id);
        this.props.onNavigate(showShowInfo(this.props.podcast.id));
    }

    render() {
        return (
            <View>
                <ResultItem
                    key={this.props.podcast.id}
                    primary={this.props.podcast.name}
                    secondary={'Podcast'}
                    photoUrl={this.props.podcast.artwork}
                    photoShape={'square'}
                    onPress={this.handlePress.bind(this)}
                    onLongPress={() => this.setState({actionSheetVisible: true})}
                />
                <PodcastActionSheet
                    podcast={this.props.podcast}
                    visible={this.state.actionSheetVisible}
                    onComplete={() => this.setState({actionSheetVisible: false})}
                />
            </View>
        )
    }
}

const contained = NavigationContainer.create(PodcastResult);
export default Relay.createContainer(contained, {
    fragments: {
        podcast: () => Relay.QL`
            fragment on Podcast {
                id
                name
                artwork
                ${PodcastActionSheet.getFragment('podcast')}
            }
        `
    }
})