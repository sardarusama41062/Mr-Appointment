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
    const ref = firebase.database().ref(`/doctors/doctorList/+923215582381/info`);
    ref.update({
      onlineState: true,
      status: "I'm online."
    });
    ref.onDisconnect().update({
      onlineState: false,
      status: "I'm offline."
    });
    this.checkPermission();
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(async (fcmToken) => {
      await AsyncStorage.setItem('fcmToken', fcmToken);
      alert('token changed')
    })
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
  openSettings() {
    Alert.alert(
      'Sorry',
      'There is no Internet Connection',
      [
        {
          text: 'Open Settings',
          onPress: () => AndroidOpenSettings.generalSettings()
        }
      ]
    )
  }

  componentWillUnmount() {
    this.onTokenRefreshListener();
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
    console.log(fcmToken)
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      this.requestPermission()
    }
  }
  handleConnectivityChange = isConnected => {
    // alert(isConnected)
    const ref = firebase.database().ref(`/doctors/doctorList/+923215582381/info`);
    if (isConnected) {
      this.setState({ isConnected });
      ref.update({ onlineState: true })
    } else {
      this.setState({ isConnected });
      ref.onDisconnect().update({ onlineState: false })
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
            // set user's online status
            // setUserStatus("online");
          }
        }
      );
  };
  render() {
    {
      this.state.isConnected ?
        console.log('on')
        :
        this.openSettings()
    }

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