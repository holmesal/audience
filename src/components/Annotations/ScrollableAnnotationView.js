import React, {
    Component,
    Image,
    PropTypes,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import ScrollableAnnotationItem from './ScrollableAnnotationItem';

export default class ScrollableAnnotationView extends Component {

    renderAnnotations() {
        return this.props.annotations.map(ann => <ScrollableAnnotationItem key={ann.id} annotation={ann} />)
    }

    handleContentSizeChange(newSize) {
        //this.refs.scrollView.scrollTo({y: newSize})
    }

    render() {
        console.info(this.props.annotations)
        return (
            <ScrollView
                ref="scrollView"
                style={styles.wrapper}
                onContentSizeChange={this.handleContentSizeChange.bind(this)}
            >
                <View style={styles.spacer} />
                {this.renderAnnotations()}
            </ScrollView>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        //flex: 1
    },
    spacer: {
        flex: 1,
        backgroundColor: 'green'
    }
});