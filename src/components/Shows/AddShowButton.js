import React, {
    ActionSheetIOS,
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import TouchableFade from '../common/TouchableFade';
import colors from '../../colors';
import {PrimaryText, SecondaryText} from '../../type';
import Icon from 'react-native-vector-icons/Ionicons';
import RoundButton from '../common/RoundButton';

import store from '../../redux/create';
import {updateCurrentTab} from '../../redux/modules/tabs';

export default class AddShowButton extends Component {

    showSearch() {
        store.dispatch(updateCurrentTab('search'));
    }

    renderRoundButton() {
        return (
            <View style={{alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}>
                <RoundButton label="Find shows to add" onPress={this.showSearch.bind(this)}/>
            </View>
        )
    }
        
    renderFakeRow() {
        return (
            <TouchableFade style={styles.wrapper}
                           underlayColor={colors.darkerGrey}
                           onPress={this.showSearch.bind(this)}
            >
                <View style={styles.fakeArt}>
                    <Icon name="ios-search-strong" color={colors.lightGrey} size={28} />
                </View>

                <View style={styles.info}>
                    <PrimaryText style={styles.name} numberOfLines={1}>Find shows to add</PrimaryText>
                </View>
            </TouchableFade>
        );
    }

    render() {
        return this.renderRoundButton();
    }
}

let styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 12,
        paddingBottom: 12,
        position: 'relative'
    },
    fakeArt: {
        width: 66,
        height: 66,
        marginRight: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.darkerGrey
    },
    info: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'stretch',
        height: 66
    },
    text: {
        fontFamily: 'System'
    },
    name: {
    },
    secondary: {
        marginTop: 6
    }
});