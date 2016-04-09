import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Relay from 'react-relay';
import emojione from 'emojione';
import PlayClipButton from './PlayClipButton';
import DebugView from '../common/DebugView';
import colors from '../../colors';
import FacebookAvatar from '../common/FacebookAvatar';
import LikeButton from '../common/LikeButton';
import PrettyArtwork from '../common/PrettyArtwork';
import ActionRow from './ActionRow';
import InfoRow from './InfoRow';

class CompactAnnotation extends Component {

    render() {
        const onlyEmojiStyles = this.props.annotation.text.replace(/ *\:[^)]*\: */g, "").length === 0 ? {fontSize: 40, letterSpacing: 4} : {};
        return (
            <View style={styles.wrapper}>
                <PrettyArtwork style={styles.background} podcast={this.props.annotation.episode.podcast} />

                <View style={styles.avatarWrapper}>
                    <FacebookAvatar
                        size={60}
                        style={styles.avatar}
                        user={this.props.annotation.user}
                    />
                </View>

                <Text style={[styles.text, styles.name]}>{this.props.annotation.user.displayName}</Text>
                <Text style={[styles.text, styles.body, onlyEmojiStyles]}>{emojione.shortnameToUnicode(this.props.annotation.text)}</Text>

                {this.props.annotation.clip && <PlayClipButton
                    clip={this.props.annotation.clip}
                />}

                <ActionRow annotation={this.props.annotation}/>

                <InfoRow annotation={this.props.annotation} />

            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        //flexDirection: 'row',
        //backgroundColor: colors.darkGreyLightContrast,
        //paddingLeft: 12,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
        //flex: 1,
        //position: 'relative',
        //height: 200,
        marginTop: 60,
        paddingTop: 50
    },

    textWrapper: {
        padding: 20,
        flex: 1
    },
    text: {
        fontFamily: 'System',
        color: colors.lightGrey,
        backgroundColor: 'transparent',
        fontSize: 14,
        fontWeight: '400'
    },
    name: {
        fontWeight: '500'
    },
    body: {
        fontSize: 22,
        color: colors.lighterGrey,
        marginTop: 12,
        paddingLeft: 4,
        paddingRight: 4
    },
    background: {
        //position: 'absolute',
        //top: 0,
        //left: 0,
        //bottom: 0,
        //right: 0
    },

    avatarWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: -18,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatar: {

    }
});

export default Relay.createContainer(CompactAnnotation, {
    fragments: {
        annotation: () => Relay.QL`
            fragment on Annotation {
                id
                text
                ${ActionRow.getFragment('annotation')}
                ${InfoRow.getFragment('annotation')}
                user {
                    displayName
                    ${FacebookAvatar.getFragment('user')}
                }
                clip {
                    ${PlayClipButton.getFragment('clip')}
                }
                episode {
                    podcast {
                        ${PrettyArtwork.getFragment('podcast')}
                    }
                }
            }
        `
    }
})