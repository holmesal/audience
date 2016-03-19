import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

class EpisodeActivity extends Component {

    static propTypes = {

    };

    static defaultProps = {

    };

    renderRecommendations() {
        //return _.map(recs, rec => <Text>{rec.node.user.}</Text>)
    }

    render() {

        // group incoming activity by type
        let groupedByType = _.groupBy(this.props.activity, edge => edge.node.__typename);
        console.info(groupedByType)
        let recommendations = groupedByType.RecommendationActivity;
        let annotationsByUser = _.groupBy(groupedByType.AnnotationActivity, edge => edge.node.annotation.user.id);
        return (
            <View style={styles.wrapper}>
                <Text>EpisodeActivity: {this.props.episode.id}</Text>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});

export default Relay.createContainer(EpisodeActivity, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                id
                title
            }
        `
    }
});