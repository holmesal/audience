import React, {
    Component,
    Image,
    ListView,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import PhotoHeader from './PhotoHeader';
import TopBar from './TopBar';
import colors from '../../colors';
import FollowToggle from './FollowToggle';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import EpisodeListItem from './EpisodeListItem';
import moment from 'moment';

import {connect} from 'react-redux';
import {podcastInfo$, hidePodcastInfo, showPodcastInfo} from '../../redux/modules/podcastInfo';

const EPISODE_RESULTS_PER_PAGE = 30;

class PodcastInfo extends Component {

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

    componentDidMount() {
        this.checkLastRefreshed();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.podcast.episodes != nextProps.podcast.episodes) {
            console.info('list of episodes changed!');
            this.setState({
                dataSource: this.state.ds.cloneWithRows(nextProps.podcast.episodes.edges),
                isLoadingMore: false
            });
        }
        // This is no longer necessary, because we render a loading view in between this podcast having episodes and the next
        // If the podcast id changes, scroll to the top
        //if (this.props.podcast.id != nextProps.podcast.id) {
        //    // Scroll to the top
        //    this._scrollView.scrollTo({y: 0, animated: false});
        //    // Possibly force refresh this episode list
        //    this.checkLastRefreshed();
        //}
    }

    renderEpisodeListItem(edge) {
        return (
            <EpisodeListItem
                episode={edge.node}
                key={edge.node.id}
            />
        )
    }

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

    renderHeader() {
        return (
            <View>
                <PhotoHeader
                    podcast={this.props.podcast}
                />
                <FollowToggle
                    key="followToggle"
                    podcast={this.props.podcast}
                />
            </View>
        )
    }

    loadMore() {
        if (!this.state.isLoadingMore) {
            console.info('loading more!');
            this.props.relay.setVariables({
                first: this.props.relay.variables.first + EPISODE_RESULTS_PER_PAGE
            });
            this.setState({isLoadingMore: true});
        }
    }

    checkLastRefreshed() {
        let lastRefreshed = moment(new Date(this.props.podcast.lastEpisodeRefresh));
        let now = moment();
        let howManyMinutesAgo = now.diff(lastRefreshed, 'minutes');
        console.info(`podcast ${this.props.podcast.id} was last refreshed: ${this.props.podcast.lastEpisodeRefresh} which is ${howManyMinutesAgo} minutes ago`);
        if (howManyMinutesAgo > 60) this.forceFetchLatest();
    }

    forceFetchLatest() {
        console.info('force fetching latest episodes!');
        this.props.relay.setVariables({
            forceFetchLatest: true
        });
    }

    render() {
        //console.info('pageinfo', this.props.podcast.episodes.pageInfo);
        return (
            <View style={{flex: 1}}>
                <ListView contentContainerStyle={styles.scrollContent}
                          ref={com => this._scrollView = com}
                          renderScrollComponent={props => <InfiniteScrollView {...props} />}
                          dataSource={this.state.dataSource}
                          renderRow={this.renderEpisodeListItem.bind(this)}
                          renderHeader={this.renderHeader.bind(this)}
                          canLoadMore={this.props.podcast.episodes.pageInfo.hasNextPage}
                          onLoadMoreAsync={this.loadMore.bind(this)}
                />
            </View>
        )
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});

let connectedPodcastInfo = connect()(PodcastInfo);
export default Relay.createContainer(connectedPodcastInfo, {
    initialVariables: {
        first: EPISODE_RESULTS_PER_PAGE,
        forceFetchLatest: false
    },
    fragments: {
        podcast: () => Relay.QL`
            fragment on Podcast {
                id
                lastEpisodeRefresh
                ${PhotoHeader.getFragment('podcast')}
                ${FollowToggle.getFragment('podcast')}
                episodes(first:$first, forceFetchLatest:$forceFetchLatest) {
                    edges {
                        node {
                            id
                            ${EpisodeListItem.getFragment('episode')}
                        }
                    }
                    pageInfo {
                        hasNextPage
                    }
                }
            }
        `
    }
})