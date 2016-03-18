import React, {
    Component,
    Image,
    ListView,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

import ScrollableAnnotationItem from './ScrollableAnnotationItem';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

export default class ScrollableAnnotationView extends Component {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: this.rowHasChanged.bind(this)});
        this.state = {
            dataSource: this.ds.cloneWithRows(props.annotations)
        };
    }

    componentWillReceiveProps(nextProps) {
        console.info('new props!')
        console.info('setting new datasource!')
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(nextProps.annotations)
        });
        if (nextProps.annotations != this.props.annotations) {
        }
    }

    rowHasChanged(r1, r2) {
        console.info('did change?', r1, r2, r1 !== r2)
        return r1 !== r2;
    }

    renderRow(annotation) {
        return <ScrollableAnnotationItem key={annotation.id} annotation={annotation} />
    }

    handleContentSizeChange(newSize) {
        //this.refs.scrollView.scrollTo({y: newSize})
    }

    render() {
        console.info(this.props.annotations)
        return (
            <ListView
                renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                style={styles.container}
            />
        );
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1
    }
});