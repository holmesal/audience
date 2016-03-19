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

class Recommendation extends Component {

    renderReview() {
        if (this.props.recommendation.review) {
            return (
                <SupportingText style={styles.review}>"{this.props.recommendation.review}"</SupportingText>
            )
        }
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <HangingPhotoRow user={this.props.recommendation.user} isLast={this.props.isLast}>
                    <SupportingText style={styles.text}>
                        <Text style={{fontWeight: '600'}}>{this.props.recommendation.user.displayName}</Text>
                        <Text> recommends this</Text>
                    </SupportingText>
                    {this.renderReview()}
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

export default Relay.createContainer(Recommendation, {
    fragments: {
        recommendation: () => Relay.QL`
            fragment on Recommendation {
                id
                review
                user {
                    displayName
                    ${HangingPhotoRow.getFragment('user')}
                }
            }
        `
    }
});