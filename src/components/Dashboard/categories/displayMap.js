import MapView, { Marker } from 'react-native-maps';

import React, { Component, } from 'react';
import { StyleSheet, View, Button, Text, PermissionsAndroid, Alert } from 'react-native'
import AndroidOpenSettings from 'react-native-android-open-settings'

////////// redux coding ////////////
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getDoctorByCategory } from '../../../actions/userActions';
import { ActivityIndicator } from 'react-native-paper';
////////////////////////////////////

const styles = StyleSheet.create({
    container: {
        height: 500,
        width: '100%',
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
});

class Map extends Component {
    state = {
        region: null,
        clinickLoc: {
            latitude: 0,
            longitude: 0
        },
        err: false
    }
    componentDidMount() {
        this.request_location_runtime_permission()
        const { navigation, getDoctorByCategory } = this.props;
        const category = navigation.getParam('diseaseName', 'diseaseName');
        getDoctorByCategory(category)
        this.getlocation()
    }
    request_location_runtime_permission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                    title: 'Mr. Appointment',
                    message:
                        'Mr. Appointment App needs access to your location to display doctor location on map ',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('location granted')
                // Alert.alert("Location Permission Granted.");
            }
            else {

                this.request_location_runtime_permission()

            }
        } catch (err) {
            console.warn(err)
        }
    }
    getlocation = () => {
        navigator.geolocation
            .getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude
                    const longitude = position.coords.longitude
                    const clinickLoc = {
                        latitude, longitude
                    }
                    this.setState({ clinickLoc })
                    const region = {
                        latitude, longitude, latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }
                    this.setState({ region, err: false })
                },
                (error) => {
                    // See error code charts below.
                    this.setState({ err: true })
                    this.openSettings()
                },
                { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
            );
    }
    openSettings() {
        Alert.alert(
            'Sorry',
            'You must enable GPS location',
            [
                {
                    text: 'Open Settings',
                    onPress: () => AndroidOpenSettings.generalSettings()
                }
            ]
        )
    }
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                {this.state.err &&
                    <View>
                        <Button style = {{marginBottom: 10,}}  title='Enable Location First' onPress={() => AndroidOpenSettings.generalSettings()} />
                    </View>
                }
                {this.state.region ?
                    <View style={styles.container}>
                        <MapView
                            style={styles.map}
                            initialRegion={this.state.region}
                            region={this.state.region}
                            minZoomLevel={15}
                            zoomEnabled
                            zoomControlEnabled
                        >
                            <Marker
                                coordinate={this.state.clinickLoc}
                            />
                            {this.props.doctorsList ?
                                this.props.doctorsList.map((data, key) => {
                                    return (
                                        <Marker
                                            key={key}
                                            coordinate={data.loc}
                                            onPress={() =>
                                                this.props.navigation.navigate('DoctorDetails', { drId: data.id })
                                            }
                                        >
                                            <Button title={` Dr. ${data.drName}`}
                                                onPress={() => console.log('hit')} />
                                        </ Marker>
                                    )
                                })
                                : null
                            }
                        </MapView>
                        <View style={{ backgroundColor: 'rgb(3,155,229)' }} >
                            <Text style={{ color: 'white', fontWeight: 'bold' }} >
                                Select Doctor Name to Book Your Appointment with
                        </Text>
                        </View>
                    </View>
                    :
                    <View
                        style={{
                            justifyContent: 'center'
                        }}
                    >
                        <ActivityIndicator size='large' color='blue' />
                    </View>
                }
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        doctorsList: state.userReducer.doctorsList,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getDoctorByCategory
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
