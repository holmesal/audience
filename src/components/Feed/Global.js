import React, {
    Component,
    Image,
    PropTypes,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import _ from 'lodash';
import Relay from 'react-relay';

import DebugView from '../common/DebugView';
import FeedItem from './FeedItem';
import RefreshableListView from '../common/RefreshableListView';

const ACTIVITY_ITEMS_PER_PAGE = 20;

class GlobalFeed extends Component {

    state = {
        refreshing: false
    };

    onLoadMore() {
        this.props.relay.setVariables({
            first: this.props.relay.variables.first + ACTIVITY_ITEMS_PER_PAGE
        });
    }

    onRefresh() {
        this.setState({refreshing: true});
        this.props.relay.forceFetch({}, (readyState) => {
            if (readyState.done) this.setState({refreshing: false});
        });
    }

    renderItem(edge) {
        return <FeedItem key={edge.node.id} activity={edge.node} />
    }

    render() {
        return <RefreshableListView
            contentContainerStyle={styles.scrollContent}
            items={this.props.viewer.globalActivity}
            renderItem={this.renderItem.bind(this)}
            onLoadMore={this.onLoadMore.bind(this)}
            onRefresh={this.onRefresh.bind(this)}
            refreshing={this.state.refreshing}
            refreshAfterMinutes={30}
        />;
    }
}

let styles = StyleSheet.create({
    scrollContent: {
        marginLeft: 8,
        marginRight: 8,
        marginTop: 20
    }
});

export default Relay.createContainer(GlobalFeed, {
    initialVariables: {
        first: ACTIVITY_ITEMS_PER_PAGE
    },
    fragments: {
        viewer: () => Relay.QL`
        fragment on User {
            id
            globalActivity(first: $first) {
                edges {
                    node {
                        ${FeedItem.getFragment('activity')}
                    }
                }
                pageInfo {
                    hasNextPage
                }
            }
        }
        `
    }
});