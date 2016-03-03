import React, {
    ActivityIndicatorIOS,
    AppRegistry,
    Component,
    StyleSheet,
    StatusBarIOS,
    Text,
    View
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import {episodeId$, showPlayer} from '../../redux/modules/player';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import Discover from './../Discover/DiscoverRoot';
import Search from './../Search/Search';
import Viewer from './../Viewer/ViewerRoot';
import Shows from '../Shows/ShowsRoot';
import TabBar from './TabBar';

export default class Tabs extends Component {

    renderTabs() {
        let tabs = [
            <Discover key="discover" tabLabel="Discover" />,
            <Search key="search" tabLabel="Search" />,
            <Viewer key="me" tabLabel="Me" />,
            <Shows key="shows" tabLabel="Shows" />
        ];
        if (this.props.playingEpisodeId) {
            tabs.push(<View key="playing" tabLabel="Playing" invisible />);
        }
        return tabs
    }

    render() {
        let tabBar = <TabBar
            playerTabVisible={this.props.playingEpisodeId ? true : false}
            onPlayerPress={() => this.props.dispatch(showPlayer())}
        />;
        return (
            <ScrollableTabView
                renderTabBar={() => tabBar}
                tabBarPosition="bottom"
                tabBarUnderlineColor="#FFA726"
                tabBarActiveTextColor="#FFA726"
                tabBarInactiveTextColor="#fefefe"
                initialPage={3}
            >
                {this.renderTabs()}
            </ScrollableTabView>
        )
    }
}

let sel$ = createSelector(episodeId$, (episodeId) => ({playingEpisodeId: episodeId}));

export default connect(sel$)(Tabs);