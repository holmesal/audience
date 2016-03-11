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
            dataSource: this.ds.cloneWithRows(props.episode.annotations.edges.slice())
        };
    }

    static propTypes = {

    };

    static defaultProps = {

    };

    rows = {};
    _containerHeight = 0;

    componentWillReceiveProps(nextProps) {
        console.info('setting new datasource!')
        this.setState({
            dataSource: this.ds.cloneWithRows(nextProps.episode.annotations.edges.slice())
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

    renderRow(edge) {
        return (
            <Annotation ref={(row) => {this.rows[edge.node.id] = row}} annotation={edge.node} onLayout={ev => console.info('layout', edge.node.id, ev.nativeEvent.layout)} />
        )
    }

    //renderRow(edge) {
    //    return (
    //        <View style={{height: 100}} ref={(row) => {this.rows[edge.node.id] = row}} annotation={edge.node}><Text>hey</Text></View>
    //    )
    //}

    handleCellLayout(idx, ev) {
        console.info('annotations saw child layout', idx, ev);
    }

    scrollToLastSeen(idx) {
        console.info('new last seen idx', idx);
        let edge = this.props.episode.annotations.edges[idx];
        if (!edge) {
            console.warn(`oh snap, edge doesn't exist for idx: ${idx}`);
        } else {
            let id = edge.node.id;
            let com = this.rows[id];
            var handle = React.findNodeHandle(com);
            UIManager.measureLayoutRelativeToParent(handle, (e) => {console.error(e)}, (x, y, w, h) => {
                console.log('offset', x, y, w, h);
                let scrollTarget = y - this._containerHeight + h;
                console.info('scrolLTarget', scrollTarget);
                this._scrollView.scrollTo({y: scrollTarget});
            });
        }
    }

    render() {
        //console.info(this.state.dataSource);
        // Fake edges to test placekeeper
        //this.props.episode.annotations.edges = _.map(_.range(10000000), i => ({node: {time: i/1000}}));
        //            renderScrollComponent={props => <InvertibleScrollView {...props} inverted onCellLayout={this.handleCellLayout.bind(this)}/>}
        return (
            <View style={styles.wrapper} onLayout={ev => {this._containerHeight = ev.nativeEvent.layout.height}}>
                <ListView
                    ref={component => this._scrollView = component}
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