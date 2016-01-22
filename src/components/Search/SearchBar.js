import React, {
    Component,
    Image,
    Text,
    TextInput,
    View
} from 'react-native';

import {connect} from 'react-redux/native';
import {updateQuery} from '../../redux/modules/search';

import colors from '../../colors';

class SearchBar extends Component {

    static propTypes = {};

    static defaultProps = {};

    focus() {
        this.refs.input.focus();
    }

    render() {
        return (
            <View style={style.wrapper}>
                <Image style={style.magnifying} source={require('image!magnifyingGlass')} />
                <TextInput
                    ref="input"
                    style={style.input}
                    keyboardAppearance="dark"
                    placeholder="Searching podcasts, episodes, users"
                    placeholderTextColor={colors.grey}
                    clearButtonMode="while-editing"
                    returnKeyType="done"
                    autoCorrect={false}
                    onChangeText={(query) => this.props.dispatch(updateQuery(query))}
                    selectTextOnFocus
                />
            </View>
        );
    }
}

let style = {
    wrapper: {
        backgroundColor: 'rgba(60,60,60,0.5)',
        borderRadius: 4,
        height: 28,
        alignSelf: 'stretch',
        overflow: 'hidden',
        flexDirection: 'row',
        paddingLeft: 12,
        alignItems: 'center'
    },
    magnifying: {
        marginRight: 7
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'System',
        color: colors.lightGrey
    }
};

export default connect()(SearchBar);