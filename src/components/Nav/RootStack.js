import React, {
    Component,
    Image,
    NavigationExperimental,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

import DebugView from '../common/DebugView';
import AnnotationRoot from '../Annotation/AnnotationRoot';
import PlayerRoot from '../Player/PlayerRoot';
import colors from '../../colors';
import {handleLink} from '../../lib/linking';
import store from '../../redux/create';
import {playEpisode, hidePlayer} from '../../redux/modules/player';
import RemoteNotifications from '../../lib/remoteNotifications';

import Tabs, {TabsReducer, TabsReducerKey} from './Tabs';

const {
    Reducer,
    RootContainer,
    AnimatedView,
    Card
} = NavigationExperimental;

const SHOW_TABS = 'rootStack.showTabs';
export const showTabs = () => ({
    type: SHOW_TABS
});

//const SHOW_PLAYER = 'rootStack.showPlayer';
//export const showPlayer = episodeId => ({
//    type: SHOW_PLAYER,
//    episodeId
//});

const SHOW_ANNOTATION = 'rootStack.showAnnotation';
export const showAnnotation = (annotationId, focusInput=false) => ({
    type: SHOW_ANNOTATION,
    annotationId,
    focusInput
});

export const reducer = Reducer.StackReducer({
    getPushedReducerForAction: (action, lastState) => {
        //console.info('[RootStack] getting pushed reducer for action: ', action);
        switch (action.type) {
            //case SHOW_TABS:
            //    return TabsReducer;
            //case SHOW_PLAYER:
            //    return state => state || {key: 'Player'}; // TODO - PlayerReducer
            case SHOW_ANNOTATION:
                return state => state || {key: `Annotation-${action.annotationId}`, type: 'Annotation', annotationId: action.annotationId, focusInput: action.focusInput};
            //default:
            //    console.warn('[RootStack] Could not find pushed reducer for action: ', action);
            //    return state => state;
        }
        return null;
    },
    getReducerForState: (initialState) => {
        //console.info('get reducer for initialState', initialState)
        if (initialState.key === TabsReducerKey) initialState.type = 'Tabs';
        switch (initialState.type) {
            case 'Tabs':
                return TabsReducer;
            //case 'Player':
            //    return state => state || initialState;
            case 'Annotation':
                return state => state || initialState;
            default:
                console.info('could not find reducer for state: ', initialState);
                return state => state || initialState;
        }
    },
    initialState: {
        key: 'root',
        index: 0,
        children: [
            _.assign(TabsReducer(), {type: 'Tabs'})
        ]
    }
});

export default class RootStack extends Component {

    componentDidMount() {
        // Start listening for push notification opens
        this._notificationSubscription = RemoteNotifications.addListener('notificationOpened', this.handleNotificationOpen.bind(this));
        //setTimeout(() => {
        //    this.refs.rootContainer.handleNavigation(showPlayer('fake-episode-id'));
        //}, 3000);
        //setTimeout(() => {
        //    this.refs.rootContainer.handleNavigation(showAnnotation('QW5ub3RhdGlvbjoxMzg='));
        //}, 100);
    }

    componentWillUnmount() {
        this._notificationSubscription.remove();
    }

    /**
     * Given a navigation intent {type, ...}, dispatch the appropriate action to the navigation
     */
    mapIntentToAction(intent) {
        console.info('handling navigation intent', intent);
        switch (intent.type) {
            case 'episode':
                store.dispatch(playEpisode(intent.episodeId, intent.time));
                break;
            case 'show':
                store.dispatch(hidePlayer());
                console.info('TODO - SHOW SHOW INFO FROM DEEPLINK');
            case 'annotation':
                store.dispatch(hidePlayer());
                return showAnnotation(intent.annotationId);
            case 'clip':
                store.dispatch(hidePlayer());
                console.info('TODO - HANDLE CLIPS');
                break;
            default:
                console.warn('could not handle intent: ', intent)
        }
    }

    handleLink(uri) {
        if (!uri) return;
        const intent = handleLink(uri);
        console.info('got linking action: ', uri, 'which parsed to', intent);
        return this.mapIntentToAction(intent)
    }

    handleNotificationOpen(notificationData) {
        const action = this.mapIntentToAction(notificationData);
        if (action) this.refs.rootContainer.handleNavigation(action);
    }

    renderScene(props) {
        console.info('[RootStack] rendering scene with props: ', props);
        const state = props.scene.navigationState;
        // Shim type for tabs that don't support it
        if (state.key === TabsReducerKey) state.type = 'Tabs';
        switch (state.type) {
            case 'Tabs':
                return <Tabs key="tabs" navigationState={props.scene.navigationState}/>
            //case 'Player':
            //    return (
            //        <Card
            //            {...props}
            //            key="player"
            //            renderScene={() => <PlayerRoot />}
            //         />
            //    );
            case 'Annotation':
                const {annotationId, focusInput} = props.scene.navigationState;
                return (
                    <Card
                        {...props}
                        key="annotation"
                        renderScene={() => <AnnotationRoot annotationId={annotationId} focusInput={focusInput} />}
                    />
                );
            default:
                console.warn('[RootStack] could not render scene for key: ', props.scene.navigationState.key);
        }
    }


    renderNavigation(navigationState, onNavigate) {
        //console.info('[RootStack] rendering navigation state: ', navigationState);
        return <AnimatedView navigationState={navigationState}
                             renderScene={this.renderScene.bind(this)}
                             style={styles.wrapper}
        />
    }

    render() {
        return (
            <RootContainer style={styles.wrapper}
                           reducer={reducer}
                           LinkingActionMap={this.handleLink.bind(this)}
                           ref="rootContainer"
                           renderNavigation={this.renderNavigation.bind(this)}
            />
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: colors.darkGrey
    }
});