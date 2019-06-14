import React, { Component } from 'react';
import {
    StyleSheet, Text, View,
    ScrollView, ActivityIndicator,
    TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { updateUserForm, resetUpdatedUser } from '../../../actions/userActions'
import { indicatorFun, disableIndicatorFun } from '../../../actions'
import AsyncStorage from '@react-native-community/async-storage';
import UploadImage from '../../SigunUpComponent/UploadImage'
import { TextInput, HelperText, List, Button, Drawer } from 'react-native-paper';

const City = [
    'Faisalabad',
    'Lahore',
    'Karachi',
    'Islamabad',
    'Faisalabad',
    'Lahore',
    'Karachi',
    'Islamabad',
    'Faisalabad',
    'Lahore',
    'Karachi',
    'Islamabad',
]

class UpdateProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            indicator: false,
            fname: '',
            fnameErr: false,
            lname: '',
            lnameErr: false,
            gender: 'Male',
            city: 'Faisalabad',
            photoErr: false,
            Cityexpanded: false
        }
    }

    onSubmit = async () => {
        const { fname, lname, city, gender } = this.state
        if (!fname && !lname) {
            this.setState({
                fnameErr: true,
                lnameErr: true,
            })
        }
        else {
            const value = { fname, lname, city, gender }
            const token = await AsyncStorage.getItem('fcmToken')
            const { phoneNumber, updateUserForm, indicatorFun, uploadImage } = this.props;
            indicatorFun()
            await updateUserForm(value, phoneNumber, token, uploadImage)
        }
    }
    indicator() {
        const { indicator } = this.props;
        if (indicator) {
            return (
                <ActivityIndicator size="small" color="#00ff00" />
            )
        }
    }
    componentDidMount() {
        const { lname, fname, gender, city } = this.props.userData
        this.setState({ lname, fname, gender, city })
    }

    navFun = () => {
        this.props.disableIndicatorFun()
        this.props.resetUpdatedUser()
        this.props.navigation.popToTop()
    }

    render = () => {
        const { updatedUserFailed, updatedUser } = this.props;

        return (
            <View style={{ backgroundColor: '#f7f8f9', height: '100%', flex: 1 }} >
                {updatedUser && this.navFun()}
                <ScrollView>
                    <View style={styles.container}>
                        <View style={{ alignItems: 'center' }} >
                            <HelperText
                                type="error"
                                visible={this.state.photoErr}
                            >
                                Please Select A Photo
                </HelperText>
                        </View>
                        <UploadImage />
                        <View>
                            <View>
                                <TextInput
                                    label='First Name'
                                    value={this.state.fname}
                                    onChangeText={fname => {
                                        this.setState({ fname, fnameErr: false })
                                    }}
                                    mode='outlined'
                                    onBlur={() => !this.state.fname && this.setState({ fnameErr: true })}
                                />
                                <HelperText
                                    type="info"
                                    visible={this.state.fnameErr}
                                >
                                    This Field is required
                </HelperText>
                            </View>
                            <View>
                                <TextInput
                                    label='Last Name'
                                    value={this.state.lname}
                                    onChangeText={lname => {
                                        this.setState({ lname, lnameErr: false })
                                    }}
                                    mode='outlined'
                                    onBlur={() => !this.state.fname && this.setState({ lnameErr: true })}
                                />
                                <HelperText
                                    type="info"
                                    visible={this.state.lnameErr}
                                >
                                    This Field is required
                </HelperText>
                            </View>
                            <View>
                                <List.Section title="Gender">
                                    <List.Accordion
                                        title={this.state.gender}
                                        expanded={this.state.expanded}
                                        onPress={() => this.setState({ expanded: true })}
                                    >
                                        <Button mode="outlined" style={{ marginBottom: 4 }} onPress={() => this.setState({ gender: 'Male', expanded: false })} > Male </Button>
                                        <Button mode='outlined' onPress={() => this.setState({ gender: 'Female', expanded: false })} > Female </Button>
                                    </List.Accordion>
                                </List.Section>
                            </View>
                            <View>
                                <List.Section title="City">
                                    <List.Accordion
                                        title={this.state.city}
                                        expanded={this.state.Cityexpanded}
                                        onPress={() => this.setState({ Cityexpanded: true })}
                                    >
                                        <ScrollView horizontal>
                                            {City.map((data, key) => {
                                                return (
                                                    <TouchableWithoutFeedback>
                                                        <Drawer.Item
                                                            key={key}
                                                            label={data}
                                                            active={this.state.city === data}
                                                            onPress={() => {
                                                                this.setState({ city: data, Cityexpanded: false })

                                                            }}
                                                        />
                                                    </TouchableWithoutFeedback>
                                                )
                                            })}
                                        </ScrollView>
                                    </List.Accordion>
                                </List.Section>
                            </View>
                        </View>
                        <Button mode='contained' onPress={() => this.onSubmit()}>
                            Submit
            </Button>
                        {updatedUserFailed ?
                            <View>
                                {this.props.disableIndicatorFun()}
                                <Text> Can not Submit Details </Text>
                            </View>
                            : null
                        }
                    </View>
                    {this.indicator()}
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        phoneNumber: state.signUpReducer.phoneNumber,
        updatedUser: state.userReducer.updatedUser,
        updatedUserFailed: state.userReducer.updatedUserFailed,
        indicator: state.signUpReducer.indicator,
        userData: state.signUpReducer.userData
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        updateUserForm, indicatorFun, disableIndicatorFun, resetUpdatedUser
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);


var styles = StyleSheet.create({
    container: {
        marginTop: 50,
        padding: 20,
        flex: 1
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