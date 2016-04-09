import React, {
    Component,
    Image,
    Text,
    View
} from 'react-native';

import colors from './colors';

export class PrimaryText extends Component {

    render() {
        return (
            <Text {...this.props} style={[
                {
                    fontFamily: 'System',
                    fontWeight: '400',
                    fontSize: 18,
                    color: colors.lightGrey,
                    backgroundColor: 'transparent',
                    letterSpacing: 0.9
                },
                this.props.style
            ]}>{this.props.children}</Text>
        );
    }
}

export class SecondaryText extends Component {

    render() {
        return (
            <Text {...this.props} style={[
                {
                    fontFamily: 'System',
                    fontSize: 14,
                    fontWeight: '200',
                    color: colors.grey,
                    backgroundColor: 'transparent',
                    letterSpacing: 0.79
                },
                this.props.style
            ]}>{this.props.children}</Text>
        );
    }
}

export class SupportingText extends Component {

    render() {
        return (
            <Text {...this.props} style={[
                {
                    fontFamily: 'System',
                    fontSize: 14,
                    fontWeight: '200',
                    color: colors.grey,
                    backgroundColor: 'transparent',
                    lineHeight: 17
                },
                this.props.style
            ]}>{this.props.children}</Text>
        );
    }
}

export class MetaText extends Component {

    render() {
        return (
            <Text {...this.props} style={[
                {
                    fontFamily: 'System',
                    fontSize: 11,
                    fontWeight: '400',
                    color: colors.grey,
                    backgroundColor: 'transparent',
                    lineHeight: 13,
                    letterSpacing: 0.77
                },
                this.props.style
            ]}>{this.props.children}</Text>
        );
    }
}

export class BoldCaps extends Component {

    render() {
        return (
            <Text {...this.props} style={[
                {
                    color: colors.white,
                    backgroundColor: 'transparent',
                    fontFamily: 'System',
                    fontWeight: '700',
                    fontSize: 10,
                    letterSpacing: 1.85
                },
                this.props.style
            ]}>{this.props.children}</Text>
        );
    }
}