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

import Icon from 'react-native-vector-icons/Ionicons';

import Discover from './../Discover/DiscoverRoot';
import Search from './../Search/Search';
import Viewer from './../Viewer/ViewerRoot';
import Shows from '../Shows/ShowsRoot';
import TabBar from './TabBar';

export default class Tabs extends Component {

    renderTabs() {
        let size = 22;
        let tabs = [
            <Discover key="discover" tabLabel={<Icon name="ios-pulse-strong" size={size} />} />,
            <Shows key="shows" tabLabel={<Icon name="social-rss" size={size} />} />,
            <Search key="search" tabLabel={<Icon name="ios-search-strong" size={size} />} />,
            <Viewer key="me" tabLabel={<Icon name="android-happy" size={size} />} />
        ];
        //if (this.props.playingEpisodeId) {
        //    tabs.push(<View key="playing" tabLabel="Playing" invisible />);
        //}
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
                initialPage={0}
            >
                {this.renderTabs()}
            </ScrollableTabView>
        )
    }
}

let sel$ = createSelector(episodeId$, (episodeId) => ({playingEpisodeId: episodeId}));

export default connect(sel$)(Tabs);