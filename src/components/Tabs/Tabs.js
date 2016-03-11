import React, {
    ActivityIndicatorIOS,
    AppRegistry,
    Component,
    StyleSheet,
    StatusBar,
    Text,
    View
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';

import {connect} from 'react-redux';
import {focus, blur} from '../../redux/modules/search';
import {updateCurrentTab, tabs$} from '../../redux/modules/tabs';
import store from '../../redux/create';

import Discover from './../Discover/DiscoverRoot';
import Search from './../Search/Search';
import Viewer from './../Viewer/ViewerRoot';
import Shows from '../Shows/ShowsRoot';
import TabBar from './TabBar';

const ICON_SIZE = 22;

class Tabs extends Component {

    tabs = [
        {id: 'discover', component: <Discover key="discover" tabLabel={<Icon name="ios-pulse-strong" size={ICON_SIZE} />} />},
        {id: 'shows', component: <Shows key="shows" tabLabel={<Icon name="social-rss" size={ICON_SIZE} />} />},
        {id: 'me', component: <Viewer key="me" tabLabel={<Icon name="android-happy" size={ICON_SIZE} />} />},
        {id: 'search', component: <Search key="search" tabLabel={<Icon name="ios-search-strong" size={ICON_SIZE} />} />}
    ];

    state = {
        tabTarget: null
    };

    render() {
        let tabComponents = this.tabs.map(tab => tab.component);
        let tabBar = <TabBar />;

        let {currentTab} = this.state;
        let currentTabIndex = _.findIndex(this.tabs, {id: currentTab});
        return (
            <ScrollableTabView
                ref="tabs"
                renderTabBar={() => tabBar}
                tabBarPosition="bottom"
                tabBarUnderlineColor="#FFA726"
                tabBarActiveTextColor="#FFA726"
                tabBarInactiveTextColor="#fefefe"
                onChangeTab={({i}) => {
                    let tabId = this.tabs[i].id;
                    if (tabId === 'search') {
                        store.dispatch(focus())
                    } else {
                        store.dispatch(blur())
                    }
                    this.setState({tabTarget: tabId});
                    this.props.dispatch(updateCurrentTab(tabId));
                }}
                initialPage={0}
            >
                {tabComponents}
            </ScrollableTabView>
        )
    }

    componentDidUpdate(prevProps, prevState) {
        //console.info(`[props] ${prevProps.currentTab}  --->  [props] ${this.props.currentTab}   (target ${this.state.tabTarget})`);
        if (this.props.currentTab != prevProps.currentTab && this.props.currentTab != this.state.tabTarget) {
            //console.info('should force transition!');
            let targetIdx = _.findIndex(this.tabs, {id: this.props.currentTab});
            this.refs.tabs.goToPage(targetIdx);
        }
    }

}

export default connect(tabs$)(Tabs);