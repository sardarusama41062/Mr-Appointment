import React, { Component } from 'react'
import {
    View, Text, StyleSheet, ScrollView,
    Image, TouchableOpacity, Button, TextInput, ToastAndroid
} from 'react-native'
import Modal from 'react-native-modalbox';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment'
import SendSMS from 'react-native-sms-x';
///////// redux coding ////////
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getRequests, postAppointment } from '../../../../../actions/doctorActions'
///////////////////////////////

const img = require('../../../../../assests/no_data_found.png')


class AppointmentRequestsScreen extends Component {

    constructor() {
        super();
        this.state = {
            isOpen: true,
            isDisabled: false,
            swipeToClose: true,
            data: null,
            isDateTimePickerVisible: false,
            selectedTime: null,
            token: null,
            isModelOpen: false
        };
    }
    componentDidMount = async () => {
        const { phoneNumber, getRequests } = this.props
        await getRequests(phoneNumber)
    }
    openModel = (data) => {
        this.setState({ data, isModelOpen: true })
    }
    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };
    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };
    handleTimePick = date => {
        const time = moment(date).format('hh:mm a')
        this.setState({
            selectedTime: time
        })
        this.hideDateTimePicker();
    };
    handleSubmit = () => {
        this.setState({
            token: null,
            selectedTime: null,
            isModelOpen: false
        })
        const { drName, drImageUrl } = this.props.doctorData
        const { data, token, selectedTime } = this.state
        const { userId } = data
        SendSMS.send('Message sent', userId,
            `Your Appointment Request Have Been Accepted by Dr. ${drName}\n at ${selectedTime}\n Token # ${token} `,
            (msg) => {
                const myMsg = JSON.stringify(msg)
                ToastAndroid.show(myMsg, ToastAndroid.SHORT);
            }
        );
        this.props.postAppointment(data, token, selectedTime, drName, drImageUrl)

    }
    onModelClose() {
        this.setState({
            isModelOpen: false
        })
    }
    render() {
        return (
            <View style={{ padding: 10, flex: 1 }} >
                <ScrollView>
                    {this.props.requests ?
                        <View>
                            <View style={{ backgroundColor: 'rgb(23, 159, 73)', padding: 5, alignItems: 'center' }} >
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }} >
                                    Assign Appointments to Patients.
                                </Text>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }} >
                                    Choose Token # and Time wisely
                                </Text>
                            </View>
                            {this.props.requests.map((data, index) => {
                                return (
                                    <View key={index} >
                                        <TouchableOpacity key={index} style={styles.container}
                                            onPress={() => this.openModel(data)}
                                        >
                                            <View style={styles.imgContainer} >
                                                <Image source={{ uri: data.imageUrl }} style={{
                                                    height: 80, width: 80,
                                                    borderWidth: 1, borderRadius: 100,
                                                }} />
                                            </View>
                                            <View style={styles.textContainer} >
                                                <Text>
                                                    Name : {data.userName}
                                                </Text>
                                                <View style={{ flexDirection: 'row' }} >
                                                    <Text width='45%' style={{ marginRight: 10 }} >
                                                        Date : {data.date}
                                                    </Text>
                                                    <Text width='50%'>
                                                        Time : {data.time}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                )
                            })}
                        </View>
                        :
                        <View style={{ flex: 1 }} >
                            <Text>
                                Sorry! No Request Yet.
                            </Text>
                            <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }} >
                                <Image source={img} width='75%' height='100%' />
                            </View>
                        </View>
                    }

                </ScrollView>
                <Modal
                    ref={"modal"}
                    style={{ height: 400 }}
                    position='top'
                    isOpen={this.state.isModelOpen}
                    backdropPressToClose={false}
                    onClosed={() => this.onModelClose()}
                >
                    {this.state.data ?
                        <View style={styles.modelContainer} >
                            <Text style={styles.text}  >Patient Name : {this.state.data.userName}</Text>
                            <Text style={styles.text} >Appointment Date: {this.state.data.date} </Text>
                            <TextInput style={styles.input} value={this.state.token} placeholder='Token #' keyboardType='numeric' autoFocus={true} onChangeText={(token) => { this.setState({ token }) }} />

                            <View style={{ marginBottom: 10, }} >
                                <Button title="Select Time" onPress={this.showDateTimePicker} />
                            </View>
                            <Text style={styles.text} >{this.state.selectedTime}</Text>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this.handleTimePick}
                                onCancel={this.hideDateTimePicker}
                                is24Hour={false}
                                mode='time'
                                style={styles.submitBtn}
                            />
                            {
                                this.state.token && this.state.selectedTime ?
                                    <View style={{ width: '100%', marginBottom: 20 }} >
                                        <Button title='Submit' onPress={() => this.handleSubmit()} />
                                    </View>
                                    : null
                            }
                        </View>
                        :
                        null
                    }
                </Modal>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        phoneNumber: state.doctorReducer.doctorData.phoneNumber,
        requests: state.doctorReducer.requests,
        doctorData: state.doctorReducer.doctorData
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getRequests, postAppointment
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentRequestsScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 2,
        paddingVertical: 20,
    },
    imgContainer: {
        width: '30%',
        justifyContent: 'center'
    },
    textContainer: {
        width: '70%',
        justifyContent: 'center'
    },
    modelContainer: {
        padding: 15,
        marginTop: 20,
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'blue',
        borderRadius: 5,
        marginBottom: 15,
        width: 50
    },
    submitBtn: {
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: 'blue',
        height: 40,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 10 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,

    }
})