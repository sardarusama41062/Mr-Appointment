import MapView, { Marker } from 'react-native-maps';

import React, { Component, } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native'

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
        }
    }
    componentDidMount() {
        const { navigation, getDoctorByCategory } = this.props;
        const category = navigation.getParam('diseaseName', 'diseaseName');
        getDoctorByCategory(category)
        this.getlocation()
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
                    this.setState({ region })
                },
                (error) => {
                    // See error code charts below.
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
            );
    }
    render() {
        const latlon = { longitude: 73.06965362280609, latitude: 31.38814748645727 }
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
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
