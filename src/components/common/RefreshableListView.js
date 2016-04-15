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
import colors from '../../colors';
import FeedItem from './../Feed/FeedItem';

export default class RefreshableListView extends Component {

    static propTypes = {
        refreshAfterMinutes: React.PropTypes.number,
        refreshing: React.PropTypes.bool,
        items: PropTypes.object,
        renderItem: PropTypes.func
    };

    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            ds,
            dataSource: ds.cloneWithRows(props.items.edges),
            canLoadMore: false,
            isLoadingMore: false,
            autoRefreshing: false
        };
    }

    componentDidMount() {
        //console.info(this.props.items);
        if (this.props.refreshAfterMinutes) {
            this.refetchTimer = setInterval(() => {
                this.refresh();
            }, this.props.refreshAfterMinutes * 60 * 1000);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.items != nextProps.items) {
            console.info('list of items items changed!', this.props.items);
            this.setState({
                dataSource: this.state.ds.cloneWithRows(nextProps.items.edges),
                isLoadingMore: false
            });
        }
    }

    //renderFeedItem(edge) {
    //    return <FeedItem key={edge.node.id} items={edge.node} />
    //}

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
        //console.info('items: ', this.props.items);
        return (
            <ListView
                contentContainerStyle={[styles.scrollContent, this.props.contentContainerStyle]}
                ref={com => this._scrollView = com}
                renderScrollComponent={props => <InfiniteScrollView {...props} />}
                dataSource={this.state.dataSource}
                renderRow={this.props.renderItem}
                renderHeader={this.renderHeader.bind(this)}
                canLoadMore={this.props.items.pageInfo.hasNextPage}
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
        paddingTop: 20
    }
});

// Would be nice to specify connection pageInfo args and such here, but:
// https://github.com/facebook/relay/issues/170

//export default Relay.createContainer(RefreshableListView, {
//    fragments: {
//        items: () => Relay.QL`
//            fragment on Activity {
//                ${FeedItem.getFragment('items')}
//            }
//        `
//    }
//})