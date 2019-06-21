import React from 'react';
import { createStackNavigator } from 'react-navigation';
import CategoriesScreen from '../../components/Dashboard/categories/CategoriesScreen'
import DoctorDetailsScreen from '../../components/Dashboard/doctorComponents/doctorDetails'
import HistoryScreen from '../../components/Dashboard/profileScreenComponents/HistoryScreen'
import PendingScreen from '../../components/Dashboard/profileScreenComponents/pendingScreen'
import ProfileScreen from '../../components/Dashboard/profileScreenComponents/ProfileScreen'
import DoctorFormScreen from '../../components/Dashboard/doctorComponents/doctorForm'
import UnderExaminationScreen from '../../components/Dashboard/doctorComponents/underExaminationScreen'
import UpdateProfileScreen from '../../components/Dashboard/profileScreenComponents/updateProfile'
import MenuIcon from '../drawer/MenuIcon'
import GoogleMaps from '../../components/Dashboard/doctorComponents/gMap'
import MapForDrLoc from '../../components/Dashboard/categories/displayMap'

export const CategoryStackNavigator = createStackNavigator(
    {
        Categories: {
            screen: CategoriesScreen,
            navigationOptions: ({ navigation }) => {
                return {
                    headerTitle: 'Categories',
                    headerLeft: (
                        <MenuIcon navigation={navigation} />
                    ),
                }
            }
        },
        MapForDrLoc: {
            screen: MapForDrLoc,
            navigationOptions: {
                headerTitle: 'Choose Doctor'
            }
        },
        DoctorDetails: {
            screen: DoctorDetailsScreen,
            navigationOptions: {
                headerTitle: 'Details'
            }
        },
    }, {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: 'rgb(3,155,229)',
            },
            headerTintColor: '#fff',
        }
    })

export const HistoryStackNav = createStackNavigator(
    {
        HistoryStack: {
            screen: HistoryScreen,
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
    })

export const PendingStackNav = createStackNavigator(
    {
        PendingStack: {
            screen: PendingScreen,
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
export const ProfileStackNav = createStackNavigator(
    {
        ProfileStack: {
            screen: ProfileScreen,
            navigationOptions: ({ navigation }) => {
                return {
                    headerTitle: 'Profile',
                    headerLeft: (
                        <MenuIcon navigation={navigation} />
                    ),
                }
            }
        },
        DoctorForm: {
            screen: DoctorFormScreen,
        },
        MapLoc: {
            screen: GoogleMaps,
        },
        UnderExamination: {
            screen: UnderExaminationScreen,
            navigationOptions: {
                header: null
            }
        },
        UpdateProfile: {
            screen: UpdateProfileScreen,
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