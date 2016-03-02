import React, {
    Component,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import viewerRoute from '../../routes/ViewerRoute';
import Discover from './Discover';
import RelayError from '../common/RelayError';
import LoadingSpinner from '../common/LoadingSpinner';

export default class DiscoverRoot extends Component {

    render() {
        let route = new viewerRoute();
        return (
            <Relay.RootContainer
                Component={Discover}
                route={route}
                renderFailure={function(error, retry) {
                    console.info(error)
                    return (
                        <RelayError error={error} retry={retry} />
                    );
                }}
                renderLoading={() => <LoadingSpinner />}
            />
        )
    }
}