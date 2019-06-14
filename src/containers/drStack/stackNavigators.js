import React from 'react';
import { createStackNavigator } from 'react-navigation';

import DoctorProfile from '../../components/Dashboard/doctorComponents/doctorProfile/drProfileScreen'
import UpdateDoctorProfileScreen from '../../components/Dashboard/doctorComponents/doctorProfile/updateDrProfile'
import DoctorHistoryScreen from '../../components/Dashboard/doctorComponents/doctorProfile/drHistory'
import DoctorPendingScreem from '../../components/Dashboard/doctorComponents/doctorProfile/drPendingScreen'
import DoctorRequestsScreen from '../../components/Dashboard/doctorComponents/doctorProfile/requests/appointmentRequests'
import MenuIcon from '../drawer/MenuIcon'

export const HomeStackNav = createStackNavigator(
    {
        HomeStack: {
            screen: DoctorProfile,
            navigationOptions: ({ navigation }) => {
                return {
                    headerTitle: 'Home',
                    headerLeft: (
                        <MenuIcon navigation={navigation} />
                    ),
                }
            }
        },
        UpdateDoctorProfile: {
            screen: UpdateDoctorProfileScreen,
            navigationOptions: {
                header: null
            }
        },
    }, {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: 'rgb(3,155,229)',
            },
            headerTintColor: '#fff',
        }
    }
)

export const HistoryStackNav = createStackNavigator(
    {
        HistoryStack: {
            screen: DoctorHistoryScreen,
            navigationOptions: ({ navigation }) => {
                return {
                    headerTitle: 'History',
                    headerLeft: (
                        <MenuIcon navigation={navigation} />
                    ),
                }
            }
        }
    }, {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: 'rgb(3,155,229)',
            },
            headerTintColor: '#fff',
        }
    }
)

export const PendingStackNav = createStackNavigator(
    {
        PendingStack: {
            screen: DoctorPendingScreem,
            navigationOptions: ({ navigation }) => {
                return {
                    headerTitle: 'Pending Appointments',
                    headerLeft: (
                        <MenuIcon navigation={navigation} />
                    ),
                }
            }
        }
    }, {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: 'rgb(3,155,229)',
            },
            headerTintColor: '#fff',
        }
    }
)
export const RequestStackNav = createStackNavigator(
    {
        RequestStack: {
            screen: DoctorRequestsScreen,
            navigationOptions: ({ navigation }) => {
                return {
                    headerTitle: 'Appointment Requests',
                    headerLeft: (
                        <MenuIcon navigation={navigation} />
                    ),
                }
            }
        },
    }, {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: 'rgb(3,155,229)',
            },
            headerTintColor: '#fff',
        }
    }
)