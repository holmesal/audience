import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import moment from 'moment';
import colors from '../../colors';

class WelcomeView extends Component {

    render() {
        return (
            <View style={[styles.wrapper, this.props.style]}>
                <Text style={styles.title}>{this.props.episode.title}</Text>
                <Text style={styles.date}>{moment(new Date(this.props.episode.published)).format('MMMM Do, YYYY')}</Text>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        //borderWidth: 1,
        //alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 54,
        paddingRight: 12
    },
    title: {
        fontFamily: 'System',
        fontStyle: 'italic',
        fontWeight: '600',
        fontSize: 30,
        lineHeight: 44,
        color: '#5B5B5B'
    },
    date: {
        fontFamily: 'System',
        fontWeight: '200',
        fontSize: 14,
        color: colors.darkerGrey,
        marginTop: 12
    }
});

export default Relay.createContainer(WelcomeView, {
    fragments: {
        episode: () => Relay.QL`
            fragment on Episode {
                title
                published
            }
        `
    }
});