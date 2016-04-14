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
import NotificationsRoot from '../../Notifications/NotificationsRoot';
import PodcastInfoRoot from '../../PodcastInfo/PodcastInfoRoot';
import AnnotationRoot from '../../Annotation/AnnotationRoot';

const {
    //Reducer,
    CardStack
    } = NavigationExperimental;

import StackReducer from '../StackReducer'

export const NotificationsTabKey = 'NotificationsTab';

const SHOW_SHOW_INFO = 'notificationsTab.showShowInfo';
export const showShowInfo = showId => ({
    type: SHOW_SHOW_INFO,
    showId
});

export const NotificationsTabReducer = StackReducer({
    customBackActions: ['NestedBack'],
    getPushedReducerForAction: (action, lastState) => {
        console.info('[NotificationsTab] handling action: ', action, lastState);
        switch (action.type) {
            case SHOW_SHOW_INFO:
                return lastState => lastState || {key: `ShowInfo-${action.showId}`, type: 'ShowInfo', showId: action.showId };
            //case SHOW_ANNOTATION:
            //    return lastState => lastState || {key: `Annotation-${action.annotationId}`, type: 'Annotation', annotationId: action.annotationId };
        }
        return null;
    },
    getReducerForState: (initialState) => {
        //console.info('[NotificationsTab] getting reducer for state: ', initialState);
        return (state) => state || initialState;
    },
    initialState: {
        key: NotificationsTabKey,
        tabLabel: 'Notifs',
        tabIcon: 'android-notifications',
        index: 0,
        children: [
            {key: 'Notifications', type: 'Notifications'}
        ]
    }
});

export default class Notifications extends Component {

    renderScene(props) {
        const {key, type} = props.scene.navigationState;
        console.info('[NotificationsTab] rendering scene with props: ', props);
        switch (type) {
            case 'Notifications':
                return <NotificationsRoot key={key} />;
            case 'ShowInfo':
                return <PodcastInfoRoot key={key} podcastId={props.scene.navigationState.showId} />;
            //case 'Annotation':
            //    return <AnnotationRoot key={key} annotationId={props.scene.navigationState.annotationId} />;
            default:
                console.warn('[NotificationsTab] could not render scene for key: ', key);
                return <View />;
        }
    }

    render() {
        //console.info('[NotificationsTab] rendering!', this.props);
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