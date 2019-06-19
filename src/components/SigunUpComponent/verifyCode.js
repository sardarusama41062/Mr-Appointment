import React, { Component } from 'react';
import {
    View, Text, Button, TextInput, StyleSheet,
    ActivityIndicator, TouchableOpacity, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    conformCode, cancleConfirmREsult,
    invalid_codeFun, indicatorFun, disableIndicatorFun,
    signInWithPhone
} from '../../actions';

class VerifCodeInput extends Component {
    state = {
        codeInput: '',
        indicator: false,
        error: false,
        resend: false
    };
    componentDidMount() {
        this.props.disableIndicatorFun();
        setTimeout(() => {
            this.setState({
                resend: true
            })
        }, 10000);
    }
    confirmCode = () => {
        const { codeInput } = this.state;
        const { confirmResult } = this.props
        // const { confirmResult, phoneNumber, userExist } = this.props
        if (codeInput) {
            if (codeInput.length == 6) {
                this.setState({ error: false })
                this.props.indicatorFun()
                this.props.conformCode(confirmResult, codeInput)
                // this.props.conformCode(confirmResult, codeInput, phoneNumber, userExist)
            } else {
                this.setState({ error: true })
            }
        }
    };
    _signInAsync = () => {
        const { userExist, phoneNumber } = this.props
        if (userExist) {
            AsyncStorage.setItem('userToken', phoneNumber);
        }
        this.props.navigation.navigate(!userExist ? 'Forms' : 'App');
        return (
            <View>
            </View>
        )
    };
    indicator() {
        const { indicator } = this.props;
        if (indicator) {
            return (
                <ActivityIndicator size="large" color="#3570dd" />
            )
        }
    }
    signIn = () => {
        const { signInWithPhone, phoneNumber } = this.props;
        signInWithPhone(phoneNumber);
    }

    render() {
        const { codeInput } = this.state;
        return (
            <ScrollView style={styles.container} >
                <View  >
                    <View style={{ marginTop: 25, padding: 25 }}>
                        <Text style={{ fontWeight: 'bold' }}>
                            Enter verification code below:
                        </Text>
                        <View style={{ alignItems: 'center' }} >
                            <TextInput
                                autoFocus
                                // placeholderTextColor='rgba(255, 255, 255, 0.8)'
                                style={styles.conformBtn}
                                onChangeText={value => this.setState({ codeInput: value })}
                                placeholder={'Code ... '}
                                value={codeInput}
                                keyboardType='number-pad'
                                returnKeyType='next'
                                returnKeyLabel='done'
                                maxLength={6}
                            />
                        </View>
                        <View style={styles.signInBtn}>
                            {this.state.error ?
                                <Text style={styles.invalid_code} > Incorrect Code </Text>
                                : null
                            }
                            <Text style={styles.invalid_code} > {this.props.invalid_code} </Text>
                            <Button title="Confirm Code"
                                // color="#f7c744"
                                onPress={() => this.confirmCode()}
                            />
                        </View>

                        {this.state.resend ?
                            <View>
                                <TouchableOpacity onPress={() => { this.signIn() }} >
                                    <Text style={styles.invalid_code} > Resend Verificaton Code? </Text>
                                </TouchableOpacity>
                            </View>
                            : null
                        }
                    </View>
                    {this.props.user && this._signInAsync()}
                    {this.indicator()}
                </View>
            </ScrollView>
        )
    }
    componentWillUnmount() {
        this.props.cancleConfirmREsult()
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        user: state.signUpReducer.user,
        confirmResult: state.signUpReducer.confirmResult,
        phoneNumber: state.signUpReducer.phoneNumber,
        userExist: state.signUpReducer.userExist,
        invalid_code: state.signUpReducer.invalid_code,
        indicator: state.signUpReducer.indicator,
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        conformCode,
        cancleConfirmREsult, invalid_codeFun,
        indicatorFun, disableIndicatorFun,
        signInWithPhone
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifCodeInput);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f7f8f9',
        flex: 1,
        // color: 'white'
    },
    input: {
        marginVertical: 20,
        flexDirection: 'row',
        borderBottomColor: '#3570dd', borderBottomWidth: 1
    },
    inputStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingRight: 5,
        paddingLeft: 35,
        fontSize: 18,
        lineHeight: 23,
        flex: 4,
    },
    invalid_code: {
        color: '#3570dd',
        fontSize: 15,
        padding: 10
    },
    signInBtn: {
        paddingVertical: 15,
        marginTop: 50
    },
    conformBtn: {
        height: 70,
        marginTop: 35,
        // color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#3570dd'
    }
})