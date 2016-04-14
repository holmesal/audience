import React, {
    Component,
    Image,
    NavigationExperimental,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

const {
    Reducer,
    View: NavigationView,
    AnimatedView: AnimatedNavigationView
} = NavigationExperimental;


import TabBar from './TabBar';
import FeedTab, {FeedTabReducer, FeedTabKey} from './tabs/Feed';
import NotificationsTab, {NotificationsTabReducer, NotificationsTabKey} from './tabs/Notifications';
import ShowsTab, {ShowsTabReducer, ShowsTabKey} from './tabs/Shows';
import SearchTab, {SearchTabReducer, SearchTabKey} from './tabs/Search';
import ViewerTab, {ViewerTabReducer, ViewerTabKey} from './tabs/Viewer';


//export const TabsReducer = (state, action) => {
//    console.info('[FakeTabsReducer] : ', state, action);
//}

export const TabsReducerKey = 'TabState';

export const TabsReducer = Reducer.TabsReducer({
    key: TabsReducerKey,
    initialIndex: 1,
    tabReducers: [
        FeedTabReducer,
        NotificationsTabReducer,
        ShowsTabReducer,
        ViewerTabReducer,
        SearchTabReducer
    ]
});

export default class Tabs extends Component {

    renderScene(navigationState) {
        const navState = navigationState.scene.navigationState;
        //console.info('[Tabs] rendering scene with navigationState: ', navigationState);
        switch (navState.key) {
            case FeedTabKey:
                return <FeedTab key={FeedTabKey} navigationState={navState}/>;
            case NotificationsTabKey:
                return <NotificationsTab key={NotificationsTabKey} navigationState={navState}/>;
            case ShowsTabKey:
                return <ShowsTab key={ShowsTabKey} navigationState={navState}/>;
            case SearchTabKey:
                return <SearchTab key={SearchTabKey} navigationState={navState}/>;
            case ViewerTabKey:
                return <ViewerTab key={ViewerTabKey} navigationState={navState}/>;
            default:
                console.warn('[Tabs] could not render scene for key: ', navState.key, navState, navigationState);
                return <View />
        }
    }

    render() {
        //console.info('[Tabs] rendering!', this.props);
        return (
            <View style={styles.wrapper}>
                <NavigationView navigationState={this.props.navigationState}
                                renderScene={this.renderScene.bind(this)}
                                style={styles.content}/>
                <TabBar navigationState={this.props.navigationState} />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    content: {
        flex: 1
    },
    tabbar: {
        alignSelf: 'stretch',
        height: 80
    }
});