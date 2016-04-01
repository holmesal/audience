import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {currentTime$} from '../../redux/modules/player';

/**
 * 1) go through the current list of annotations, removing anything older than annotationLifetime ago
 * 2) walk forwards through the list of annotations until you hit one that with a time newer than current time
 */

export default class RollingWindow extends Component {

    static propTypes = {
        annotationLifetime: PropTypes.number,
        onWindowChange: PropTypes.func
    };

    static defaultProps = {
        annotationLifetime: 30,
        onWindowChange: () => {}
    };

    componentDidUpdate(prevProps, prevState) {

        // Detect if we are skipping, and if so, don't show annotations from more than 10 seconds ago
        let pastRange = this.props.currentTime - prevProps.currentTime > 30 ? 10 : this.props.annotationLifetime;
        let inRangeAnnotations = [];
        let tStart = this.props.currentTime - pastRange;
        let tEnd = this.props.currentTime;
        this.props.episode.annotations.edges.forEach(edge => {
            let ann = edge.node;
            if (ann.time <= tEnd && ann.time >= tStart) inRangeAnnotations.push(ann);
        });

        console.info(inRangeAnnotations);
        this.props.onWindowChange(inRangeAnnotations);
    }

    render() {
        return <View />
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});

let connectedWindow = connect(createSelector(currentTime$, currentTime => ({currentTime})))(RollingWindow);

export default Relay.createContainer(connectedWindow, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                annotations(first:1000) {
                    edges {
                        node {
                            id
                            time
                        }
                    }
                }
            }
        `
    }
});