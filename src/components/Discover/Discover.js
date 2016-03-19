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

import Recommendation from './OldRecommendation';
import EpisodeActivity from './EpisodeActivity';

class Discover extends Component {

    state = {
        refreshing: false
    };

    componentDidMount() {
        console.info('discover mount!', this.props)
        // Refresh every 30 minutes
        this.refetchTimer = setInterval(() => {
            this.refresh();
        }, 1000 * 60 * 30)
        //this.parseActivity(this.props.viewer.friendActivity);
    }

    componentWillUnmount() {
        clearInterval(this.refetchTimer);
    }

    componentWillReceiveProps(nextProps) {
        console.info('got props!')
        console.info(nextProps.viewer.friendActivity)
        //this.parseActivity(nextProps.viewer.friendActivity)
    }

    //parseActivity(friendActivity) {
    //    console.info('parsing friend activity', friendActivity);
    //    let groupedByEpisode = _.groupBy(friendActivity.edges, ({node}) => {
    //        console.info(node);
    //        if (node.__typename === 'AnnotationActivity') {
    //            return node.annotation.episode.id;
    //        } else if (node.__typename === 'RecommendationActivity') {
    //            return node.recommendation.episode.id;
    //        } else {
    //            console.warn('Got unrecognized activity type: ', node.__typename)
    //        }
    //    });
    //    console.info(groupedByEpisode)
    //}

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
        let episodes = {};
        let groupedByEpisode = _.groupBy(this.props.viewer.friendActivity.edges, ({node}) => {
            //console.info(node);
            if (node.__typename === 'AnnotationActivity') {
                let episode = node.annotation.episode;
                if (!episodes[episode.id]) episodes[episode.id] = episode;
                return episode.id
            } else if (node.__typename === 'RecommendationActivity') {
                let episode = node.recommendation.episode;
                if (!episodes[episode.id]) episodes[episode.id] = episode;
                return episode.id
            } else {
                console.warn('Got unrecognized activity type: ', node.__typename)
            }
        });
        console.info('grouped', groupedByEpisode, episodes);
        let episodeComs = _.map(groupedByEpisode, (activity, episodeId) => <EpisodeActivity key={episodeId} activity={activity} episode={episodes[episodeId]} />);
        return (
            <ScrollView
                style={styles.wrapper}
                refreshControl={this.renderRefreshControl()}
            >
                {episodeComs}
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
            friendActivity {
                edges {
                    node {
                        __typename
                        ... on RecommendationActivity {
                            recommendation {
                                episode {
                                    id
                                    ${EpisodeActivity.getFragment('episode')}
                                }
                            }
                            user {
                                id
                            }
                        }
                        ... on AnnotationActivity {
                            annotation {
                                episode {
                                    id
                                    ${EpisodeActivity.getFragment('episode')}
                                }
                                user {
                                    id
                                }
                            }
                        }
                    }
                }
            }
        }
        `
    }
});