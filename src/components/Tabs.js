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

import Discover from './Discover/Discover';
import Search from './Search/Search';

export default class Tabs extends Component {

    render() {
        return (
            <ScrollableTabView tabBarPosition="bottom" tabBarUnderlineColor="#FFA726" tabBarActiveTextColor="#FFA726" tabBarInactiveTextColor="#fefefe">
                <Discover tabLabel="Discover" />
                <Search tabLabel="Search" />
            </ScrollableTabView>
        )
    }
}