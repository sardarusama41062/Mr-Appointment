import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from 'react-native'
import Icons from 'react-native-vector-icons/FontAwesome';
const img = require('../../../../assests/img.png')

///////// redux coding ////////
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getDoctor } from '../../../../actions/doctorActions'

///////////////////////////////
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';

class DoctorHomeScreen extends Component {
    componentDidMount = async () => {
        const { getDoctor, getUserRating } = this.props
        const phoneNumber = await AsyncStorage.getItem('userToken')
        await getDoctor(phoneNumber)
        await getUserRating(phoneNumber)
        debugger
        await AsyncStorage.setItem('Doctor', 'true')
    }
    render() {
        return (
            <ScrollView >
                {this.props.doctorData &&
                    <View style={styles.container} >
                        <View style={styles.profileContainer}>
                            <ImageBackground
                                key={this.props.doctorData.drImageUrl}
                                source={{ uri: this.props.doctorData.drImageUrl, cache: 'reload' }} style={{ width: '100%', height: '100%' }}
                                resizeMode='cover' >
                                <View style={{ alignItems: 'flex-end', paddingTop: 20 }} >
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'flex-end', flex: 1 }} >
                                    <Text style={{ color: 'white', fontSize: 30 }} >
                                        {this.props.doctorData.drName}
                                    </Text>
                                    <Text style={{ color: 'white', paddingBottom: 40, }} > {`User ID : ${this.props.doctorData.phoneNumber}`} </Text>
                                </View>
                            </ImageBackground>
                        </View>
                        <View style={styles.options} >
                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.props.navigation.navigate('DrSummary')} >
                                <View style={{ width: '15%', height: '100%' }} >
                                    <Icons name='history' size={30} />
                                </View>
                                <View style={{ width: '85%' }} >
                                    <Text>
                                        Summary
                            </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.options} >
                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.props.navigation.navigate('DrPending')} >
                                <View style={{ width: '15%', height: '100%' }} >
                                    <Icons name='copy' size={30} />
                                </View>
                                <View style={{ width: '85%' }} >
                                    <Text>
                                        Pending Appointments
                            </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.options} >
                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.props.navigation.navigate('Requests')} >
                                <View style={{ width: '15%', height: '100%' }} >
                                    <Icons name='bell' size={30} />
                                </View>
                                <View style={{ width: '85%' }} >
                                    <Text>
                                        Appointment Requests
                            </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View >
                }
            </ScrollView >
        )
    }
}

const mapStateToProps = (state) => {
    console.log(state.doctorReducer.doctorData)
    return {
        doctorData: state.doctorReducer.doctorData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getDoctor, getUserRating
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DoctorHomeScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 400,
        height: '100%'
    },
    profileContainer: {
        paddingTop: 10, marginBottom: 20, height: '100%'
    },
    nameContainer: { alignItems: 'center', justifyContent: 'flex-end', flex: 1 },

    options: {
        height: 100,
        width: '100%',
        borderBottomWidth: 3,
        justifyContent: 'flex-end',
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
})