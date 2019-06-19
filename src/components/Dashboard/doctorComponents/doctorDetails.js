import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Alert, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/FontAwesome';
import { Rating } from 'react-native-elements';

///////// redux coding ////////
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { bookAppointment, getSentRequests, getDoctorDetails } from '../../../actions/userActions'
import AsyncStorage from '@react-native-community/async-storage';

///////////////////////////////

class DoctorDetailsScreen extends Component {
    state = {
        status: true,
        bookingStatus: 'book',
    }
    componentDidMount = () => {
        var { userData, getSentRequests, sentRequests, getDoctorDetails, navigation } = this.props
        const { phoneNumber } = userData
        getSentRequests(phoneNumber)
        const drId = navigation.getParam('drId', 'drId')
        if (sentRequests) {
            sentRequests.filter((item) => {
                if (item.drId === drId) {
                    this.setState({
                        bookingStatus: item.status
                    })
                }
            })
        }
        getDoctorDetails(drId)
    }
    handleBooking = async () => {
        if (this.props.doctorDetails.onlineState) {
            const userToken = await AsyncStorage.getItem('fcmToken')
            const { phoneNumber, fname, lname, imageUrl } = this.props.userData
            const { token } = this.props.doctorDetails

            const drId = this.props.navigation.getParam('drId', 'drId')
            const DateNTime = new Date
            const data = {
                userId: phoneNumber,
                drId,
                drToken: token, userToken, imageUrl,
                userName: `${fname}  ${lname}`,
                date: DateNTime.toLocaleDateString(),
                time: DateNTime.toLocaleTimeString()
            }
            this.setState({
                bookingStatus: 'booking'
            })
            this.props.bookAppointment(data)
        }
        else {
            Alert.alert('Doctor is Currently Offline')
        }
    }
    render() {
        this.props.bookingErr ? Alert.alert('Something not Good, Cannot Book Appointment Yet') : null
        this.props.doctorDetailsErr ? Alert.alert('Something not Good, Cannot Get Doctor Details') : null
        return (
            <View>
                <ScrollView >
                    {this.props.doctorDetails ?
                        <View style={styles.container}>
                            <View style={styles.profileContainer}>
                                <ImageBackground source={{ uri: this.props.doctorDetails.drImageUrl }} style={{ width: '100%', height: '100%' }}
                                    resizeMode='cover' >
                                    <View style={styles.nameContainer} >
                                        <Text style={{ color: 'white', fontSize: 30 }} >
                                            {this.props.doctorDetails.drName}
                                        </Text>
                                    </View>

                                </ImageBackground>
                            </View>
                            <View style={{ marginBottom: 20 }} >
                                <Rating
                                    type='star'
                                    imageSize={20}
                                    readonly
                                    startingValue={this.props.doctorDetails.finalRating}
                                />
                            </View>
                            {this.state.bookingStatus === 'book' ?
                                <TouchableOpacity
                                    onPress={() => this.handleBooking()}
                                >
                                    <View
                                        style={
                                            this.props.doctorDetails.onlineState ?
                                                [styles.bookContainer, styles.onlineState]
                                                :
                                                [styles.bookContainer, styles.offlineState]
                                        } >
                                        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }} >
                                            Book
                                    </Text>
                                    </View>
                                </TouchableOpacity>
                                :
                                <View
                                    style={[styles.bookContainer, styles.bookedState]} >
                                    {this.state.bookingStatus === 'booked' ?
                                        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }} >
                                            Booked
                                        </Text>
                                        :
                                        <View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text width='80%' style={{ color: 'white', fontSize: 20, fontWeight: 'bold', alignItems: 'flex-end', marginRight: 25 }}>
                                                    Booking
                                                </Text>
                                                <View style={{ width: "10%", justifyContent: 'flex-end', alignItems: 'center' }} >
                                                    <ActivityIndicator size='large' color='white' />
                                                </View>
                                            </View>
                                        </View>
                                    }
                                </View>
                            }
                            <View style={styles.options} >
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: "15%" }} >
                                        <Icons name='graduation-cap' size={30} />
                                    </View>
                                    <Text width='85%'>
                                        ‏‏‏‏‏‏{this.props.doctorDetails.edu}
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
                                            {this.props.doctorDetails.clinick}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.options} >
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '15%', height: '100%' }} >
                                        <Icon name='thumb-up' size={30} />
                                    </View>
                                    <View style={{ width: '85%', justifyContent: 'center', flexDirection: 'row' }} >
                                        {this.props.doctorDetails.speciality.map((data, key) => {
                                            return (
                                                <Text key={key} style={{ color: 'rgb(3,155,229)', marginRight: 5 }} >
                                                    {data}
                                                </Text>
                                            )
                                        })}
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
                                                {this.props.doctorDetails.sTime} {this.props.doctorDetails.sTimeAM} -
                                                {this.props.doctorDetails.eTime} {this.props.doctorDetails.eTimeAM}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ width: "50%", flexDirection: 'row', paddingLeft: 15 }}  >
                                        <View style={{ width: "30%" }} >
                                            <Icons name='money' size={30} />
                                        </View>
                                        <View style={{ width: '70%', justifyContent: 'center' }}>
                                            <Text>
                                                Checking Fee Rs. {this.props.doctorDetails.fee}
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
                                            {this.props.doctorDetails.address}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        :
                        <View style={{ justifyContent: 'center', }} >
                            <ActivityIndicator size='large' />
                        </View>
                    }
                </ScrollView >
            </View >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userData: state.signUpReducer.userData,
        bookingErr: state.userReducer.bookingErr,
        sentRequests: state.userReducer.sentRequests,
        doctorDetails: state.userReducer.doctorDetails,
        doctorDetailsErr: state.userReducer.doctorDetailsErr,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        bookAppointment, getSentRequests, getDoctorDetails
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DoctorDetailsScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 300
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
        height: '40%',
        paddingTop: 10,
        marginBottom: 20,
    },
    bookContainer: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    offlineState: {
        backgroundColor: 'red'
    },
    onlineState: {
        backgroundColor: 'green'
    },
    bookedState: {
        backgroundColor: '#2b72e5'
    },
    nameContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1
    }
})