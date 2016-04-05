import React, {
    Component,
    Image,
    NavigationExperimental,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

import FeedTab, {FeedTabReducer, FeedTabKey} from './tabs/Feed';

const {
    Reducer,
    View: NavigationView
} = NavigationExperimental;

//export const TabsReducer = (state, action) => {
//    console.info('[FakeTabsReducer] : ', state, action);
//}

export const TabsReducerKey = 'TabState';

export const TabsReducer = Reducer.TabsReducer({
    key: TabsReducerKey,
    initialIndex: 0,
    tabReducers: [
        FeedTabReducer
    ]
})

export default class Tabs extends Component {

    renderScene(navigationState) {
        console.info('[Tabs] rendering scene with navigationState: ', navigationState);
        switch (navigationState.key) {
            case FeedTabKey:
                return <FeedTab key={FeedTabKey} navigationState={navigationState}/>
            default:
                console.warn('[Tabs] could not render scene for key: ', navigationState.key);
        }
    }

    render() {
        console.info('[Tabs] rendering!', this.props);
        return (
            <NavigationView navigationState={this.props.navigationState}
                            renderScene={this.renderScene.bind(this)}/>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});