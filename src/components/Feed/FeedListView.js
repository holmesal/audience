import React, {
    Component,
    Image,
    ListView,
    PropTypes,
    RefreshControl,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import DebugView from '../common/DebugView';
import colors from '../../colors';
import FeedItem from './FeedItem';

export default class FeedListView extends Component {

    static propTypes = {
        refreshAfterMinutes: React.PropTypes.number,
        refreshing: React.PropTypes.bool
    };

    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            ds,
            dataSource: ds.cloneWithRows(props.activity.edges),
            canLoadMore: false,
            isLoadingMore: false,
            autoRefreshing: false
        };
    }

    componentDidMount() {
        console.info(this.props.activityItems);
        if (this.props.refreshAfterMinutes) {
            this.refetchTimer = setInterval(() => {
                this.refresh();
            }, this.props.refreshAfterMinutes * 60 * 1000);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.activity != nextProps.activity) {
            console.info('list of activity items changed!', this.props.activity);
            this.setState({
                dataSource: this.state.ds.cloneWithRows(nextProps.activity.edges),
                isLoadingMore: false
            });
        }
    }

    renderFeedItem(edge) {
        return <FeedItem activity={edge.node} />
    }

    renderHeader() {
        return <View />;
    }

    loadMore() {
        if (!this.state.isLoadingMore) {
            console.info('loading more!');
            this.props.onLoadMore();
            this.setState({isLoadingMore: true});
        }
    }

    refresh() {
        this.props.onRefresh();
    }

    renderRefreshControl() {
        return (
            <RefreshControl
                onRefresh={this.refresh.bind(this)}
                tintColor="#aaaaaa"
                refreshing={this.props.refreshing || this.state.autoRefreshing}
            />
        )
    }

    render() {
        console.info('activity: ', this.props.activity);
        return (
            <ListView
                contentContainerStyle={styles.scrollContent}
                ref={com => this._scrollView = com}
                renderScrollComponent={props => <InfiniteScrollView {...props} />}
                dataSource={this.state.dataSource}
                renderRow={this.renderFeedItem.bind(this)}
                renderHeader={this.renderHeader.bind(this)}
                canLoadMore={this.props.activity.pageInfo.hasNextPage}
                onLoadMoreAsync={this.loadMore.bind(this)}
                refreshControl={this.renderRefreshControl()}
            />
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    scrollContent: {
        paddingTop: 20,
        paddingLeft: 8,
        paddingRight: 8
    }
});

// Would be nice to specify connection pageInfo args and such here, but:
// https://github.com/facebook/relay/issues/170

//export default Relay.createContainer(FeedListView, {
//    fragments: {
//        activity: () => Relay.QL`
//            fragment on Activity {
//                ${FeedItem.getFragment('activity')}
//            }
//        `
//    }
//})