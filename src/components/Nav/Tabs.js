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
    AnimatedView: NavigationAnimatedView
} = NavigationExperimental;


import TabBar from './TabBar';
import FeedTab, {FeedTabReducer, FeedTabKey} from './tabs/Feed';
import NotificationsTab, {NotificationsTabReducer, NotificationsTabKey} from './tabs/Notifications';
import ShowsTab, {ShowsTabReducer, ShowsTabKey} from './tabs/Shows';
import SearchTab, {SearchTabReducer, SearchTabKey} from './tabs/Search';
import ViewerTab, {ViewerTabReducer, ViewerTabKey} from './tabs/Viewer';
import AnimatedTab from './AnimatedTab';


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

    componentWillMount() {
        this._scenes = {
            feed: <FeedTab key={FeedTabKey}/>,
            notifications: <NotificationsTab key={NotificationsTabKey}/>
        }
    }

    renderScene(navigationState) {
        console.info(`[Tabs] rendering scene: `, navigationState, navigationState.position, navigationState.position._value);
        const animatedTabIndex = navigationState.position;
        const navState = navigationState.scene.navigationState;
        //console.info('[Tabs] rendering scene with navigationState: ', navigationState);

        return (
            <View style={styles.wrapper}>
                <FeedTab key={FeedTabKey} navigationState={navState} />
                <NotificationsTab key={NotificationsTabKey} navigationState={navState} />
            </View>
        );
        switch (navState.key) {
            case FeedTabKey:
                return React.cloneElement(this._scenes.feed, {navigationState: navState});
            case NotificationsTabKey:
                return React.cloneElement(this._scenes.notifications, {navigationState: navState});
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
        console.info('[Tabs] rendering!', this.props);
                //<NavigationView navigationState={this.props.navigationState}
                //                renderScene={this.renderScene.bind(this)}
                //                style={styles.content}/>
        const childStates = this.props.navigationState.children;
        const currentTab = this.props.navigationState.index;
        return (
            <View style={styles.wrapper}>
                <View style={styles.tabs}>
                    <AnimatedTab index={0} current={currentTab}><FeedTab key={FeedTabKey} navigationState={childStates[0]} /></AnimatedTab>
                    <AnimatedTab index={1} current={currentTab}><NotificationsTab key={NotificationsTabKey} navigationState={childStates[1]} /></AnimatedTab>
                    <AnimatedTab index={2} current={currentTab}><ShowsTab key={ShowsTabKey} navigationState={childStates[2]} /></AnimatedTab>
                    <AnimatedTab index={3} current={currentTab}><ViewerTab key={ViewerTabKey} navigationState={childStates[3]} /></AnimatedTab>
                    <AnimatedTab index={4} current={currentTab}><SearchTab key={SearchTabKey} navigationState={childStates[4]} /></AnimatedTab>
                </View>
                <TabBar navigationState={this.props.navigationState} />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    tabs: {
        position: 'relative',
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