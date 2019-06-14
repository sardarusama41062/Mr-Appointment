import React, { Component } from 'react';
import { createSwitchNavigator, createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo'
import PhoneAuth from "../components/SigunUpComponent/PhoneAuth"
import VerifyCodeInput from '../components/SigunUpComponent/verifyCode'
import UserDetails from '../components/SigunUpComponent/userDetails'
import AuthLoadingScreen from '../components/splashScreen/AuthLoadingScreen'
import UserForm from '../components/SigunUpComponent/FormScreen'
import CategoriesScreen from '../components/Dashboard/categories/CategoriesScreen'
import ProfileScreen from '../components/Dashboard/profileScreenComponents/ProfileScreen'
import SummaryScreen from '../components/Dashboard/profileScreenComponents/summary'
import DoctorDetailsScreen from '../components/Dashboard/doctorComponents/doctorDetails'
import DrFormScreen from '../components/Dashboard/doctorComponents/doctorForm'
import PendingScreen from '../components/Dashboard/profileScreenComponents/pendingScreen'
import UnderExaminationScreen from '../components/Dashboard/doctorComponents/underExaminationScreen'
import DoctorProfilesScreen from '../components/Dashboard/doctorComponents/doctorProfile/drProfileScreen'
import DoctorHomeScreen from "../components/Dashboard/doctorComponents/doctorProfile/drHome";
import DoctorSummaryScreen from "../components/Dashboard/doctorComponents/doctorProfile/drSummary";
import DoctorPendingScreen from '../components/Dashboard/doctorComponents/doctorProfile/drPendingScreen';
import AppointmentRequestsScreen from '../components/Dashboard/doctorComponents/doctorProfile/requests/appointmentRequests'
import UpdateDoctorProfileScreen from '../components/Dashboard/doctorComponents/doctorProfile/updateDrProfile'
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';
import AndroidOpenSettings from 'react-native-android-open-settings'

console.disableYellowBox = true

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isConnected: true
    }
  }
  componentDidMount() {
    this.checkPermission();
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(async (fcmToken) => {
      await AsyncStorage.setItem('fcmToken', fcmToken);
      console.log('token changed')
    })
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    firebase.notifications().onNotification((notification) => {
      // Process your notification as required
      console.log(notification)
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
      console.log('success')
    });

  }
  openSettings() {
    Alert.alert(
      'Sorry',
      'There is no Internet Connection',
      [
        {
          text: 'cancel',
          onPress: () => console.log('canceled')
        },
        {
          text: 'Open Settings',
          onPress: () => AndroidOpenSettings.generalSettings()
        }
      ]
    )
  }

  componentWillUnmount() {
    console.log("offline")
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
        console.log(fcmToken)
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
      console.log('permission rejected');
      this.requestPermission()
    }
  }
  handleConnectivityChange = isConnected => {
    console.log(isConnected)
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };
  render() {
    {
      this.state.isConnected ?
        console.log('online')
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

const ProfileStackNavigator = createStackNavigator({
  profile: {
    screen: ProfileScreen,
    navigationOptions: {
      headerTitle: 'Profile'
    }
  },
  User: {
    screen: UserDetails,
    navigationOptions: {
      herderTitle: 'User'
    }
  },
  Summary: {
    screen: SummaryScreen,
    navigationOptions: {
      headerTitle: 'Summary'
    }
  },
  Pending: {
    screen: PendingScreen,
    navigationOptions: {
      headerTitle: 'Pending Appointments'
    }
  },
  DoctorForm: {
    screen: DrFormScreen,
    navigationOptions: {
      headerTitle: 'Become a Doctor',
    },
  },
  UnderExamination: {
    screen: UnderExaminationScreen,
    navigationOptions: {
      header: null
    }
  }
})

ProfileStackNavigator.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};

  if (routeName === 'DoctorForm' || routeName === 'Summary' || routeName === 'Pending' || routeName === 'UnderExamination') {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
}



const CategoryStackNavigator = createStackNavigator({
  Categories: {
    screen: CategoriesScreen,
    navigationOptions: {
      headerTitle: 'Categories'
    }
  },
  DoctorDetails: {
    screen: DoctorDetailsScreen,
    navigationOptions: {
      headerTitle: 'Details'
    }
  },
})

const DashboardTabNavigator = createBottomTabNavigator({
  ProfileStack: {
    screen: ProfileStackNavigator,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Icon name="md-person" color={tintColor} size={24} />
      ),
      title: 'Profile'
    }
  },
  CategoriesStack: {
    screen: CategoryStackNavigator,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Icon name="md-menu" color={tintColor} size={24} />
      ),
      title: 'Categories'
    }
  },
}, {
    defaultNavigationOptions: {
      tabBarOptions: {
        activeTintColor: '#f7c744',
        labelStyle: {
          fontSize: 12,
        },
        style: {
          backgroundColor: 'rgb(32, 57, 70)',
        },
      }
    },
    resetOnBlur: true
  })
DashboardTabNavigator.navigationOptions = () => {
  return {
    header: null,
  }
};

const DoctorHomeStackNavigator = createStackNavigator({
  HomeScreen: {
    screen: DoctorHomeScreen,
    navigationOptions: {
      header: null
    }
  },
  DrSummary: {
    screen: DoctorSummaryScreen,
    navigationOptions: {
      headerTitle: 'Summary'
    }
  },
  DrPending: {
    screen: DoctorPendingScreen,
    navigationOptions: {
      headerTitle: 'Pending Appointments'
    }
  },
  Requests: {
    screen: AppointmentRequestsScreen,
    navigationOptions: {
      headerTitle: 'Appointment Requests'
    }
  },
})

DoctorHomeStackNavigator.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};

  if (routeName === 'Requests' || routeName === 'DrSummary' || routeName === 'DrPending') {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
}

const DoctorProfileStackNavigator = createStackNavigator({
  DoctorProfileStack: {
    screen: DoctorProfilesScreen,
    navigationOptions: {
      header: null
    }
  },
  DoctorUpdateScreen: {
    screen: UpdateDoctorProfileScreen
  }
})
DoctorProfileStackNavigator.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {};

  if (routeName === 'DoctorUpdateScreen') {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
}

const DoctorDashboardTabNavigator = createBottomTabNavigator({
  Home: {
    screen: DoctorHomeStackNavigator,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Icon name="md-home" color={tintColor} size={24} />
      ),
      title: 'Home'
    }
  },
  DoctorProfile: {
    screen: DoctorProfileStackNavigator,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Icon name="md-menu" color={tintColor} size={24} />
      ),
      title: 'Profile'
    }
  },
}, {
    defaultNavigationOptions: {
      tabBarOptions: {
        labelStyle: {
          fontSize: 12,
        },
        style: {
          backgroundColor: 'rgb(32, 57, 70)'
        }
      }
    },
    resetOnBlur: true
  }
)
DoctorDashboardTabNavigator.navigationOptions = () => {
  return {
    header: null,
  }
};
const DashboardStackNavigator = createStackNavigator({
  DashboardTabNavigator, DoctorDashboardTabNavigator
})

const AppContainer = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: DashboardStackNavigator,
    Auth: AuthStack,
    Forms: UserFormStack,
    Pro: DoctorDashboardTabNavigator,
    test: UserForm
  },
  {
    initialRouteName: 'AuthLoading',
  }
))
