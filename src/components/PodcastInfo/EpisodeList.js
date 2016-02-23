import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import Spinner from 'react-native-spinkit';
import EpisodeListItem from './EpisodeListItem';

import colors from '../../colors';

class EpisodeList extends Component {

    static propTypes = {
        episodes: PropTypes.array,
        doneAnimating: PropTypes.bool
    };

    static defaultProps = {

    };

    renderLoading() {
        return (
            <View style={{flex: 1, height: 400, alignItems: 'center', justifyContent: 'center'}}>
                <Spinner
                    color={colors.lightGrey}
                    type="Wave"
                    style={{opacity: 0.2}}
                />
            </View>
        )
    }

    renderEpisodeList() {
        return this.props.podcast.episodes.edges.map(edge => (
            <EpisodeListItem
                episode={edge.node}
                key={edge.node.id}
            />
        ))
    }

    render() {
        let view = this.props.podcast.episodes.edges.length > 0 && this.props.doneAnimating ? this.renderEpisodeList() : this.renderLoading();
        return (
            <View style={styles.wrapper}>
                {view}
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        //flex: 1,
        //height: 400,
        //alignItems: 'center',
        //justifyContent: 'center'
    }
});

export default Relay.createContainer(EpisodeList, {
    fragments: {
        podcast: () => Relay.QL`
            fragment on Podcast {
                episodes(first:30) {
                    edges {
                        node {
                            id
                            ${EpisodeListItem.getFragment('episode')}
                        }
                    }
                }
            }
        `
    }
})