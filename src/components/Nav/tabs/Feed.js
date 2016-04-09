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
import FeedRoot from '../../Feed/FeedRoot';
import PodcastInfoRoot from '../../PodcastInfo/PodcastInfoRoot';

const {
    //Reducer,
    CardStack
} = NavigationExperimental;

import StackReducer from '../StackReducer'

export const FeedTabKey = 'FeedTab';

const SHOW_SHOW_INFO = 'feedTab/showShowInfo';
export const showShowInfo = showId => ({
    type: SHOW_SHOW_INFO,
    showId
});

export const FeedTabReducer = StackReducer({
    customBackActions: ['NestedBack'],
    getPushedReducerForAction: (action, lastState) => {
        console.info('[FeedTab] handling action: ', action, lastState);
        switch (action.type) {
            case SHOW_SHOW_INFO:
                return lastState => lastState || {key: `ShowInfo-${action.showId}`, type: 'ShowInfo', showId: action.showId };
        }
        return null;
    },
    getReducerForState: (initialState) => {
        //console.info('[FeedTab] getting reducer for state: ', initialState);
        return (state) => state || initialState;
    },
    initialState: {
        key: FeedTabKey,
        tabLabel: 'Feed',
        tabIcon: 'ios-paper-outline',
        index: 0,
        children: [
            {key: 'Feed', type: 'Feed'}
        ]
    }
});

export default class Feed extends Component {

    renderScene(props) {
        const {key, type} = props.scene.navigationState;
        console.info('[FeedTab] rendering scene with props: ', props);
        switch (type) {
            case 'Feed':
                return <FeedRoot key={key} />;
            case 'ShowInfo':
                return <PodcastInfoRoot key={key} podcastId={props.scene.navigationState.showId} />;
            default:
                console.warn('[FeedTab] could not render scene for key: ', key);
                return <View />;
        }
    }

    render() {
        //console.info('[FeedTab] rendering!', this.props);
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