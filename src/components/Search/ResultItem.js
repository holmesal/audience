import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';

import {PrimaryText, SecondaryText} from '../../type';
import colors from '../../colors';
import TouchableFade from '../common/TouchableFade';

export default class ResultItem extends Component {

    static propTypes = {

    };

    static defaultProps = {};

    render() {
        return (
            <TouchableFade underlayColor={colors.almostDarkGrey} onPress={this.props.onPress} onLongPress={this.props.onLongPress}>
                <View style={styles.wrapper}>
                    <Image style={styles.photo} source={{uri: this.props.photoUrl}} />
                    <View style={styles.info}>
                        <PrimaryText style={styles.primary} numberOfLines={1}>{this.props.primary}</PrimaryText>
                        <SecondaryText style={styles.secondary}>{this.props.secondary}</SecondaryText>
                    </View>
                    <View style={styles.sep} />
                </View>
            </TouchableFade>
          );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch',
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 8,
        paddingBottom: 16,
        flexDirection: 'row',
        position: 'relative'
    },

    photo: {
        width: 48,
        height: 48,
        backgroundColor: colors.almostDarkGrey,
        marginRight: 20
    },

    info: {
        flex: 1
    },

    primary: {
        marginTop: 4,
        //height: 20
    },

    secondary: {
        marginTop: 6
    },

    sep: {
        backgroundColor: colors.almostDarkGrey,
        opacity: 0.5,
        height: 1,
        marginTop: -1,
        position: 'absolute',
        bottom: 0,
        left: 20 + 48 + 20,
        right: 0
    }
});