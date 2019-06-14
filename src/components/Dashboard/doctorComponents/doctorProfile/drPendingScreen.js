import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Button, Alert } from 'react-native'

///////// redux coding ////////
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getPendingAppointments, removePendingAppointments } from '../../../../actions/doctorActions'

///////////////////////////////
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
    render() {
        return (
            <ScrollView>
                <View style={{ padding: 10, paddingBottom: 100 }} >
                    {this.props.pending ?
                        <View>
                            {this.props.pending.map((data, index) => {
                                return (
                                    <View>
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
                                        <View style={{ width: '100%' }} >
                                            <Button onPress={() => this.handleSubmit(data)} title='Patient Received?' />
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                        :
                        <Text>Sorry, No Pending Appoinemnts</Text>
                    }
                </View>
            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        phoneNumber: state.doctorReducer.doctorData.phoneNumber,
        pending: state.doctorReducer.pending
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getPendingAppointments, removePendingAppointments
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