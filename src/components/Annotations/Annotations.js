import React, {
    Component,
    Image,
    ListView,
    PropTypes,
    ScrollView,
    StyleSheet,
    Text,
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
        this.rows = {};
        this.state = {
            dataSource: this.ds.cloneWithRows(props.episode.annotations.edges.slice().reverse())
        };
    }

    static propTypes = {

    };

    static defaultProps = {

    };

    componentWillReceiveProps(nextProps) {
        console.info('setting new datasource!')
        this.setState({
            dataSource: this.ds.cloneWithRows(nextProps.episode.annotations.edges.slice().reverse())
        });
    }

    componentDidMount() {
        console.info(this._scrollView)
        setTimeout(() => {
            this._scrollView.scrollResponderScrollTo(0,200)
        }, 1000)
    }


    rowHasChanged(r1, r2) {
        return r1 !== r2;
    }

    renderRow(edge) {
        console.info(this.rows, edge.node.id)
        return (
            <Annotation ref={(row) => {this.rows[edge.node.id] = 'hey'}} annotation={edge.node} />
        )
    }

    scrollToLastSeen(idx) {
        console.info('new last seen idx', idx);
        console.info(this._scrollView);
    }

    render() {
        console.info(this.state.dataSource);
        // Fake edges to test placekeeper
        //this.props.episode.annotations.edges = _.map(_.range(10000000), i => ({node: {time: i/1000}}));
        return (
            <View style={styles.wrapper}>
                <ListView
                    ref={component => this._scrollView = component}
                    renderScrollComponent={props => <InvertibleScrollView {...props} inverted/>}
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