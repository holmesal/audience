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

    componentDidMount() {
        // Refresh every 30 minutes
        this.refetchTimer = setInterval(() => {
            this.refresh();
        }, 1000 * 60 * 30)
    }

    componentWillUnmount() {
        clearInterval(this.refetchTimer);
    }

    refresh() {
        console.info('refreshing!');
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
        if (this.props.viewer.stream.items.edges.length > 0) {
            return this.props.viewer.stream.items.edges.map(edge =>
                <Recommendation
                    key={edge.node.id}
                    style={styles.recommendation}
                    recommendation={edge.node}
                />
            );
        } else {
            return (
                <View style={{flex: 1, alignItems: 'center', padding: 20}}>
                    <Text style={{fontSize: 50, marginBottom: 20}}>😔</Text>
                    <Text style={{color: '#fefefe', fontSize: 14, fontWeight: '200', marginBottom: 12}}>Your friends haven't recommended anything yet...</Text>
                    <Text style={{color: '#fefefe', fontSize: 14, fontWeight: '200'}}>Check back later!</Text>
                </View>
            )
        }
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