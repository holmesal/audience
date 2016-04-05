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
    AnimatedView,
    CardStack,
    Reducer,
    StateUtils
} = NavigationExperimental;

import StackReducer from '../StackReducer'
import SearchRoot from '../../Search/Search';
import PodcastInfoRoot from '../../PodcastInfo/PodcastInfoRoot';

export const SearchTabKey = 'SearchTab';

const SHOW_SHOW_INFO = 'searchTab/showShowInfo';
export const showShowInfo = showId => ({
    type: SHOW_SHOW_INFO,
    showId
});

export const SearchTabReducer = StackReducer({
    customBackActions: ['NestedBack'],
    getPushedReducerForAction: (action, lastState) => {
        console.info('[SearchTab] handling action: ', action, lastState);
        switch (action.type) {
            case SHOW_SHOW_INFO:
                return lastState => lastState || {key: `ShowInfo-${action.showId}`, type: 'ShowInfo', showId: action.showId };
        }
        return null;
    },
    getReducerForState: (initialState) => {
        console.info('[SearchTab] getting reducer for state: ', initialState);
        return (state) => state || initialState;
    },
    initialState: {
        key: SearchTabKey,
        tabLabel: 'Search',
        tabIcon: 'ios-search',
        index: 0,
        children: [
            {key: 'Search', type: 'Search'}
        ]
    }
});

export default class Search extends Component {

    renderScene(props) {
        const {key, type} = props.scene.navigationState;
        console.info('[SearchTab] rendering scene with props: ', props);
        switch (type) {
            case 'Search':
                return <SearchRoot key={key} />;
            case 'ShowInfo':
                return <PodcastInfoRoot key={key} podcastId={props.scene.navigationState.showId} />;
            default:
                return <View />
        }
    }

    render() {
        console.info('[SearchTab] rendering!', this.props);
        return (
            <CardStack navigationState={this.props.navigationState}
                       renderScene={this.renderScene.bind(this)}
                       style={styles.wrapper}/>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});