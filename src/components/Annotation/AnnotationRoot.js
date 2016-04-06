import React, {
    Component,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
//import {connect} from 'react-redux';
//import {createSelector} from 'reselect';
import AnnotationView from './AnnotationView';

import AnnotationRoute from '../../routes/AnnotationRoute';
import RelayError from '../common/RelayError';
import LoadingSpinner from '../common/LoadingSpinner';

import {episodeId$} from '../../redux/modules/player';

export default class AnnotationRoot extends Component {

    render() {
        //const annotationId = 'QW5ub3RhdGlvbjoxMzM=';
        const {annotationId} = this.props;
        //const {annotationId} = this.props;
        console.info('annotation root component sees annotation id: ', annotationId);

        if (!annotationId) {
            console.warn('Annotation view rendered without an annotation id!');
            return <View />;
        }
        let route = new AnnotationRoute({
            annotationId: annotationId
        });
        return (
            <Relay.RootContainer
                Component={AnnotationView}
                route={route}
                renderFailure={function(error, retry) {
                    console.info(error)
                    return (
                        <RelayError error={error} retry={retry} />
                    );
                }}
                renderLoading={() => <View />}
            />
        )
    }
}

//export const playerRoot$ = createSelector(episodeId$, (episodeId) => ({
//    episodeId
//}));

//export default connect(playerRoot$)(PlayerRoot);