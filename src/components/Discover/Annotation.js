import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import HangingPhotoRow from './HangingPhotoRow';
import {SupportingText} from '../../type';
import colors from '../../colors';

class Annotation extends Component {

    render() {
        return (
            <View style={styles.wrapper}>
                <HangingPhotoRow user={this.props.user} isLast={this.props.isLast}>
                    <SupportingText style={styles.text}>
                        <Text style={{fontWeight: '600'}}>{this.props.user.displayName}</Text>
                        <Text> left {this.props.annotations.length} comments</Text>
                    </SupportingText>
                </HangingPhotoRow>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        //flex: 1
    },
    text: {
        color: colors.lightGrey,
        marginTop: 3
    }
});

export default Relay.createContainer(Annotation, {
    fragments: {
        user: () => Relay.QL`
            fragment on User {
                id
                displayName
                ${HangingPhotoRow.getFragment('user')}
            }
        `
    }
});