/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  StatusBarIOS,
  Text,
  View
} from 'react-native';

import Scrubber from './src/components/Scrubber';
import Search from './src/components/Search/Search';

class HorizontalScrollTest extends Component {

  componentDidMount() {
    StatusBarIOS.setStyle('light-content');
  }

  render() {
    return (
      <Search />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('HorizontalScrollTest', () => HorizontalScrollTest);
