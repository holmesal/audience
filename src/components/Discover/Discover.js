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

import EpisodeCard from './EpisodeCard';
import Recommendation from './Recommendation';
import Annotation from './Annotation';
import {PrimaryText, SecondaryText} from '../../type';

class Discover extends Component {

    state = {
        refreshing: false
    };

    componentDidMount() {
        //console.info('discover mount!', this.props)
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
        //console.info('got props!')
        console.info(nextProps.viewer.friendActivity)
        //this.parseActivity(nextProps.viewer.friendActivity)
    }

    refresh() {
        //console.info('refreshing!');
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

    renderNoActivity() {
        if (this.props.viewer.friendActivity.edges.length > 0) return <View />;
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <PrimaryText style={{textAlign: 'center', marginBottom: 20}}>Your friends haven't done anything...</PrimaryText>
                <SecondaryText style={{textAlign: 'center'}}>Check back later!</SecondaryText>
            </View>
        )
    }

    renderEpisode(episode, activity) {
        let groupedByType = _.groupBy(activity, edge => edge.node.__typename);
        //console.info(groupedByType)
        let recommendations = groupedByType.RecommendationActivity || [];
        let annotations = groupedByType.AnnotationActivity || [];
        let annotationsByUser = _.groupBy(annotations, edge => edge.node.annotation.user.id) || [];
        //console.info(`(feed item) [${episode.id}] - ${recommendations.length} recs and ${annotations.length} annotations (by ${_.keys(annotationsByUser).length} users)`);
        let activityItems = recommendations.map(activityEdge => <Recommendation key={activityEdge.node.id} recommendation={activityEdge.node.recommendation}/>);
        activityItems = activityItems.concat(_.map(annotationsByUser, (annotations, userId) => <Annotation key={userId} annotations={annotations} user={annotations[0].node.annotation.user} />));
        // Tell the last activity item that it is last
        if (activityItems.length > 0) activityItems[activityItems.length - 1] = React.cloneElement(activityItems[activityItems.length - 1], {isLast:true});
        // Fade the episode if the viewer has heard it
        let opacity = episode.viewerHasHeard ? 0.3 : 1;
        return (
            <View key={episode.id} style={[styles.episodeGroup, {opacity}]}>
                <EpisodeCard key={episode.id} episode={episode}/>
                {activityItems}
            </View>
        )
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
        //console.info('grouped', groupedByEpisode, episodes);
        let episodeComs = _.map(groupedByEpisode, (activity, episodeId) => this.renderEpisode(episodes[episodeId], activity));
        return (
            <ScrollView
                style={styles.wrapper}
                refreshControl={this.renderRefreshControl()}
            >
                {episodeComs}
                {this.renderNoActivity()}
            </ScrollView>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        paddingTop: 40,
        paddingLeft: 12,
        paddingRight: 12
    },
    episodeGroup: {
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
                                    viewerHasHeard
                                    ${EpisodeCard.getFragment('episode')}
                                }
                                ${Recommendation.getFragment('recommendation')}
                            }
                            user {
                                id
                            }
                        }
                        ... on AnnotationActivity {
                            annotation {
                                episode {
                                    id
                                    viewerHasHeard
                                    ${EpisodeCard.getFragment('episode')}
                                }
                                user {
                                    id
                                    ${Annotation.getFragment('user')}
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