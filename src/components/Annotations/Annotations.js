import React, {
    Component,
    Image,
    ListView,
    PropTypes,
    ScrollView,
    StyleSheet,
    Text,
    UIManager,
    View
} from 'react-native';
import _ from 'lodash';
import Relay from 'react-relay';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import Annotation from './Annotation';
import PlaceKeeper from './PlaceKeeper';

class Annotations extends Component {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: this.rowHasChanged.bind(this)});
        this.state = {
            dataSource: this.ds.cloneWithRows(props.episode.annotations.edges.slice().reverse())
        };
    }

    static propTypes = {

    };

    static defaultProps = {

    };

    rows = {};
    _cellOffsets = [];

    componentWillReceiveProps(nextProps) {
        console.info('setting new datasource!')
        this.setState({
            dataSource: this.ds.cloneWithRows(nextProps.episode.annotations.edges.slice().reverse())
        });
    }

    componentDidMount() {
        console.info(this._scrollView)
        //setTimeout(() => {
        //    this._scrollView.scrollResponderScrollTo(0,200)
        //}, 1000)
    }


    rowHasChanged(r1, r2) {
        return r1 !== r2;
    }

    //renderRow(edge) {
    //    return (
    //        <Annotation ref={(row) => {this.rows[edge.node.id] = row}} annotation={edge.node} onLayout={ev => console.info('layout', edge.node.id, ev.nativeEvent.layout)} />
    //    )
    //}

    renderRow(edge) {
        return (
            <View style={{height: 100}} ref={(row) => {this.rows[edge.node.id] = row}} annotation={edge.node}><Text>hey</Text></View>
        )
    }

    handleCellLayout(idx, ev) {
        console.info('annotations saw child layout', idx, ev);
        this._cellOffsets[idx] = ev.y;

    }

    scrollToLastSeen(idx) {
        console.info('new last seen idx', idx);
        let offset = this._cellOffsets[idx];
        if (!offset && offset != 0) console.warn(`no cell offset found for cell at index: ${idx}`, this._cellOffsets);
        else {
            console.info('scrolling to ' + offset);
            this._scrollView.scrollTo({y: offset});
        }
        //let edge = this.props.episode.annotations.edges[idx];
        //if (!edge) {
        //    console.warn(`oh snap, edge doesn't exist for idx: ${idx}`);
        //} else {
        //    let id = edge.node.id;
        //    let com = this.rows[id];
        //}
    }

    render() {
        //console.info(this.state.dataSource);
        // Fake edges to test placekeeper
        //this.props.episode.annotations.edges = _.map(_.range(10000000), i => ({node: {time: i/1000}}));
        return (
            <View style={styles.wrapper}>
                <ListView
                    ref={component => this._scrollView = component}
                    renderScrollComponent={props => <InvertibleScrollView {...props} inverted onCellLayout={this.handleCellLayout.bind(this)} onLayout={console.info}/>}
                    style={styles.wrapper}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                />
                <PlaceKeeper
                    edges={this.props.episode.annotations.edges}
                    onChangeLastSeenIdx={this.scrollToLastSeen.bind(this)}
                />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});

export default Relay.createContainer(Annotations, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                annotations(first: 100) {
                    edges {
                        node {
                            id
                            time
                            ${Annotation.getFragment('annotation')}
                        }
                    }
                }
            }
        `
    }
});