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
import CompactAnnotation from '../Annotation/CompactAnnotation';

class Annotation extends Component {

    render() {
        return (
            <View style={styles.wrapper}>
                <CompactAnnotation annotation={this.props.annotationActivity.annotation} />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});

export default Relay.createContainer(Annotation, {
    fragments: {
        annotationActivity: () => Relay.QL`
            fragment on AnnotationActivity {
                id
                annotation {
                    ${CompactAnnotation.getFragment('annotation')}
                }
            }
        `
    }
})