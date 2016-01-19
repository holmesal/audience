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
            <Text style={[
                {
                    fontFamily: 'System',
                    fontWeight: '400',
                    fontSize: 18,
                    color: colors.lightGrey,
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
            <Text style={[
                {
                    fontFamily: 'System',
                    fontSize: 14,
                    fontWeight: '200',
                    color: colors.grey,
                    letterSpacing: 0.79
                },
                this.props.style
            ]}>{this.props.children}</Text>
        );
    }
}