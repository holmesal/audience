import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Relay from 'react-relay';

import { BlurView, VibrancyView } from 'react-native-blur';
import SearchBar from './SearchBar';
import Results from './Results';

import Logout from '../Logout';

class Search extends Component {

    blurInput() {
        this.refs.searchBar.refs.wrappedInstance.blur()
    }

    focusInput() {
        this.refs.searchBar.refs.wrappedInstance.focus();
    }

    render() {
        console.info(this.props.search)
        return (
            <View style={styles.wrapper}>
                <Results
                    search={this.props.search}
                    onSelect={this.blurInput.bind(this)}
                />
                <TouchableWithoutFeedback onPress={this.focusInput.bind(this)}>
                    <View style={styles.topBar}>
                        <VibrancyView blurType="dark" style={styles.cover} />
                        <View style={[styles.cover, styles.darkOverlay]} />
                        <SearchBar ref="searchBar" />
                    </View>
                </TouchableWithoutFeedback>
                <Logout />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    topBar: {
        height: 64,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(124,124,124,0.07)',
        paddingTop: 20,
        paddingRight: 16,
        paddingLeft: 16,
        justifyContent: 'center'
    },
    cover: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    darkOverlay: {
        backgroundColor: 'rgba(0,0,0,0.63)'
    }
});

export default Relay.createContainer(Search, {
    fragments: {
        search: () => Relay.QL`
            fragment on Search {
                count
                ${Results.getFragment('search')}
            }
        `
    }
})