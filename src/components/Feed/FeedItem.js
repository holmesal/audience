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
import FeedAnnotation from './Annotation';
import FeedRecommendation from './Recommendation';

class FeedItem extends Component {

    render() {
        const { activity } = this.props;
        switch (this.props.activity.__typename) {
            case 'RecommendationActivity':
                return <FeedRecommendation recommendationActivity={activity} />;
            case 'AnnotationActivity':
                return <FeedAnnotation annotationActivity={activity} />;
            default:
                return <View />;
        }
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});

export default Relay.createContainer(FeedItem, {
    fragments: {
        activity: () => Relay.QL`
            fragment on Activity {
                __typename
                ... on RecommendationActivity {
                    ${FeedRecommendation.getFragment('recommendationActivity')}
                }
                ... on AnnotationActivity {
                    ${FeedAnnotation.getFragment('annotationActivity')}
                }
            }
        `
    }
})