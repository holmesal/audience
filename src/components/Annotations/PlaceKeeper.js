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

class PlaceKeeper extends Component {

    static defaultProps = {
        currentTime: 0,
        onChangeLastSeenIdx: () => {}
    };

    state = {
        lastSeenIdx: null
    };

    componentWillReceiveProps(nextProps) {
        console.info(nextProps);
        let {edges} = nextProps;
        //console.info(edges);
        // Assuming these edges are ordered by ascending time, walk until you find an edge that the currentTime is less then
        let lastSeenIdx = null;
        let firstLargerIdx = _.findIndex(edges, edge => edge.node.time > this.props.currentTime);
        console.info('firstLarger: ', firstLargerIdx);
        // unless the first item is larger
        if (firstLargerIdx > 0) {
            // we last saw the previous item
            lastSeenIdx = firstLargerIdx - 1;
        }

        // if this is different than what we have stored, notify the outer component of the change
        if (lastSeenIdx != this.state.lastSeenIdx) {
            // Notify parent
            this.props.onChangeLastSeenIdx(lastSeenIdx);
            // Store
            this.setState({lastSeenIdx});
        }
    }

    render() {
        return (
            <View />
        );
    }
}

export default connect(createSelector(currentTime$, currentTime => ({currentTime})))(PlaceKeeper);