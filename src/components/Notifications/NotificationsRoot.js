import React, {
    Component,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import viewerRoute from '../../routes/ViewerRoute';
import Notifications from './Notifications';
import RelayError from '../common/RelayError';
import LoadingSpinner from '../common/LoadingSpinner';

export default class NotificationsRoot extends Component {

    render() {
        console.info('Notifications root is rendering!');
        let route = new viewerRoute();
        return (
            <Relay.RootContainer
                Component={Notifications}
                route={route}
                renderFailure={function(error, retry) {
                    console.info(error);
                    return (
                        <RelayError error={error} retry={retry} />
                    );
                }}
                renderLoading={() => <LoadingSpinner />}
            />
        )
    }
}