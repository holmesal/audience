import React, {
    Animated,
    Component,
    Dimensions,
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
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {currentTime$} from '../../redux/modules/player';
import Relay from 'react-relay';

import InvertibleScrollView from 'react-native-invertible-scroll-view';
import Annotation from './Annotation';
import PlaceKeeper from './PlaceKeeper';
import WelcomeView from './WelcomeView';
import Comment from './Comment';

class Annotations extends Component {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: this.rowHasChanged.bind(this)});
        this.state = {
            dataSource: this.ds.cloneWithRows(this.getDataSourceFromAnnotations(props.episode.annotations.edges)),
            containerHeight: Dimensions.get('window').height - 66 - 52 - 66,
            opacity: new Animated.Value(1)
        };
    }

    static propTypes = {

    };

    static defaultProps = {

    };

    _approxScrollPosition = 0;

    rows = {};
    //containerHeight = Dimensions.get('window').height - 66 - 52 - 66;

    componentWillReceiveProps(nextProps) {
        if (nextProps.episode.annotations != this.props.episode.annotations) {
            console.info('setting new datasource!')
            this.setState({
                dataSource: this.ds.cloneWithRows(this.getDataSourceFromAnnotations(nextProps.episode.annotations.edges))
            });
        }
    }

    getDataSourceFromAnnotations(annotations) {
        let rows = [
            {type: 'welcome-row'},
            {type: 'fake-description-row'}
        ].concat(annotations);
        console.info(rows);
        return rows;
    }


    rowHasChanged(r1, r2) {
        return r1 !== r2;
    }

    renderRow(edge) {
        if (edge.type === 'welcome-row') {
            return <WelcomeView episode={this.props.episode}
                                style={{height: this.state.containerHeight}}/>
        } else if (edge.type === 'fake-description-row') {
            let avatar = <Image source={{uri: this.props.episode.podcast.artwork}}
                                style={{width: 32, height: 32, borderRadius: 32/2}}/>
            return <Comment name={this.props.episode.podcast.name}
                            text={this.props.episode.description}
                            avatar={avatar} onLayout={(ev) => this._scrollView.scrollTo({y: ev.nativeEvent.layout.height})}/>
        } else {
            return <Annotation ref={(row) => {this.rows[edge.node.id] = row}}
                               annotation={edge.node} />
        }
    }

    handleScroll(ev) {
        //console.info('scroll!', ev.nativeEvent.contentOffset.y);
        this._approxScrollPosition = ev.nativeEvent.contentOffset.y
    }

    scrollToLastSeen(idx) {
        //console.info('new last seen idx', idx);
        let edge = this.props.episode.annotations.edges[idx];
        if (!edge) {
            console.warn(`oh snap, edge doesn't exist for idx: ${idx}`);
            this._scrollView.scrollTo({y: 0});
        } else {
            let id = edge.node.id;
            let com = this.rows[id];
            var handle = React.findNodeHandle(com);
            if (!handle) {
                console.warn('no component - using HACKY SOLUTION OF WAITING 100ms', idx, com, id);
                console.info('this is because the row you\'re trying to scroll to has not yet been rendered, so there is no scroll offset information for it');
                let targetPosition = this._approxScrollPosition + 100;
                this._approxScrollPosition = targetPosition;
                this._scrollView.scrollTo({y: targetPosition, animated: false});
                // Try again in 100ms
                setTimeout(() => this.scrollToLastSeen(idx), 200);
                // uncomment to hide comments while scrolling
                //Animated.spring(this.state.opacity, {toValue: 0}).start();
            } else {
                UIManager.measureLayoutRelativeToParent(handle, (e) => {console.error(e)}, (x, y, w, h) => {
                    //console.log('offset', x, y, w, h);
                    let scrollTarget = y - this.state.containerHeight + h;
                    //console.info('scrolLTarget', scrollTarget);
                    this._scrollView.scrollTo({y: scrollTarget});
                    //Animated.spring(this.state.opacity, {toValue: 1}).start();
                });
            }
        }
    }

    render() {
        //console.info(this.state.dataSource);
        // Fake edges to test placekeeper
        //this.props.episode.annotations.edges = _.map(_.range(10000000), i => ({node: {time: i/1000}}));
        //            renderScrollComponent={props => <InvertibleScrollView {...props} inverted onCellLayout={this.handleCellLayout.bind(this)}/>}
        return (
            <Animated.View style={[styles.wrapper, this.props.style, {opacity: this.state.opacity}]} onLayout={ev => this.setState({containerHeight: ev.nativeEvent.layout.height})}>
                <ListView
                    ref={component => this._scrollView = component}
                    style={styles.wrapper}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    scrollEnabled={false}
                    keyboardDismissMode="interactive"
                    onScroll={this.handleScroll.bind(this)}
                    scrollEventThrottle={60}
                />
                <PlaceKeeper
                    edges={this.props.episode.annotations.edges}
                    onChangeLastSeenIdx={this.scrollToLastSeen.bind(this)}
                />
            </Animated.View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});

let connectedAnnotations = connect(createSelector(currentTime$, currentTime => ({currentTime})))(Annotations);

export default Relay.createContainer(connectedAnnotations, {
    initialVariables: {
        size: 'small'
    },
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                description
                annotations(first: 100) {
                    edges {
                        node {
                            id
                            time
                            ${Annotation.getFragment('annotation')}
                        }
                    }
                }
                ${WelcomeView.getFragment('episode')}
                podcast {
                    artwork(size:$size)
                    name
                }
            }
        `
    }
});