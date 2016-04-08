import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import DebugView from '../common/DebugView';
import colors from '../../colors';
import OldRecommendation from '../Discover/Recommendation';
import EpisodeCard from '../Discover/EpisodeCard';

class Recommendation extends Component {

    render() {
        const {recommendationActivity} = this.props;
        return (
            <View style={styles.wrapper}>
                <EpisodeCard episode={recommendationActivity.recommendation.episode} />
                <OldRecommendation recommendation={recommendationActivity.recommendation} />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});

export default Relay.createContainer(Recommendation, {
    fragments: {
        recommendationActivity: () => Relay.QL`
            fragment on RecommendationActivity {
                id
                recommendation {
                    episode {
                        ${EpisodeCard.getFragment('episode')}
                    }
                    ${OldRecommendation.getFragment('recommendation')}
                }
            }
        `
    }
})