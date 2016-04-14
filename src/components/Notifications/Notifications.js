import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import RefreshableListView from '../common/RefreshableListView';
import DebugView from '../common/DebugView';
import colors from '../../colors';
import NotificationItem from './NotificationItem';

const NOTIFICATIONS_PER_PAGE = 20;

class Feed extends Component {

    state = {
        refreshing: false
    };

    onLoadMore() {
        this.props.relay.setVariables({
            first: this.props.relay.variables.first + NOTIFICATIONS_PER_PAGE
        });
    }

    onRefresh() {
        this.setState({refreshing: true});
        this.props.relay.forceFetch({}, (readyState) => {
            if (readyState.done) this.setState({refreshing: false});
        });
    }

    renderItem(edge, sectionId, rowId) {
        return <NotificationItem key={rowId} notification={edge.node} />
    }

    render() {
        return <RefreshableListView
            items={this.props.viewer.notifications}
            renderItem={this.renderItem.bind(this)}
            onLoadMore={this.onLoadMore.bind(this)}
            onRefresh={this.onRefresh.bind(this)}
            refreshing={this.state.refreshing}
            refreshAfterMinutes={30}
        />;
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingTop: 20
    }
});

export default Relay.createContainer(Feed, {
    initialVariables: {
        first: NOTIFICATIONS_PER_PAGE
    },
    fragments: {
        viewer: () => Relay.QL`
            fragment on User {
                notifications(first:$first) {
                    edges {
                        node {
                            __typename
                            ${NotificationItem.getFragment('notification')}
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