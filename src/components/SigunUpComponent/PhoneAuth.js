import React, { Component } from 'react';
import {
  View, Button, Text, TextInput,
  StyleSheet, Picker, ActivityIndicator,
  KeyboardAvoidingView, TouchableWithoutFeedback,
  Keyboard
} from 'react-native';


import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import {
  signInWithPhone, indicatorFun, checkUserExist, invalid_phonenoFun
} from '../../actions'

class PhoneAuth extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      message: '',
      phoneNumber: '',
      indicator: false,
      error: false,
    };
  }
  static navigationOptions = {
    header: null
  }

  signIn = async () => {
    const { phoneNumber } = this.state;
    if (phoneNumber.length == 10) {
      this.props.indicatorFun()
      const completePhnNumber = "+92" + phoneNumber;
      this.props.checkUserExist(completePhnNumber)
      await this.props.signInWithPhone(completePhnNumber);
    }
    else {
      this.setState({ error: true })
    }
  };
  renderPhoneNumberInput() {
    return (
      <View style={{ padding: 25, }}>
        <Text style={{}}>Enter phone number:</Text>
        <KeyboardAvoidingView behavior='padding' >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            <View>
              <View style={styles.input} >
                <View style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)', }}>
                  <Picker style={{ width: 95 }} >
                    <Picker.Item label="+92" value="+92" />
                  </Picker>
                </View>
                <TextInput
                  autoFocus
                  style={styles.inputStyle}
                  onChangeText={value => this.setState({ phoneNumber: value })}
                  keyboardType='number-pad'
                  returnKeyType='next'
                  returnKeyLabel='done'
                  placeholder={'Phone Number ... '}
                  // placeholderTextColor='rgba(255, 255, 255, 0.8)'
                  // value={phoneNumber}
                  blurOnSubmit={true}
                  maxLength={10}
                />
              </View>
              {this.state.error ?
                <Text style={styles.invalid_phoneno} > IInvalid Phone Number </Text>
                : null
              }
              <Text style={styles.invalid_phoneno} > {this.props.invalid_phoneno} </Text>
              <View style={{ marginTop: 20 }} >
                <Button title="Sign In" style={styles.signInBtn}
                  // color="#f7c744"
                  onPress={() => this.signIn()} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    );
  }
  indicator() {
    const { indicator } = this.props;
    if (indicator) {
      return (
        <ActivityIndicator size="small" color="#3570dd" />
      )
    }
  }
  render() {
    const { confirmResult } = this.props
    if (confirmResult) {
      this.props.navigation.navigate('VerifyCodeInputScreen')
    }
    return (
      < View style={styles.container} >
        {/* {this.renderPhoneNumberInput()} */}
        <View style={{ padding: 25, }}>
          <Text style={{}}>Enter phone number:</Text>
          <KeyboardAvoidingView behavior='padding' >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
              <View>
                <View style={styles.input} >
                  <View style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)', }}>
                    <Picker style={{ width: 95 }} >
                      <Picker.Item label="+92" value="+92" />
                    </Picker>
                  </View>
                  <TextInput
                    autoFocus
                    style={styles.inputStyle}
                    onChangeText={value => this.setState({ phoneNumber: value })}
                    keyboardType='number-pad'
                    returnKeyType='next'
                    returnKeyLabel='done'
                    placeholder={'Phone Number ... '}
                    // placeholderTextColor='rgba(255, 255, 255, 0.8)'
                    // value={phoneNumber}
                    blurOnSubmit={true}
                    maxLength={10}
                  />
                </View>
                {this.state.error ?
                  <Text style={styles.invalid_phoneno} > IInvalid Phone Number </Text>
                  : null
                }
                <Text style={styles.invalid_phoneno} > {this.props.invalid_phoneno} </Text>
                <View style={{ marginTop: 20 }} >
                  <Button title="Sign In" style={styles.signInBtn}
                    // color="#f7c744"
                    onPress={() => this.signIn()} />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
        {this.indicator()}
      </View >
    );
  }
}
const mapStateToProps = (state) => {
  console.log(state)
  return {
    confirmResult: state.signUpReducer.confirmResult,
    indicator: state.signUpReducer.indicator,
    invalid_phoneno: state.signUpReducer.invalid_phoneno
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    signInWithPhone, indicatorFun,
    checkUserExist, invalid_phonenoFun
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PhoneAuth);

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'rgb(32, 57, 70)',
    backgroundColor: '#f7f8f9',
    flex: 1,
    // color: 'white',
    justifyContent: 'center',
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
  invalid_phoneno: {
    color: '#3570dd',
    fontSize: 15,
    padding: 10
  },
  signInBtn: {
    paddingVertical: 15,
    marginTop: 50
  },
})