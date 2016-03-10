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

export default class Navbar extends Component {

    static propTypes = {};

    static defaultProps = {};

    componentDidMount() {
        StatusBarIOS.setStyle('default');
    }


    render() {
        return (
            <View style={styles.wrapper}>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'stretch',
        borderBottomWidth: 1,
        borderColor: colors.lightBorder,
        paddingTop: 20,
        height: 66
    }
});