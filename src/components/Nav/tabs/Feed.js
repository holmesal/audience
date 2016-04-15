import React, {
    Component,
    Image,
    NavigationExperimental,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DebugView from '../../common/DebugView';
import FeedRoot from '../../Feed/FeedRoot';
import PodcastInfoRoot from '../../PodcastInfo/PodcastInfoRoot';
import AnnotationRoot from '../../Annotation/AnnotationRoot';

const {
    //Reducer,
    CardStack
} = NavigationExperimental;

import StackReducer from '../StackReducer'

export const FeedTabKey = 'FeedTab';

const SHOW_SHOW_INFO = 'feedTab.showShowInfo';
export const showShowInfo = showId => ({
    type: SHOW_SHOW_INFO,
    showId
});

//const SHOW_ANNOTATION = 'feedTab.showAnnotation';
//export const showAnnotation = annotationId => ({
//    type: SHOW_ANNOTATION,
//    annotationId
//});

export const FeedTabReducer = StackReducer({
    customBackActions: ['NestedBack'],
    getPushedReducerForAction: (action, lastState) => {
        console.info('[FeedTab] handling action: ', action, lastState);
        switch (action.type) {
            case SHOW_SHOW_INFO:
                return lastState => lastState || {key: `ShowInfo-${action.showId}`, type: 'ShowInfo', showId: action.showId };
            //case SHOW_ANNOTATION:
            //    return lastState => lastState || {key: `Annotation-${action.annotationId}`, type: 'Annotation', annotationId: action.annotationId };
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

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    renderScene(props) {
        const {key, type} = props.scene.navigationState;
        console.info('[FeedTab] rendering scene with props: ', props);
        switch (type) {
            case 'Feed':
                return <FeedRoot key={key} />;
            case 'ShowInfo':
                return <PodcastInfoRoot key={key} podcastId={props.scene.navigationState.showId} />;
            //case 'Annotation':
            //    return <AnnotationRoot key={key} annotationId={props.scene.navigationState.annotationId} />;
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