import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

import {connect} from 'react-redux';
import {updateQuery, query$, focus$, focus, blur} from '../../redux/modules/search';
import {createSelector} from 'reselect';

import colors from '../../colors';

class SearchBar extends Component {

    static propTypes = {};

    static defaultProps = {};

    componentWillReceiveProps(nextProps) {
        if (nextProps.focus != this.props.focus) {
            if (nextProps.focus) this.focus();
            else this.blur()
        }
    }

    focus() {
        this.refs.input.focus();
    }

    blur() {
        this.refs.input.blur();
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <Image style={styles.magnifying} source={require('image!magnifyingGlass')} />
                <TextInput
                    ref="input"
                    style={styles.input}
                    keyboardAppearance="dark"
                    placeholder="Searching podcasts"
                    placeholderTextColor={colors.grey}
                    clearButtonMode="while-editing"
                    returnKeyType="done"
                    autoCorrect={true}
                    value={this.props.query}
                    onChangeText={(query) => this.props.dispatch(updateQuery(query))}
                    selectTextOnFocus
                    onFocus={() => this.props.dispatch(focus())}
                    onBlur={() => this.props.dispatch(blur())}
                />
            </View>
        );
    }
}

let styles = StyleSheet.create({
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
});

let sel$ = createSelector(query$, focus$, (query, focus) => ({
    query,
    focus
}));

export default connect(sel$, null, null, {withRef: true})(SearchBar);