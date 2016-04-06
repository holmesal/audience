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
import {playEpisode} from '../../redux/modules/player';

import Tabs, {TabsReducer, TabsReducerKey} from './Tabs';

const {
    Reducer,
    RootContainer,
    AnimatedView,
    Card
} = NavigationExperimental;

const SHOW_ANNOTATION = 'rootStack.showAnnotation';
export const showAnnotation = annotationId => ({
    type: SHOW_ANNOTATION,
    annotationId
});

export const reducer = Reducer.StackReducer({
    getPushedReducerForAction: (action, lastState) => {
        //console.info('[RootStack] getting pushed reducer for action: ', action);
        switch (action.type) {
            case SHOW_ANNOTATION:
                return state => state || {key: 'Annotation', annotationId: action.annotationId};
        }
        return null;
    },
    getReducerForState: (initialState) => {
        //console.info('get reducer for initialState', initialState)
        switch (initialState.key) {
            case 'Annotation':
                return state => state || initialState;
            default:
                console.info('could not find reducer for state: ', initialState);
                return state => state || initialState;
        }
    },
    initialState: {
        key: 'playerRootStack',
        index: 0,
        children: [
            {key: 'Player'}
        ]
    }
});

export default class RootStack extends Component {

    componentDidMount() {
        //setTimeout(() => {
        //    this.refs.rootContainer.handleNavigation(showAnnotation('QW5ub3RhdGlvbjoxMzM='));
        //}, 6000);
    }

    renderScene(props) {
        //console.info('[RootStack] rendering scene with props: ', props);
        switch (props.scene.navigationState.key) {
            case 'Player':
                return <PlayerRoot key="player" />;
            case 'Annotation':
                return (
                    <Card
                        {...props}
                        key="annotation"
                        renderScene={() => <AnnotationRoot annotationId={props.scene.navigationState.annotationId} />}
                    />
                );
            default:
                console.warn('[PlayerRootStack] could not render scene for key: ', props.scene.navigationState.key);
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