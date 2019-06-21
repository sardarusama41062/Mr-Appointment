import React from 'react';
import { Dimensions, } from 'react-native';
import { createDrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome'
import ProfileCustomComponent from './ProfileCustomComponent'

import { CategoryStackNavigator, HistoryStackNav, 
  PendingStackNav, ProfileStackNav } from '../userStack/StackNavigators'

const WIDTH = Dimensions.get('window').width;

const AppDrawer = createDrawerNavigator(
  {
    Home: {
      screen: CategoryStackNavigator,
      navigationOptions: {
        title: 'Home',
        drawerIcon: ({ focused }) => (
          <Icon name='home' size={20} color={focused ? '#e91e63' : 'black'} />
        )
      }
    },
    History: {
      screen: HistoryStackNav,
      navigationOptions: {
        title: 'History',
        drawerIcon: ({ focused }) => (
          <Icon name='users' size={20} color={focused ? '#e91e63' : 'black'} />
        )
      }
    },
    Pending: {
      screen: PendingStackNav,
      navigationOptions: {
        title: 'Pending Appointments',
        drawerIcon: ({ focused }) => (
          <Icon name='codepen' size={20} color={focused ? '#e91e63' : 'black'} />
        )
      }
    },
    Profile: {
      screen: ProfileStackNav,
      navigationOptions: {
        title: 'Profile',
        drawerIcon: ({ focused }) => (
          <Icon name='cog' size={20} color={focused ? '#e91e63' : 'black'} />
        )
      }
    }
  },
  {
    drawerWidth: WIDTH * 0.70,
    contentComponent: ProfileCustomComponent,
    contentOptions: {
      activeTintColor: '#e91e63',
    }
  }
);

export default AppDrawer;