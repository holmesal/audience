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
import FeedListView from './FeedListView';

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

    render() {
        return <FeedListView
            activity={this.props.viewer.globalActivity}
            onLoadMore={this.onLoadMore.bind(this)}
            onRefresh={this.onRefresh.bind(this)}
            refreshing={this.state.refreshing}
            refreshAfterMinutes={30}
        />;
    }
}

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