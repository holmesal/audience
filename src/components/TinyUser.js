import React, {
    Component,
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View
} from 'react-native';


export default class TinyUser extends Component {

    static propTypes = {
        profilePhotoUrl: React.PropTypes.string.isRequired,
        center: React.PropTypes.bool
    };

    static defaultProps = {
        size: 28,
        center: false
    };

    render() {
        return (
            <View style={[
                styles.wrapper,
                {
                    width: this.props.size,
                    height: this.props.size,
                    borderRadius: this.props.size/2
                },
                this.props.center && {
                    marginLeft: -this.props.size/2,
                    marginTop: -this.props.size/2
                },
                this.props.style]}>
                <Image style={styles.image} source={{uri: this.props.profilePhotoUrl}} />
            </View>
        );
    }
}

let styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'rgba(207,207,207,0.22)',
        overflow: 'hidden'
    },
    image: {
        flex: 1,
        alignSelf: 'stretch'
    }
});