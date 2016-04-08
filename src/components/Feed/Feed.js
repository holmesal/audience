import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import DebugView from '../common/DebugView';
import colors from '../../colors';
import Friends from './Friends';
import Global from './Global';
import ScrollableTabView from 'react-native-scrollable-tab-view';

class Feed extends Component {

    render() {
        return (
            <ScrollableTabView
                tabBarUnderlineColor={colors.attention}
                tabBarActiveTextColor={colors.white}
                tabBarInactiveTextColor={colors.grey}
            >
                <Friends viewer={this.props.viewer} tabLabel="Friends Only" />
                <Global viewer={this.props.viewer} tabLabel="Everyone" />
            </ScrollableTabView>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingTop: 40
    }
});

export default Relay.createContainer(Feed, {
    fragments: {
        viewer: () => Relay.QL`
            fragment on User {
                ${Friends.getFragment('viewer')}
                ${Global.getFragment('viewer')}
            }
        `
    }
})