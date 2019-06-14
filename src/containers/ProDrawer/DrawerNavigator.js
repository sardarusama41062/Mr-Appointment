import React from 'react';
import { Dimensions, } from 'react-native';
import { createDrawerNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome'
import ProfileCustomComponent from './ProfileCustomComponent'

import { HomeStackNav, HistoryStackNav, 
  PendingStackNav, RequestStackNav } from '../drStack/stackNavigators'

const WIDTH = Dimensions.get('window').width;

const ProDrawer = createDrawerNavigator(
  {
    DrHome: {
      screen: HomeStackNav,
      navigationOptions: {
        title: 'Home',
        drawerIcon: ({ focused }) => (
          <Icon name='home' size={20} color={focused ? '#e91e63' : 'black'} />
        )
      }
    },
    DrHistory: {
      screen: HistoryStackNav,
      navigationOptions: {
        title: 'History',
        drawerIcon: ({ focused }) => (
          <Icon name='users' size={20} color={focused ? '#e91e63' : 'black'} />
        )
      }
    },
    DrPending: {
      screen: PendingStackNav,
      navigationOptions: {
        title: 'Pending Appointments',
        drawerIcon: ({ focused }) => (
          <Icon name='codepen' size={20} color={focused ? '#e91e63' : 'black'} />
        )
      }
    },
    DrRequests: {
      screen: RequestStackNav,
      navigationOptions: {
        title: 'Requests',
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

export default ProDrawer;