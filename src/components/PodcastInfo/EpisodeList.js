import React, {
    Component,
    Image,
    ListView,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import Relay from 'react-relay';
import EpisodeListItem from './EpisodeListItem';

import colors from '../../colors';

class EpisodeList extends Component {

    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            ds,
            dataSource: ds.cloneWithRows(props.podcast.episodes.edges),
            canLoadMore: false,
            isLoadingMore: false
        };
    }

    static propTypes = {
        episodes: PropTypes.array,
        doneAnimating: PropTypes.bool
    };

    static defaultProps = {

    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            dataSource: this.state.ds.cloneWithRows(nextProps.podcast.episodes.edges)
        });
    }

    renderEpisodeListItem(edge) {
        return (
            <EpisodeListItem
                episode={edge.node}
                key={edge.node.id}
            />
        )
    }

    render() {
        return (
            <ListView
                contentContainerStyle={{height: 100}}
                renderScrollComponent={props => <InfiniteScrollView {...props} />}
                dataSource={this.state.dataSource}
                renderRow={this.renderEpisodeListItem.bind(this)}
                canLoadMore={this.state.canLoadMore}
                isLoadingMore={this.state.isLoadingMore}
            />
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