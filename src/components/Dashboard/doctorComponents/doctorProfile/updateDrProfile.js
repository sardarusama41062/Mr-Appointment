import React, { Component } from 'react'
import { StyleSheet, Picker, Text, View, TouchableHighlight, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import AsyncStorage from '@react-native-community/async-storage';

///////// redux coding ////////
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { updateDrProfile, removeErr, removeUpdated } from '../../../../actions/doctorActions'
///////////////////////////////

import UploadImage from '../../../SigunUpComponent/UploadImage'

const Time = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', ' 12',
]
const TimeAM = [
    'PM', 'AM'
]

class UpdateDoctorProfileScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            speciality: [],
            drName: '',
            edu: [],
            fee: null,
            sTime: null,
            sTimeAM: 'PM',
            eTime: null,
            eTimeAM: 'PM',
            error: null,
            indicator: false,
            phoneNumber: ''
        }
        this.items = [
            {
                id: '92iijs7yta',
                name: 'Ondo',
            }, {
                id: 'a0s0a8ssbsd',
                name: 'Ogun',
            }, {
                id: '16hbajsabsd',
                name: 'Calabar',
            }, {
                id: 'nahs75a5sg',
                name: 'Lagos',
            }, {
                id: '667atsas',
                name: 'Maiduguri',
            }, {
                id: 'hsyasajs',
                name: 'Anambra',
            }, {
                id: 'djsjudksjd',
                name: 'Benue',
            }, {
                id: 'sdhyaysdj',
                name: 'Kaduna',
            }, {
                id: 'suudydjsjd',
                name: 'Abuja',
            }];
        this.props.removeErr()
    }
    onSpecialityChange = selectedItems => {
        this.setState({ speciality: selectedItems });
    };
    onPress = async () => {
        const { drName, edu, fee, speciality, sTime, sTimeAM, eTime, eTimeAM, phoneNumber } = this.state;
        if (drName && edu && fee && speciality && sTime && sTimeAM && eTime && eTimeAM) {
            const token = await AsyncStorage.getItem('fcmToken')
            const { uploadImage } = this.props
            const data = { uploadImage, drName, edu, fee, speciality, sTime, sTimeAM, eTime, eTimeAM, phoneNumber, token }
            // call redux function ..../////
            this.reduxFormHnadler(data)
        }
        else {
            this.setState({ error: 'All Fields are Required' })
        }
    }
    reduxFormHnadler = async (data) => {
        const { updateDrProfile } = this.props
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
                        updateDrProfile(data)
                        this.setState({
                            indicator: true
                        })
                    },
                }
            ],
        );

    }
    componentDidMount() {
        const { speciality, drName, edu, fee, sTime, sTimeAM, eTime, eTimeAM, error, indicator, phoneNumber } = this.props.doctorData
        this.setState({
            speciality, drName, edu, fee, sTime, sTimeAM, eTime, eTimeAM, error, indicator, phoneNumber
        })
    }
    componentWillUnmount() {
        this.props.removeUpdated()
    }
    render = () => {
        const { speciality, drName, edu, fee, sTime, sTimeAM, eTime, eTimeAM } = this.state;
        const items = this.items
        this.props.error ? Alert.alert(' Something Not Good, Can not Submit Details ') : null
        this.props.updated ? this.props.navigation.popToTop() : null
        return (
            <View style={{ height: '100%' }} >
                <ScrollView>
                    <View style={styles.container}>
                        <UploadImage />
                        <View>
                            <TextInput
                                style={styles.inputFields}
                                onChangeText={(text) => this.setState({ drName: text })}
                                value={drName}
                            />
                            <TextInput
                                style={styles.inputFields}
                                onChangeText={(text) => this.setState({ edu: text })}
                                value={edu}
                            />
                            <TextInput
                                style={styles.inputFields}
                                onChangeText={(text) => this.setState({ fee: text })}
                                value={fee}
                            />
                            <View>
                                <MultiSelect
                                    items={items}
                                    uniqueKey="id"
                                    ref={(component) => { this.multiSelect = component }}
                                    onSelectedItemsChange={this.onSpecialityChange}
                                    selectedItems={speciality}
                                    selectText="Speciality"
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
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 20 }} >
                            <View style={{ width: '25%', justifyContent: 'center' }} >
                                <Text style={{ fontWeight: 'bold' }} >Start Time :</Text>
                            </View>
                            <View style={{ width: '35%', marginRight: 20, borderBottomWidth: 1 }} >
                                <Picker
                                    selectedValue={sTime}
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
                                    selectedValue={sTimeAM}
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
                                    selectedValue={eTime}
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
                                    selectedValue={eTimeAM}
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
}

const mapStateToProps = (state) => {
    return {
        phoneNumber: state.signUpReducer.phoneNumber,
        doctorData: state.doctorReducer.doctorData,
        error: state.doctorReducer.error,
        updated: state.doctorReducer.updated,
        uploadImage: state.signUpReducer.uploadImage,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        updateDrProfile, removeErr, removeUpdated
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateDoctorProfileScreen);

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
    }
});