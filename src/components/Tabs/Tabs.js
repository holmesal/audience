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
import Icon from 'react-native-vector-icons/Ionicons';

import {focus, blur} from '../../redux/modules/search';
import store from '../../redux/create';

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
            <Viewer key="me" tabLabel={<Icon name="android-happy" size={size} />} />,
            <Search key="search" tabLabel={<Icon name="ios-search-strong" size={size} />} />
        ];
        return tabs
    }

    render() {
        let tabBar = <TabBar />;
        return (
            <ScrollableTabView
                renderTabBar={() => tabBar}
                tabBarPosition="bottom"
                tabBarUnderlineColor="#FFA726"
                tabBarActiveTextColor="#FFA726"
                tabBarInactiveTextColor="#fefefe"
                initialPage={0}
                onChangeTab={({i}) => {
                    if (i === 3) {
                        store.dispatch(focus())
                    } else {
                        store.dispatch(blur())
                    }
                }}
            >
                {this.renderTabs()}
            </ScrollableTabView>
        )
    }
}