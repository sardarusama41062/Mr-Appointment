import MapView, { Marker } from 'react-native-maps';

import React, { Component, } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native'

////////// redux coding ////////////
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { submitMapLoc } from '../../../actions/doctorActions';
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
        this.props.clinickLoc ?
            this.setState({
                region: {
                    latitude: this.props.clinickLoc.latitude,
                    longitude: this.props.clinickLoc.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                },
                clinickLoc: {
                    latitude: this.props.clinickLoc.latitude,
                    longitude: this.props.clinickLoc.longitude,
                }
            })
            :
            this.getlocation()
    }
    getlocation = () => {
        navigator.geolocation
            .getCurrentPosition(
                (position) => {
                    console.log(position);
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
    handleSubmit = () => {
        const { clinickLoc } = this.state
        this.props.submitMapLoc(clinickLoc)
        this.props.navigation.navigate('DoctorForm')
    }
    render() {
        console.log(this.state)
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
                            <Marker draggable
                                coordinate={this.state.clinickLoc}
                                onDragEnd={(e) => {
                                    this.setState({
                                        clinickLoc: e.nativeEvent.coordinate
                                    })
                                    const latitude = e.nativeEvent.coordinate.latitude
                                    const longitude = e.nativeEvent.coordinate.longitude
                                    const region = {
                                        latitude, longitude, latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }
                                    this.setState({ region })
                                }}
                            />
                        </MapView>
                        <View>
                            <Text>
                                Hold and Drag the Marker to set your Clinick's Location
                        </Text>
                            <Button onPress={() => this.handleSubmit()} title='Submit' />
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
        clinickLoc: state.doctorReducer.clinickLoc,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        submitMapLoc
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
