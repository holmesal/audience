import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import _ from 'lodash';
import {connect} from 'react-redux/native';
import {createSelector} from 'reselect';
import {currentTime$} from '../../redux/modules/player';
import {prettyFormatTime} from '../../utils'

const DEBUG = true;

class PlaceKeeper extends Component {

    static defaultProps = {
        currentTime: 0,
        onChangeLastSeenIdx: () => {}
    };

    state = {
        lastSeenIdx: null
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.edges != this.props.edges) this.slowlyUpdateCurrentIndex();
    }

    componentDidUpdate(prevProps, prevState) {
        // Bail if there is no lastSeenIdx
        if (this.state.lastSeenIdx === null) { // could be null or a number
            //console.info('no lastSeenIdx - requesting slow check', this.state.lastSeenIdx);
            this.slowlyUpdateCurrentIndex();
            return false
        }
        // Bail if we're at the end
        const nextIdx = this.state.lastSeenIdx + 1;
        if (nextIdx >= this.props.edges.length) {
            //console.info('this was the last idx - bailing');
            return false;
        }
        // What's the next time?
        //console.info(this.props.edges[nextIdx].node.time);
        const lastTime = this.props.edges[this.state.lastSeenIdx].node.time;
        const nextTime = this.props.edges[nextIdx].node.time;
        if (!nextTime) {
            console.warn('expected there to be a next time but there wasn\'t :-( for idx: ', nextIdx);
        }
        //console.info(`[${this.state.lastSeenIdx} - ${prettyFormatTime(lastTime)}] ------ (${prettyFormatTime(this.props.currentTime)}) ----- [${nextIdx} - ${prettyFormatTime(nextTime)}]`);

        // If the current time is beyond the next time, then advance the current idx
        if (this.props.currentTime > nextTime) {
            // Advance
            let targetIdx = nextIdx + 1;
            let targetEdge = this.props.edges[targetIdx];
            if (targetEdge) {
                let targetTime = targetEdge.node.time;
                // If this target node's time is after the current time, this worked
                if (targetTime > this.props.currentTime) {
                    //console.info('successfully advanced to the next node');
                    this.setLastSeenIdx(targetIdx - 1)
                } else {
                    //console.info('something went wrong, we are lost, doing the slow search');
                    // Something went wrong - there were a bunch of comments close together, or the user skipped ahead
                    this.slowlyUpdateCurrentIndex();
                }
            } else {
                //console.info('doing nothing - we\'re at the end.')
            }
        } else if (this.props.currentTime < lastTime) {
            // we probably skipped backwards
            //console.info('we probably moved backwards and are lost');
            this.slowlyUpdateCurrentIndex();
        }
    }

    setLastSeenIdx(lastSeenIdx) {
        // if this is different than what we have stored, notify the outer component of the change
        if (lastSeenIdx != this.state.lastSeenIdx) {
            // Notify parent
            this.props.onChangeLastSeenIdx(lastSeenIdx);
            // Store
            this.setState({lastSeenIdx});
        }
    }

    slowlyUpdateCurrentIndex() {
        //console.info(this.props);
        let {edges} = this.props;
        //console.info(edges);
        // Assuming these edges are ordered by ascending time, walk until you find an edge that the currentTime is less then
        let lastSeenIdx = null;
        // This is inefficient, avoid where possible
        console.info('inefficiently searching through available episodes');
        let firstLargerIdx = _.findIndex(edges, edge => edge.node.time > this.props.currentTime);
        //console.info('firstLarger: ', firstLargerIdx);
        // unless the first item is larger
        if (firstLargerIdx > 0) {
            // we last saw the previous item
            lastSeenIdx = firstLargerIdx - 1;
        }

        this.setLastSeenIdx(lastSeenIdx)
    }

    render() {
        return (
            <View />
        );
    }
}

export default connect(createSelector(currentTime$, currentTime => ({currentTime})))(PlaceKeeper);