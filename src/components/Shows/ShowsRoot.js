import React, {
    Component,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import viewerRoute from '../../routes/ViewerRoute';
import Shows from './Shows';
import RelayError from '../common/RelayError';
import LoadingSpinner from '../common/LoadingSpinner';

export default class ShowsRoot extends Component {

    render() {
        let route = new viewerRoute();
        return (
            <Relay.RootContainer
                Component={Shows}
                route={route}
                renderFailure={function(error, retry) {
                    return (
                        <RelayError error={error} retry={retry} />
                    );
                }}
                renderLoading={() => <LoadingSpinner />}
            />
        )
    }
}