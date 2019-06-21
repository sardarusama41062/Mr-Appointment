import React, { Component } from 'react';
import { StyleSheet, Picker, Text, View, TouchableHighlight, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { becomeDoctor, removeErr, removeLoc } from '../../../actions/doctorActions';
import MultiSelect from 'react-native-multiple-select';
import AsyncStorage from '@react-native-community/async-storage';

const Gender = [
    'Male',
    'Female'
]
const City = [
    'Faisalabad',
    'Lahore',
    'Karachi',
    'Islamabad',
]
const Time = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', ' 12',
]
const TimeAM = [
    'PM', 'AM'
]

class DrFormScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            speciality: [],
            drName: '',
            edu: [],
            clinick: '',
            pmdc: '',
            fee: null,
            lisenceNo: null,
            address: null,
            gender: 'Male',
            city: 'Faisalabad',
            sTime: 1,
            sTimeAM: 'AM',
            eTime: 1,
            eTimeAM: 'AM',
            error: null,
            indicator: false
        }
        this.items = [
            {
                id: 'Child Specialist',
                name: 'Child Specialist',
            }, {
                id: 'Women Health',
                name: 'Women Health',

            }, {
                id: 'Skin',
                name: 'Skin',

            }, {
                id: 'Bones and Joints',
                name: 'Bones and Joints',

            }, {
                id: 'Ear Nose Throat',
                name: 'Ear Nose Throat',

            }, {
                id: 'Dental Care',
                name: 'Dental Care',

            }, {
                id: 'Eye Specialist',
                name: 'Eye Specialist',

            }, {
                id: 'Digestive Issue',
                name: 'Digestive Issue',

            }, {
                id: 'Physiotherapy',
                name: 'Physiotherapy',

            }, {
                id: 'Dibaties',
                name: 'Dibaties Management',
            }, {
                id: 'Brain and Nerves',
                name: 'Brain and Nerves',

            }, {
                id: 'Kidney and Urinary Issue',
                name: 'Kidney and Urinary Issue',

            }, {
                id: 'Heart Problems',
                name: 'Heart Problems',

            }, {
                id: 'Lungs and Breathing',
                name: 'Lungs and Breathing',

            }, {
                id: 'Cancer',
                name: 'Cancer',

            }, {
                id: 'General Physician',
                name: 'General Physician',

            },
        ];
        this.props.removeErr()
    }
    onSpecialityChange = selectedItems => {
        this.setState({ speciality: selectedItems });
    };
    onPress = async () => {
        const { drName, edu, fee, clinick, speciality, address, gender, city, sTime, sTimeAM, eTime, eTimeAM, pmdc } = this.state;
        const { phoneNumber, imageUrl, clinickLoc } = this.props
        if (
            drName && edu && fee && clinick
            && speciality && address && gender
            && city && sTime && sTimeAM && eTime
            && eTimeAM && clinickLoc && pmdc
        ) {
            const token = await AsyncStorage.getItem('fcmToken')
            const data = {
                imageUrl, drName, edu, fee,
                clinick, speciality, address,
                gender, city, sTime, sTimeAM,
                eTime, eTimeAM, phoneNumber,
                token, clinickLoc, pmdc
            }
            // call redux function ..../////
            this.reduxFormHnadler(data)
        }
        else {
            this.setState({ error: 'All Fields are Required' })
        }
    }
    reduxFormHnadler = async (data) => {
        const { becomeDoctor } = this.props
        Alert.alert(
            'Agrement',
            "I accept that all The Data entered in the form is correct. MR. Appointment is capabal of doing any legal activity if any of the above mentioned entries are wrong.\n \n \u00A9 MR. Appointment",
            [
                {
                    text: 'Cancel',
                    onPress: () => this.props.navigation.goBack(),
                    style: 'cancel',
                },
                {
                    text: 'Accept',
                    onPress: () => {
                        becomeDoctor(data)
                        this.setState({
                            indicator: true
                        })
                    },
                }
            ],
        );

    }
    render = () => {
        const { speciality } = this.state;
        const items = this.items
        this.props.error ? Alert.alert(' Something Not Good, Can not Submit Details ') : null
        this.props.isDoctor ? this.props.navigation.navigate('UnderExamination') : null
        return (
            <View style={{ height: '100%' }} >
                <ScrollView>
                    <View style={styles.container}>
                        <View>
                            <TextInput
                                style={styles.inputFields}
                                onChangeText={(text) => this.setState({ drName: text })}
                                placeholder='Name'
                            />
                            <TextInput
                                style={styles.inputFields}
                                onChangeText={(text) => this.setState({ edu: text })}
                                placeholder='Education'
                            />
                            <TextInput
                                style={styles.inputFields}
                                onChangeText={(text) => this.setState({ clinick: text })}
                                placeholder='Clinick Name'
                            />
                            <TextInput
                                style={styles.inputFields}
                                onChangeText={(text) => this.setState({ pmdc: text })}
                                placeholder='PMDC Number'
                            />
                            <TextInput
                                style={styles.inputFields}
                                onChangeText={(text) => this.setState({ fee: text })}
                                placeholder='Consultation Fee in Rupees'
                            />
                            <View>
                                <MultiSelect
                                    items={items}
                                    uniqueKey="id"
                                    ref={(component) => { this.multiSelect = component }}
                                    onSelectedItemsChange={this.onSpecialityChange}
                                    selectedItems={speciality}
                                    selectText="Specialist of ..."
                                    searchInputPlaceholderText="Search Diseases..."
                                    onChangeInput={(text) => ''}
                                    styleMainWrapper={{ paddingLeft: 10, color: 'red' }}
                                    tagRemoveIconColor="#CCC"
                                    tagBorderColor="#CCC"
                                    tagTextColor="#CCC"
                                    selectedItemTextColor="#CCC"
                                    selectedItemIconColor="#CCC"
                                    itemTextColor="#000"
                                    displayKey="name"
                                    searchInputStyle={{ color: '#CCC' }}
                                    submitButtonColor="blue"
                                    submitButtonText="Submit"
                                />
                            </View>
                            {!this.props.clinickLoc ?
                                <TouchableHighlight style={styles.button} onPress={() => this.props.navigation.navigate('MapLoc')} underlayColor='#99d9f4'>
                                    <Text style={styles.buttonText}>Set Clinick Location</Text>
                                </TouchableHighlight>
                                :
                                <TouchableHighlight style={styles.selectedButton} onPress={() => this.props.navigation.navigate('MapLoc')} underlayColor='#99d9f4'>
                                    <Text style={styles.buttonText}> Change Clinick Location </Text>
                                </TouchableHighlight>
                            }
                            <TextInput
                                style={styles.inputFields}
                                onChangeText={(text) => this.setState({ address: text })}
                                placeholder='Address'
                            />
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 20 }} >
                            <View style={{ width: '40%', marginRight: 20, borderBottomWidth: 1 }} >
                                <Picker
                                    selectedValue={this.state.gender}
                                    style={{ height: 50, }}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ gender: itemValue })
                                    }
                                    mode='dropdown'
                                >
                                    {Gender.map((data, index) => {
                                        return (
                                            <Picker.Item key={index} label={data} value={data} />
                                        )
                                    })}
                                </Picker>
                            </View>
                            <View style={{ width: '50%', marginRight: 20, borderBottomWidth: 1 }} >
                                <Picker
                                    selectedValue={this.state.city}
                                    style={{ height: 50, }}
                                    mode='dropdown'
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ city: itemValue })
                                    }>
                                    {City.map((data, index) => {
                                        return (

                                            <Picker.Item key={index} label={data} value={data} />
                                        )
                                    })}
                                </Picker>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 20 }} >
                            <View style={{ width: '25%', justifyContent: 'center' }} >
                                <Text style={{ fontWeight: 'bold' }} >Start Time :</Text>
                            </View>
                            <View style={{ width: '35%', marginRight: 20, borderBottomWidth: 1 }} >
                                <Picker
                                    selectedValue={this.state.sTime}
                                    style={{ height: 50 }}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ sTime: itemValue })
                                    }
                                    mode='dropdown'
                                >
                                    {Time.map((data, index) => {
                                        return (
                                            <Picker.Item key={index} label={data} value={data} />
                                        )
                                    })}
                                </Picker>
                            </View>
                            <View style={{ width: '30%', borderBottomWidth: 1 }} >
                                <Picker
                                    selectedValue={this.state.sTimeAM}
                                    style={{}}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ sTimeAM: itemValue })
                                    }}
                                    mode='dropdown'
                                >
                                    {TimeAM.map((data, index) => {
                                        return (
                                            <Picker.Item key={index} label={data} value={data} />
                                        )
                                    })}
                                </Picker>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 20 }} >
                            <View style={{ width: '25%', justifyContent: 'center' }} >
                                <Text style={{ fontWeight: 'bold' }} >End Time :</Text>
                            </View>
                            <View style={{ width: '35%', marginRight: 20, borderBottomWidth: 1 }} >
                                <Picker
                                    selectedValue={this.state.eTime}
                                    style={{ height: 50 }}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ eTime: itemValue })
                                    }
                                    mode='dropdown'
                                >
                                    {Time.map((data, index) => {
                                        return (
                                            <Picker.Item key={index} label={data} value={data} />
                                        )
                                    })}
                                </Picker>
                            </View>
                            <View style={{ width: '30%', borderBottomWidth: 1 }} >
                                <Picker
                                    selectedValue={this.state.eTimeAM}
                                    style={{}}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setState({ eTimeAM: itemValue })
                                    }}
                                    mode='dropdown'
                                >
                                    {TimeAM.map((data, index) => {
                                        return (
                                            <Picker.Item key={index} label={data} value={data} />
                                        )
                                    })}
                                </Picker>
                            </View>
                        </View>
                        <View>
                            <Text style={{ color: 'red', marginBottom: 20, alignItems: 'center' }}  >{this.state.error}</Text>
                        </View>
                        <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableHighlight>
                        {this.state.indicator ?
                            <ActivityIndicator size="large" color="#0000ff" />
                            : null
                        }
                    </View>
                </ScrollView>
            </View >
        );
    }
    componentWillUnmount() {
        this.props.removeLoc()
    }
}

const mapStateToProps = (state) => {
    return {
        phoneNumber: state.signUpReducer.userData.phoneNumber,
        isDoctor: state.signUpReducer.userData.isDoctor,
        imageUrl: state.signUpReducer.userData.imageUrl,
        error: state.doctorReducer.error,
        clinickLoc: state.doctorReducer.clinickLoc,

    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        becomeDoctor, removeErr, removeLoc
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DrFormScreen);


var styles = StyleSheet.create({
    container: {
        marginTop: 10,
        padding: 20,
        flex: 1
    },
    inputFields: {
        height: 50, borderColor: 'gray', borderBottomWidth: 1, marginBottom: 20
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        height: 36,
        backgroundColor: '#f7c744',
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    selectedButton: {
        height: 36,
        backgroundColor: '#f7c744',
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    }
});