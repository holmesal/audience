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

import Recommendation from './Recommendation';

class Discover extends Component {

    state = {
        refreshing: false
    };

    refresh() {
        this.setState({refreshing: true});
        this.props.relay.forceFetch({}, (readyState) => {
            //console.info(readyState);
            if (readyState.done) this.setState({refreshing: false});
        });
    }

    renderRefreshControl() {
        return (
            <RefreshControl
                onRefresh={this.refresh.bind(this)}
                tintColor="#aaaaaa"
                refreshing={this.state.refreshing}
            />
        )
    }

    renderStream() {
        console.info(this.props.viewer.stream.items.edges)
        return this.props.viewer.stream.items.edges.map(edge =>
            <Recommendation
                key={edge.node.id}
                style={styles.recommendation}
                recommendation={edge.node}
            />
        );
    }

    render() {
        return (
            <ScrollView
                style={styles.wrapper}
                refreshControl={this.renderRefreshControl()}
            >
                {this.renderStream()}
            </ScrollView>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingTop: 40
    },
    recommendation: {
        marginBottom: 40
    }
});

export default Relay.createContainer(Discover, {
    fragments: {
        viewer: () => Relay.QL`
        fragment on User {
            id
            stream {
                items(first:50) {
                    edges {
                        node {
                            id
                            ${Recommendation.getFragment('recommendation')}
                        }
                    }
                }
            }
        }
        `
    }
});