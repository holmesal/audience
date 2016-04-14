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

class NotificationItem extends Component {

    render() {
        const { notification } = this.props;
        return <DebugView text={this.props.notification.__typename} />
        //switch (this.props.notification.__typename) {
        //    case 'RecommendationActivity':
        //        return <FeedRecommendation recommendationActivity={notification} />;
        //    case 'AnnotationActivity':
        //        return <FeedAnnotation annotationActivity={notification} />;
        //    default:
        //        return <View />;
        //}
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});

export default Relay.createContainer(NotificationItem, {
    fragments: {
        notification: () => Relay.QL`
            fragment on Notification {
                __typename

            }
        `
    }
})