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

    render() {
        /**
         * ScrollableAnnotationView prefers annotations in newest-to-oldest order
         */
        return (
            <View style={styles.wrapper}>
                <ScrollableAnnotationView
                    annotations={this.state.inRangeAnnotations.slice().reverse()}
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

let con = connect(createSelector(currentTime$, currentTime => ({currentTime})))(ScrollableAnnotationContainer);

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