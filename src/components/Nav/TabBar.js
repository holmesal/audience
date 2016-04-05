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
    Container: NavigationContainer,
    View: NavigationView,
    Reducer
} = NavigationExperimental;
const {
    JumpToAction
} = Reducer.TabsReducer;

import store from '../../redux/create';
import {focus} from '../../redux/modules/search';
import TabBarItem from './TabBarItem';
import colors from '../../colors';
import {SearchTabKey} from './tabs/Search';

class TabBar extends Component {

    handlePress(idx) {
        this.props.onNavigate(JumpToAction(idx));
        let child = this.props.navigationState.children[idx]
        if (child.key === SearchTabKey && child.index === 0) {
            store.dispatch(focus());
        }
    }

    renderTabs() {
        const {navigationState} = this.props;
        //console.info('[TabBar] rendering tab bar with navigationState: ', navigationState)
        return navigationState.children.map((tab, idx) => <TabBarItem key={tab.key}
                                                                      icon={tab.tabIcon}
                                                                      label={tab.tabLabel}
                                                                      active={idx === navigationState.index}
                                                                      onPress={() => this.handlePress(idx)}/>)
    }

    render() {
        return (
            <View style={styles.wrapper}>
                {this.renderTabs()}
            </View>
        )
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        height: 84,
        backgroundColor: colors.lighterGrey
    }
});

export default NavigationContainer.create(TabBar);