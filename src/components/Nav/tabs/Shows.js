import React, {
    Component,
    Image,
    NavigationExperimental,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

import DebugView from '../../common/DebugView';
import ShowsRoot from '../../Shows/ShowsRoot';
import PodcastInfoRoot from '../../PodcastInfo/PodcastInfoRoot';

const {
    AnimatedView,
    CardStack,
    Reducer,
    StateUtils
} = NavigationExperimental;

import StackReducer from '../StackReducer'

export const ShowsTabKey = 'ShowsTab';

const SHOW_SHOW_INFO = 'showsTab/showShowInfo';
export const showShowInfo = showId => ({
    type: SHOW_SHOW_INFO,
    showId
});

export const ShowsTabReducer = StackReducer({
    customBackActions: ['NestedBack'],
    getPushedReducerForAction: (action, lastState) => {
        console.info('[ShowsTab] handling action: ', action, lastState);
        switch (action.type) {
            case SHOW_SHOW_INFO:
                return lastState => lastState || {key: `ShowInfo-${action.showId}`, type: 'ShowInfo', showId: action.showId };
        }
        return null;
    },
    getReducerForState: (initialState) => {
        console.info('[ShowsTab] getting reducer for state: ', initialState);
        return (state) => state || initialState;
    },
    initialState: {
        key: ShowsTabKey,
        tabLabel: 'Shows',
        tabIcon: 'android-star',
        index: 0,
        children: [
            {key: 'Shows', type: 'Shows'}
        ]
    }
});

export default class Shows extends Component {

    renderScene(props) {
        const {key, type} = props.scene.navigationState;
        console.info('[ShowsTab] rendering scene with props: ', props);
        switch (type) {
            case 'Shows':
                return <ShowsRoot key={key} />;
            case 'ShowInfo':
                return <PodcastInfoRoot key={key} podcastId={props.scene.navigationState.showId} />;
        }
    }

    render() {
        console.info('[ShowsTab] rendering!', this.props);
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