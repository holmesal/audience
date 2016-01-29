import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import striptags from 'striptags';

import {PrimaryText, SupportingText, MetaText} from '../../type';
import colors from '../../colors';
import TouchableFade from '../TouchableFade';

export default class EpisodeListItem extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        unheard: PropTypes.bool,
        onPress: PropTypes.func
    };

    static defaultProps = {
        unheard: false
    };

    getDuration() {
        if (!this.props.duration) return (<View style={{flex: 1}}/>);
        let components = this.props.duration.split(':');
        let hours = parseInt(components[0]);
        let minutes = parseInt(components[1]);
        let timeString = '';
        // This format is a little longer, but not so compact
        //if (hours > 0) timeString += `${hours} HR${hours > 1 ? 'S' : ''}   `;
        //if (minutes > 0) timeString += `${minutes} MIN${minutes > 1 ? 'S' : ''}`;
        // This format is more compact
        if (hours > 0) timeString += `${hours}h `;
        if (minutes > 0) timeString += `${minutes}m`;

        return (
            <MetaText>{timeString}</MetaText>
        )
    }

    getUploadedAgo() {
        let extraStyle = this.props.unheard ? {color: colors.attention} : {};
        return (
            <MetaText style={extraStyle}>1 day ago</MetaText>
        )
    }

    render() {
        return (
            <TouchableFade style={styles.wrapper} underlayColor={colors.almostDarkGrey} onPress={this.props.onPress}>
                <View style={styles.content}>
                    <PrimaryText style={styles.title} numberOfLines={1}>{this.props.title}</PrimaryText>
                </View>
                <View style={styles.supporting}>
                    <SupportingText style={styles.description} numberOfLines={2}>{striptags(this.props.description)}</SupportingText>
                    <View style={styles.metaRow}>
                        <Image style={styles.tinyIcon} source={require('image!tinyClock')} />
                        {this.getDuration()}
                        <View style={{flex: 1}} />
                        <Image style={[styles.tinyIcon, {tintColor: this.props.unheard ? colors.attention : null}]} source={require('image!tinyUploaded')} />
                        {this.getUploadedAgo()}
                    </View>
                </View>
                <TouchableOpacity style={styles.touchable}>
                    <Image style={styles.dots} source={require('image!dots')} />
                </TouchableOpacity>
                {this.props.unheard && <View style={styles.indicator}/>}
            </TouchableFade>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        //backgroundColor: 'orange',
        //flexDirection: 'row',
        //alignItems: 'center',
        paddingLeft: 20,
        paddingTop: 18,
        position: 'relative'
        //paddingBottom: 12
    },
    title: {
        //backgroundColor: 'green',
        //color: 'white',
        fontSize: 16,
        //marginBottom: 20,
        //padding: 20,
        flex: 1,
        alignSelf: 'stretch',
        //paddingRight: 60
    },
    touchable: {
        backgroundColor: 'transparent',
        width: 62,
        height: 52,
        position: 'absolute',
        top: 0,
        right: 0
    },
    dots: {
        position: 'absolute',
        top: 26,
        right: 20,
        tintColor: '#A4A4A4'
    },
    content: {
        //backgroundColor: 'red',
        marginRight: 60
    },
    titleRow: {

    },
    supporting: {
        //backgroundColor: 'blue',
        paddingLeft: 8,
        paddingRight: 20,
        paddingBottom: 13,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.03)',
        alignSelf: 'stretch'
    },
    description: {
        //width: 100
        marginTop: 6
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14
    },
    tinyIcon: {
        width: 10,
        height: 10,
        marginRight: 4
    },
    indicator: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 6,
        backgroundColor: colors.attention
    }
});