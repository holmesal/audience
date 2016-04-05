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
    View: NavigationView
} = NavigationExperimental;


import TabBar from './TabBar';
import FeedTab, {FeedTabReducer, FeedTabKey} from './tabs/Feed';
import ShowsTab, {ShowsTabReducer, ShowsTabKey} from './tabs/Shows';
import SearchTab, {SearchTabReducer, SearchTabKey} from './tabs/Search';


//export const TabsReducer = (state, action) => {
//    console.info('[FakeTabsReducer] : ', state, action);
//}

export const TabsReducerKey = 'TabState';

export const TabsReducer = Reducer.TabsReducer({
    key: TabsReducerKey,
    initialIndex: 0,
    tabReducers: [
        FeedTabReducer,
        ShowsTabReducer,
        SearchTabReducer
    ]
});

export default class Tabs extends Component {

    renderScene(navigationState) {
        console.info('[Tabs] rendering scene with navigationState: ', navigationState);
        switch (navigationState.key) {
            case FeedTabKey:
                return <FeedTab key={FeedTabKey} navigationState={navigationState}/>;
            case ShowsTabKey:
                return <ShowsTab key={ShowsTabKey} navigationState={navigationState}/>;
            case SearchTabKey:
                return <SearchTab hi="there" key={SearchTabKey} navigationState={navigationState}/>;
            default:
                console.warn('[Tabs] could not render scene for key: ', navigationState.key);
                return <View />
        }
    }

    render() {
        console.info('[Tabs] rendering!', this.props);
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