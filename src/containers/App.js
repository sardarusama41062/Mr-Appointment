import React, { Component } from 'react';
import {
  createSwitchNavigator, createStackNavigator,
  createAppContainer,
} from 'react-navigation';
import NetInfo from '@react-native-community/netinfo'
import PhoneAuth from "../components/SigunUpComponent/PhoneAuth"
import VerifyCodeInput from '../components/SigunUpComponent/verifyCode'
import AuthLoadingScreen from '../components/splashScreen/AuthLoadingScreen'
import UserForm from '../components/SigunUpComponent/FormScreen'
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';
import AndroidOpenSettings from 'react-native-android-open-settings'

/// App Drawer///
import AppDrawer from './drawer/DrawerNavigator'
import ProDrawer from './ProDrawer/DrawerNavigator'
///////////////// 

console.disableYellowBox = true

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isConnected: true
    }
  }
  componentDidMount() {
    this.setUserOnline()
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    firebase.notifications().onNotification((notification) => {
      const notifi = new firebase.notifications.Notification({
        show_in_foreground: true,
        sound: 'default',
      })
        .android.setPriority(firebase.notifications.Android.Priority.High)
        .setNotificationId(notification.notificationId)
        .setTitle(notification.title)
        .setBody(notification.body)
        .android.setChannelId("Default")
        .android.setVibrate(1000);

      firebase.notifications().displayNotification(notifi)
    });
  }
  setUserOnline = async () => {
    const id = await AsyncStorage.getItem('userToken')
    if (id) {
      const ref = firebase.database().ref(`/doctors/doctorList/${id}/info`);
      ref.update({
        onlineState: true,
        status: "I'm online."
      });
      ref.onDisconnect().update({
        onlineState: false,
        status: "I'm offline."
      });
    }
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }
  
  handleConnectivityChange = async isConnected => {
    const id = await AsyncStorage.getItem('userToken')
    if (id) {
      const ref = firebase.database().ref(`/doctors/doctorList/${id}/info`);
      if (isConnected) {
        this.setState({ isConnected });
        ref.update({ onlineState: true, status: "I'm online." })
      } else {
        this.setState({ isConnected });
        ref.onDisconnect().update({ onlineState: false, status: "I'm offline." })
      }
      firebase.database().ref(".info/connected")
        .on(
          "value", function (snap) {
            if (snap.val()) {
              // if we lose network then remove this user from the list
              ref.update({
                onlineState: true,
                status: "I'm online."
              });
            }
            else {
              ref.onDisconnect().update({
                onlineState: false,
                status: "I'm offline."
              });
            }
          }
        );
    }
  };
  render() {

    return (
      <AppContainer />
    );
  }
}

const AuthStack = createStackNavigator({
  PhoneAuthScreen: PhoneAuth,
  VerifyCodeInputScreen: VerifyCodeInput
});

const UserFormStack = createStackNavigator({
  UserFormScreen: {
    screen: UserForm
  }
})
const AppContainer = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppDrawer,
    Auth: AuthStack,
    Forms: UserFormStack,
    Pro: ProDrawer,
  },
  {
    initialRouteName: 'AuthLoading',
  }
))