import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    UIManager,
    View
} from 'react-native';
import Relay from 'react-relay';
import {prettyFormatTime} from '../../utils'
import FacebookAvatar from '../common/FacebookAvatar';
import colors from '../../colors';

class Annotation extends Component {

    render() {
        return (
            <View style={styles.wrapper}>
                <FacebookAvatar style={styles.photo} user={this.props.annotation.user} size={32}/>
                <View style={styles.content}>
                    <Text style={styles.name} numberOfLines={1}>{this.props.annotation.user.displayName}</Text>
                    <Text style={styles.text}>{this.props.annotation.text} [{prettyFormatTime(Math.round(this.props.annotation.time))}]</Text>
                </View>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        //flex: 1,
        //borderWidth: 1,
        //borderColor: 'red',
        flexDirection: 'row',
        paddingLeft: 12,
        alignSelf: 'stretch',
        paddingBottom: 12,
        marginBottom: 6
    },
    photo: {
        marginRight: 12
    },
    content: {
        flex: 1
    },
    name: {
        fontFamily: 'System',
        color: colors.grey,
        fontWeight: '500',
        letterSpacing: 0.3
    },
    text: {
        fontFamily: 'Charter',
        color: colors.darkGrey,
        fontSize: 18,
        lineHeight: 24
    }
});

export default Relay.createContainer(Annotation, {
    fragments: {
        annotation: () => Relay.QL`
            fragment on Annotation {
                id
                text
                time
                user {
                    displayName
                    ${FacebookAvatar.getFragment('user')}
                }
            }
        `
    }
});