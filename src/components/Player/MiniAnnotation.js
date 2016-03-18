import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

class MiniAnnotation extends Component {

    static propTypes = {
        
    };

    static defaultProps = {
        
    };

    render() {
        console.info('render mini annotation!')
        const photoUrl = `http://graph.facebook.com/v2.5/${this.props.user.facebookId}/picture?type=square&height=${height * 2}`;
        return (
            <View style={[styles.wrapper, this.props.style]}>
                <Image style={styles.image} source={{uri: photoUrl}} />
                <View style={styles.lines}>
                    <View style={styles.line} />
                    <View style={[styles.line, {width: 7, marginTop: 3}]} />
                </View>
            </View>
        );
    }
}

const height = 22;

let styles = StyleSheet.create({
    wrapper: {
        width: 44,
        height: height,
        borderRadius: 1.5,
        backgroundColor: '#FEFEFE',
        flexDirection: 'row',
        overflow: 'hidden'
    },
    image: {
        flex: 1,
        height: height
    },
    lines: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    line: {
        marginLeft: 6,
        height: 3,
        width: 12,
        backgroundColor: '#A0A0A0'
    }
});

export default Relay.createContainer(MiniAnnotation, {
    fragments: {
        user: () => Relay.QL`
            fragment on User {
                facebookId
            }
        `
    }
});