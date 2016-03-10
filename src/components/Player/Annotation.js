import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';

class Annotation extends Component {

    render() {
        return (
            <View style={styles.wrapper}>
                <Text>[{this.props.annotation.time}] {this.props.annotation.user.displayName} : {this.props.annotation.text}</Text>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        //flex: 1,
        height: 100
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
                }
            }
        `
    }
});