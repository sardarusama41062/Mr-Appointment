import React, { Component } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ImageBackground, ScrollView, PermissionsAndroid,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/FontAwesome';
const img = require('../../../../assests/img.png')

///////// redux coding ////////
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getDoctor } from '../../../../actions/doctorActions'

///////////////////////////////
import AsyncStorage from '@react-native-community/async-storage';

class DoctorProfilesScreen extends Component {
    componentDidMount = async () => {
        this.getSMSPermission()
        const { getDoctor } = this.props
        const phoneNumber = await AsyncStorage.getItem('userToken')
        await getDoctor(phoneNumber)
        // await AsyncStorage.setItem('Doctor', 'true')
    }
    getSMSPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.SEND_SMS,
                {
                    title: 'Mr. Appointment',
                    message:
                        'We need permission to send text message to your patient' +
                        'so they can be notified about their Appointment details',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // DirectSms.sendDirectSms('0935...', 'This is a direct message');
            } else {
                console.log('SMS permission denied');
                this.getSMSPermission()
            }
        }
        catch (err) {
            console.warn(err);
        }
    }
    render() {
        return (
            <View>
                {this.props.doctorData ?
                    <ScrollView >
                        <View style={styles.container} >
                            <View style={styles.profileContainer}>
                                <ImageBackground source={{ uri: this.props.doctorData.drImageUrl }} style={{ width: '100%', height: '100%' }}
                                    resizeMode='cover' >
                                    <View style={{ alignItems: 'flex-end', paddingTop: 20 }} >
                                        <TouchableOpacity style={{ width: '8%', }} onPress={() => this.props.navigation.navigate('UpdateDoctorProfile')} >
                                            <Icons name='pencil' color='white' size={30} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: 'flex-end', flex: 1 }} >
                                        <Text style={{ color: 'white', fontSize: 30 }} >
                                            {this.props.doctorData.drName}
                                        </Text>
                                        <Text style={{ color: 'white', paddingBottom: 40, }} > User ID : '03215582381' </Text>
                                    </View>
                                </ImageBackground>
                            </View>
                            <View style={styles.options} >
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: "15%" }} >
                                        <Icons name='graduation-cap' size={30} />
                                    </View>
                                    <Text width='85%'>
                                        {this.props.doctorData.edu}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.options} >
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '15%', height: '100%' }} >
                                        <Icon name='queue-play-next' size={30} />
                                    </View>
                                    <View style={{ width: '85%', justifyContent: 'center' }} >
                                        <Text>
                                            {this.props.doctorData.clinick}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.options} >
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '15%', height: '100%' }} >
                                        <Icon name='thumb-up' size={30} />
                                    </View>
                                    <View style={{ width: '85%', justifyContent: 'center' }} >
                                        <Text>
                                            {this.props.doctorData.speciality}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.options} >
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{
                                        width: "50%", flexDirection: 'row', borderRightWidth: 3,
                                        borderBottomColor: 'gray',
                                    }}  >
                                        <View style={{ width: "30%", }} >
                                            <Icon name='timer' size={30} />
                                        </View>
                                        <View style={{ width: '70%', justifyContent: 'center' }}>
                                            <Text >
                                                {`${this.props.doctorData.sTime} ${this.props.doctorData.sTimeAM} - ${this.props.doctorData.eTime} ${this.props.doctorData.eTimeAM}`}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ width: "50%", flexDirection: 'row', paddingLeft: 15 }}  >
                                        <View style={{ width: "30%" }} >
                                            <Icons name='money' size={30} />
                                        </View>
                                        <View style={{ width: '70%', justifyContent: 'center' }}>
                                            <Text>
                                                {`Checking Fee Rs. ${this.props.doctorData.fee}`}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.options} >
                                <View style={{ flexDirection: 'row' }} >
                                    <View style={{ width: "15%", justifyContent: 'center' }} >
                                        <Icon name='room' size={30} />
                                    </View>
                                    <View style={{ width: '85%', justifyContent: 'flex-end' }} >
                                        <Text>
                                            {this.props.doctorData.address}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.options} >
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: "15%" }} >
                                        <Icon name='call' size={30} />
                                    </View>
                                    <Text width='85%'>
                                        {this.props.doctorData.phoneNumber}
                                    </Text>
                                </View>
                            </View>
                        </View >
                    </ScrollView >
                    : null
                }
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        doctorData: state.doctorReducer.doctorData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getDoctor,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DoctorProfilesScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 300
    },
    options: {
        height: 80,
        width: '100%',
        borderBottomWidth: 3,
        borderBottomColor: 'gray',
        justifyContent: 'flex-end',
        paddingLeft: 15,
        paddingBottom: 10,
        paddingRight: 45,
    },
    profileContainer: {
        height: '50%', paddingTop: 10, marginBottom: 20,
    },
    nameContainer: { alignItems: 'center', justifyContent: 'flex-end', flex: 1 }
})