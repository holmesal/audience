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
const {Container: NavigationContainer} = NavigationExperimental;
import DebugView from '../common/DebugView';
import colors from '../../colors';
import InfoRowButton from './InfoRowButton';
import { showShowInfo } from '../Nav/tabs/Feed';
import store from '../../redux/create';
import { playEpisode } from '../../redux/modules/player';

class InfoRow extends Component {

    playEpisode() {
        let startTime = this.props.annotation.time - 3;
        if (startTime < 0) startTime = 0;
        store.dispatch(playEpisode(this.props.annotation.episode.id, startTime));
    }

    showPodcast() {
        this.props.onNavigate(showShowInfo(this.props.annotation.episode.podcast.id));
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <InfoRowButton top="From the episode"
                               bottom={this.props.annotation.episode.title}
                               onPress={this.playEpisode.bind(this)}
                />
                <InfoRowButton top="From the podcast"
                               bottom={this.props.annotation.episode.podcast.name}
                               onPress={this.showPodcast.bind(this)}
                />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 84,
        opacity: 0.7,
        backgroundColor: 'rgba(35,35,35,0.2)'
    }
});

const contained = NavigationContainer.create(InfoRow);

export default Relay.createContainer(contained, {
    fragments: {
        annotation: () => Relay.QL`
            fragment on Annotation {
                id
                time
                episode {
                    id
                    title
                    podcast {
                        id
                        name
                    }
                }
            }
        `
    }
})