import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import logo from '../../assests/Mr.jpg'
import { restoreSession } from '../../actions'

class AuthLoadingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0),
        }
    }
    onload = () => {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();
        setInterval(() => {
            this._bootstrapAsync();
        }, 2000)

    }
    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        // const Doctor = await AsyncStorage.getItem('Doctor');
        const { restoreSession, navigation, } = this.props
        restoreSession()
        // if (Doctor) {
        //     navigation.navigate('HomeScreen')
        // }
        // // This will switch to the App screen or Auth screen and this loading
        // // screen will be unmounted and thrown away.
        // else { 
        // navigation.navigate(userToken ? 'App' : 'Auth');
        // }
        navigation.navigate(userToken ? 'App' : 'Auth');
    };

    render() {
        return (
            <View style={{ justifyContent: "center", alignItems: "center", flex: 1, backgroundColor: 'white' }} >
                <Animated.Image
                    source={logo}
                    onLoad={() => this.onload()}
                    {...this.props}
                    style={
                        {
                            opacity: this.state.opacity,
                            transform: [
                                {
                                    scale: this.state.opacity.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.85, 1],
                                    })
                                }
                            ]
                        }
                    }
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        restoreSession,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen)