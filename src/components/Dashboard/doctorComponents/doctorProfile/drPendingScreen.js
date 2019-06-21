import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Button, Alert } from 'react-native'

///////// redux coding ////////
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getPendingAppointments, removePendingAppointments, removePatientNotReceived } from '../../../../actions/doctorActions'

///////////////////////////////

const img = require('../../../../assests/no_data_found.png')
import AndroidOpenSettings from 'react-native-android-open-settings'
import NetInfo from '@react-native-community/netinfo'

class DoctorPendingScreen extends Component {
    constructor() {
        super()
        this.state = {
            data: [],
        }
    }
    componentDidMount() {
        const { phoneNumber, getPendingAppointments } = this.props
        getPendingAppointments(phoneNumber)
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    handleConnectivityChange = isConnected => {
        if (isConnected) {
            this.setState({ isConnected });
        }
        else {
            this.setState({ isConnected });
        }
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

    handleSubmit = (data) => {
        const { removePendingAppointments } = this.props
        // alert(JSON.stringify(data))
        const { userName, token } = data
        Alert.alert(
            'Confirmation',
            `${userName} with Token # ${token} is Received ?`,
            [
                {
                    text: 'Cancel',
                    onPress: () => '',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        removePendingAppointments(data)
                    },
                }
            ],
        );
    }
    handleNotReceived = (data) => {
        const { removePatientNotReceived } = this.props
        const { userName, token } = data
        Alert.alert(
            'Confirmation',
            `${userName} with Token # ${token} is not Received ?`,
            [
                {
                    text: 'Cancel',
                    onPress: () => '',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        removePatientNotReceived(data)
                    },
                }
            ],
        );
    }
    render() {
        return (
            <ScrollView>
                {this.props.pending ?
                    <View style={{ padding: 10, paddingBottom: 100 }} >
                        {this.props.pending.length ?
                            <View>
                                {!this.state.isConnected && this.openSettings()}
                                {this.props.pending.map((data, index) => {
                                    return (
                                        <View key={index} >
                                            <TouchableOpacity key={index} style={styles.container} >
                                                <View style={styles.imgContainer} >
                                                    <Image source={{ uri: data.imageUrl }} style={{
                                                        height: 80, width: 80,
                                                        borderWidth: 1, borderRadius: 100,
                                                    }} />
                                                </View>
                                                <View style={styles.textContainer} >
                                                    <Text>
                                                        Patient Name : {data.userName}
                                                    </Text>
                                                    <View style={{ flexDirection: 'row' }} >
                                                        <Text width='45%' style={{ marginRight: 10 }} >
                                                            Date : {data.date}
                                                        </Text>
                                                        <Text width='50%'>
                                                            Time : {data.selectedTime}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row' }} >
                                                        <Text width='45%' style={{ marginRight: 10 }} >
                                                            Token : {data.token}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={{ flexDirection: 'row' }} >
                                                <View style={{ width: '48%', marginRight: '2%' }} >
                                                    <Button
                                                        onPress={() =>
                                                            this.state.isConnected ?
                                                                this.handleSubmit(data)
                                                                :
                                                                this.openSettings()
                                                        }
                                                        title='Patient Received'
                                                    />
                                                </View>
                                                <View style={{ width: '50%', backgroundColor: 'red', }} >
                                                    <Button color="#ef000b"
                                                        onPress={() =>
                                                            this.state.isConnected ?
                                                                this.handleNotReceived(data)
                                                                :
                                                                this.openSettings()

                                                        }
                                                        title='Not Received' />
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                            :
                            <View style={{ flex: 1 }} >
                                <Text>
                                    Sorry! No Pending Appointment Yet.
                            </Text>
                                <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }} >
                                    <Image source={img} width='75%' height='100%' />
                                </View>
                            </View>
                        }
                    </View>
                    :
                    <View style={{ flex: 1 }} >
                        <Text>
                            Sorry! No Pending Appointment Yet.
                    </Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }} >
                            <Image source={img} width='75%' height='100%' />
                        </View>
                    </View>
                }
            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        phoneNumber: state.doctorReducer.doctorData.phoneNumber,
        pending: state.doctorReducer.pending
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getPendingAppointments, removePendingAppointments, removePatientNotReceived
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DoctorPendingScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 2,
        paddingVertical: 20,
        borderBottomColor: '#f7c744',
    },
    imgContainer: {
        width: '30%',
        justifyContent: 'center'
    },
    textContainer: {
        width: '70%',
        justifyContent: 'center'
    }
})