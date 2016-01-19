import React, {
    Component,
    Image,
    Text,
    View
} from 'react-native';

import {PrimaryText, SecondaryText} from '../../type';
import colors from '../../colors';
import TouchableFade from '../TouchableFade';

export default class ResultItem extends Component {

    static propTypes = {

    };

    static defaultProps = {};

    render() {
        return (
            <TouchableFade underlayColor={colors.almostDarkGrey}>
                <View style={style.wrapper}>
                    <Image style={style.photo} source={{uri: this.props.photoUrl}} />
                    <View style={style.info}>
                        <PrimaryText style={style.primary} numberOfLines={1}>{this.props.primary}</PrimaryText>
                        <SecondaryText style={style.secondary}>{this.props.secondary}</SecondaryText>
                    </View>
                    <View style={style.sep} />
                </View>
            </TouchableFade>
          );
    }
}

let style = {
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
};