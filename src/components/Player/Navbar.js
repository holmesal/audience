import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    StatusBarIOS,
    Text,
    View
} from 'react-native';

import colors from '../../colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NavbarButton from './NavbarButton';

export default class Navbar extends Component {

    static propTypes = {};

    static defaultProps = {};

    componentDidMount() {
        StatusBarIOS.setStyle('default');
    }

    close() {

    }

    recommend() {

    }

    share() {

    }

    more() {

    }

    render() {
        const iconSize = 28;
        return (
            <View style={styles.wrapper}>

                <NavbarButton onPress={this.close.bind(this)}>
                    <Icon name="ios-arrow-down" color={colors.darkGrey} size={iconSize}/>
                </NavbarButton>

                <View style={{flex: 1}} />

                <NavbarButton onPress={this.share.bind(this)}>
                    <Icon name="ios-upload-outline" color={colors.darkGrey} size={iconSize}/>
                </NavbarButton>

                <NavbarButton onPress={this.recommend.bind(this)}>
                    <Icon name="ios-heart-outline" color={colors.darkGrey} size={iconSize}/>
                </NavbarButton>

                <NavbarButton onPress={this.more.bind(this)}>
                    <Icon name="ios-more" color={colors.darkGrey} size={iconSize}/>
                </NavbarButton>

            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        paddingTop: 20,
        flexDirection: 'row',
        alignSelf: 'stretch',
        borderBottomWidth: 1,
        borderColor: colors.lightBorder,
        height: 66
    }
});