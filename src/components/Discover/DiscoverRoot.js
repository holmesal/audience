import React, {
    Component,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

import viewerRoute from '../../routes/ViewerRoute';
import Discover from './Discover';

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
                    <View>
                        <Text>{error.message}</Text>
                    </View>
                    );
                }}
            />
        )
    }
}