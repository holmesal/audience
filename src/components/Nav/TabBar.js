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

import TabBarItem from './TabBarItem';
import colors from '../../colors';

class TabBar extends Component {

    renderTabs() {
        const {navigationState} = this.props;
        console.info('[TabBar] rendering tab bar with navigationState: ', navigationState)
        return navigationState.children.map((tab, idx) => <TabBarItem key={tab.key}
                                                                      icon={tab.tabIcon}
                                                                      label={tab.tabLabel}
                                                                      active={idx === navigationState.index} onPress={() => this.props.onNavigate(JumpToAction(idx))}/>)
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