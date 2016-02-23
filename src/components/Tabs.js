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

import Discover from './Discover/DiscoverRoot';
import Search from './Search/SearchRoot';
import Viewer from './Viewer/ViewerRoot';

export default class Tabs extends Component {

    render() {
        return (
            <ScrollableTabView
                tabBarPosition="bottom"
                tabBarUnderlineColor="#FFA726"
                tabBarActiveTextColor="#FFA726"
                tabBarInactiveTextColor="#fefefe"
                initialPage={2}
            >
                <Discover tabLabel="Discover" />
                <Viewer tabLabel="Me" />
                <Search tabLabel="Search" />
            </ScrollableTabView>
        )
    }
}