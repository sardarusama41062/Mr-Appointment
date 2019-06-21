import React, { Component } from 'react'
import {
    View, Text, StyleSheet, TouchableOpacity, ImageBackground,
    ScrollView, Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icons from 'react-native-vector-icons/FontAwesome'
import AndroidOpenSettings from 'react-native-android-open-settings'
import NetInfo from '@react-native-community/netinfo'

///////// redux coding ////////
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import {
    getUser
} from '../../../actions'
///////////////////////////////

class ProfileScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lname: '',
            fname: '',
            phoneNumber: null,
            isDoctor: false,
        }
    }
    componentDidMount = async () => {
        const phoneNumber = await AsyncStorage.getItem('userToken')
        const { getUser } = this.props;
        await getUser(phoneNumber)
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
    handleDoctor = async () => {
        const { navigation, userData } = this.props
        if (userData.isDoctor) { navigation.navigate('UnderExamination') }
        else { navigation.navigate('DoctorForm') }
    }
    render = () => {
        return (
            <View>
                <ScrollView>
                    {this.props.userData &&
                        <View style={styles.container} >
                            {this.props.userData.acceptedByAdmin && this.props.navigation.navigate('Pro')}
                            <View style={styles.profileContainer}>
                                <ImageBackground source={{ uri: this.props.userData.imageUrl }} style={{ width: '100%', height: '100%' }}
                                    resizeMode='cover' >
                                    <View style={{ alignItems: 'flex-end', paddingTop: 20, paddingRight: 10 }} >
                                        <TouchableOpacity style={{ width: '8%', }}
                                            onPress={() =>
                                                this.state.isConnected ?
                                                    this.props.navigation.navigate('UpdateProfile')
                                                    :
                                                    this.openSettings()
                                            } >
                                            <Icons name='pencil' color='red' size={30} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: 'flex-end', flex: 1 }} >
                                        <Text style={{ color: 'white', fontSize: 30, paddingBottom: 10 }} >
                                            {`${this.props.userData.fname} ${this.props.userData.lname}`}
                                        </Text>
                                        <Text style={{ color: 'white', paddingBottom: 40, }} > {`User ID : ${this.props.userData.phoneNumber}`} </Text>
                                    </View>
                                </ImageBackground>
                            </View>
                            <View style={styles.options} >
                                <TouchableOpacity style={{ flexDirection: 'row' }}>
                                    <View style={{ width: '15%', height: '100%' }} >
                                        <Icons name='map-marker' size={30} />
                                    </View>
                                    <View style={{ width: '85%' }} >
                                        <Text>
                                            {this.props.userData.city}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.options} >
                                <TouchableOpacity style={{ flexDirection: 'row' }} >
                                    <View style={{ width: '15%', height: '100%' }} >
                                        <Icons name='venus-mars' size={30} />
                                    </View>
                                    <View style={{ width: '85%' }} >
                                        <Text>
                                            {this.props.userData.gender}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.options} >
                                <TouchableOpacity style={{ flexDirection: 'row' }}
                                    onPress={() =>
                                        this.state.isConnected ?
                                            this.handleDoctor()
                                            :
                                            this.openSettings()
                                    }
                                >
                                    <View style={{ width: "15%", }} >
                                        <Icons name='medkit' size={30} />
                                    </View>
                                    <Text width='85%'>
                                        Register As A Doctor
                                </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userData: state.signUpReducer.userData,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getUser
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 250
    },
    options: {
        height: 100,
        width: '100%',
        borderBottomWidth: 3,
        borderBottomColor: '#f7c744',
        justifyContent: 'flex-end',
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    profileContainer: {
        paddingTop: 10,
        height: '80%'

    }
})