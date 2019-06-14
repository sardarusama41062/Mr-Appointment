import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
const img = require('../../../assests/img.png')

///////// redux coding ////////
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import {
    getPendingAppointments
} from '../../../actions/userActions'
///////////////////////////////

class PendingScreen extends Component {
    componentDidMount() {
        const { getPendingAppointments, phoneNumber } = this.props
        getPendingAppointments(phoneNumber)
    }
    render() {
        return (
            <ScrollView>
                <View style={{ padding: 10, paddingBottom: 100 }} >
                    {this.props.pending ?
                        <View>
                            {this.props.pending.map((data, index) => {
                                return (
                                    <View key={index} style={styles.container} >
                                        <View style={styles.imgContainer} >
                                            <Image source={img} style={{
                                                height: 80, width: 80,
                                                borderWidth: 1, borderRadius: 100,
                                            }} />
                                        </View>
                                        <View style={styles.textContainer} >
                                            <Text>
                                                DR. Name : {data.drName}
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
                                    </View>
                                )
                            })}
                        </View>
                        :
                        <Text>Sorry, No Pending Appointments yet</Text>
                    }
                </View>
            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        phoneNumber: state.signUpReducer.userData.phoneNumber,
        pending: state.userReducer.pending
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getPendingAppointments
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PendingScreen);

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