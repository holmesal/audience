import React, {
    Component,
    Dimensions,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import _ from 'lodash';
import Relay from 'react-relay';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {currentTime$} from '../../redux/modules/player';

import ScrollableAnnotationView from './ScrollableAnnotationView';
import ScrollableAnnotationItem from './ScrollableAnnotationItem';
import RestingView from './RestingView';

const annotationLifetime = 16;

class ScrollableAnnotationContainer extends Component {

    state = {
        inRangeAnnotations: []
    };

    defaultProps = {
        currentTime: 0
    };

    componentWillReceiveProps(nextProps) {
        // Detect if we are skipping, and if so, don't show annotations from more than 10 seconds ago
        let pastRange = nextProps.currentTime - this.props.currentTime > 30 ? 10 : annotationLifetime;
        let inRangeAnnotations = [];
        let tStart = nextProps.currentTime - pastRange;
        let tEnd = nextProps.currentTime;
        nextProps.episode.annotations.edges.forEach(edge => {
            let ann = edge.node;
            //console.info(`${tStart} < --- ${ann.time} --- < ${tEnd}`);
            if (ann.time <= tEnd && ann.time >= tStart) inRangeAnnotations.push(edge);
        });

        //console.info(inRangeAnnotations);
        this.setState({inRangeAnnotations});
    }

    renderRestingView() {
        return (
            <View style={styles.restingWrapper}>
                <RestingView visible={this.state.inRangeAnnotations.length === 0} />
            </View>
        )
    }

    render() {
        /**
         * ScrollableAnnotationView prefers annotations in newest-to-oldest order
         */
        return (
            <View style={styles.wrapper}>
                {false && this.renderRestingView()}
                <ScrollableAnnotationView
                    annotations={this.state.inRangeAnnotations.slice().reverse()}
                />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        position: 'relative'
    },
    restingWrapper: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
});

let con = connect(createSelector(currentTime$, currentTime => ({currentTime})))(ScrollableAnnotationContainer);
//let con = connect()(ScrollableAnnotationContainer);

export default Relay.createContainer(con, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                annotations(first:1000) {
                    edges {
                        node {
                            id
                            time
                            ${ScrollableAnnotationItem.getFragment('annotation')}
                        }
                    }
                }
            }
        `
    }
});