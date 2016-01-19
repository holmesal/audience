import React, {
    Component,
    Image,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';

import { BlurView, VibrancyView } from 'react-native-blur';
import SearchBar from './SearchBar';
import Results from './Results';

import Logout from '../Logout';

export default class Search extends Component {

    render() {
        return (
            <View style={style.wrapper}>
                <Results showPlayer={this.props.showPlayer}/>
                <TouchableWithoutFeedback onPress={() => this.refs.searchBar.focus()}>
                    <View style={style.topBar}>
                        <VibrancyView blurType="dark" style={style.cover} />
                        <View style={[style.cover, style.darkOverlay]} />
                        <SearchBar ref="searchBar" />
                    </View>
                </TouchableWithoutFeedback>
                <Logout />
            </View>
        );
    }
}

let style = {
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
};