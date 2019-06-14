import React, { Component } from 'react';
import { View, Text, Button, AsyncStorage } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import { signOutUser } from '../../actions';

class UserDetails extends Component {
    constructor(props) {
        super(props)
    }

    signOut = () => {
        this.props.signOutUser();
        if (this.props.user) {
            this.deleteUserId()
            this.props.navigation.navigate('Auth')
        }
    }
    deleteUserId = async () => {
        await AsyncStorage.removeItem('userToken', (error) => {
            if (error) {
                console.log(error)
            }
        });
    }
    render() {
        return (
            <View
                style={{
                    padding: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#77dd77',
                    flex: 1,
                }}
            >
                <Text style={{ fontSize: 25 }}>Signed In!</Text>
                <Text>{JSON.stringify(this.props.user)}</Text>
                <Button title="Sign Out" color="red" onPress={this.signOut} />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.signUpReducer.user,
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        signOutUser
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);

