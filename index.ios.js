import React, {
    AppRegistry,
    Component,
    StyleSheet,
    StatusBarIOS,
    Text,
    View
} from 'react-native';

// Main app view
import App from './src/app';

// Provider
import {Provider} from 'react-redux/native';
import store from './src/redux/create';

class HorizontalScrollTest extends Component {

    // Until react-native@0.14, <Provider> children need to be wrapped in a function
    // See https://github.com/rackt/redux/issues/867
    render() {
        return (
            <Provider store={store}>
                {() => <App />}
            </Provider>
        );
    }
}

AppRegistry.registerComponent('HorizontalScrollTest', () => HorizontalScrollTest);