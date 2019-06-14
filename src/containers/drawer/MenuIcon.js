import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'

export default class MenuIcon extends Component {
    render() {
        return (
            <Icon style={{ padding: 10 }} 
                onPress={() => this.props.navigation.toggleDrawer()}
                name='md-menu' size={30}
            />
        )
    }
}