import React, {
    Component
} from 'react-native';
import Relay from 'react-relay';

import viewerRoute from '../../routes/ViewerRoute';
import Viewer from './Viewer';
import RelayError from '../common/RelayError';
import LoadingSpinner from '../common/LoadingSpinner';

export default class ViewerRoot extends Component {

    render() {
        let route = new viewerRoute();
        return (
            <Relay.RootContainer
                Component={Viewer}
                route={route}
                renderFailure={(error, retry) => <RelayError error={error} retry={retry} />}
                renderLoading={() => <LoadingSpinner />}
            />
        )
    }
}