import React, { Component } from 'react';
import {
  View, Text, TextInput,
  StyleSheet, Animated,
  ScrollView, TouchableWithoutFeedback,
  Keyboard, Image, Easing
} from 'react-native';
import image from '../../assests/logIn.png'
import { Button, ActivityIndicator } from 'react-native-paper'

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import {
  signInWithPhone, indicatorFun,
  checkUserExist, invalid_phonenoFun,
  invalid_phoneno_removeFN
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
      opacity: new Animated.Value(0),
    };
  }
  static navigationOptions = {
    header: null
  }

  signIn = async () => {
    let { phoneNumber } = this.state;
    phoneNumber = phoneNumber.replace(/^0+/, '')
    if (phoneNumber.length == 10) {
      this.props.indicatorFun()
      const completePhnNumber = "+92" + phoneNumber;
      this.props.checkUserExist(completePhnNumber)
      await this.props.signInWithPhone(completePhnNumber);
    }
    else {
      this.setState({ error: true })
    }
  }

  indicator() {
    const { indicator } = this.props;
    if (indicator) {
      return (
        <ActivityIndicator style={{ marginTop: 15 }} size="large" color="#3570dd" />
      )
    }
  }
  hideKeyboard = () => {
    Keyboard.dismiss()
  }

  componentDidMount() {
    this.animate()
  }
  componentWillUnmount() {
    this.props.invalid_phoneno_removeFN()
  }
  animate() {
    Animated.timing(
      this.state.opacity,
      {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
      }
    ).start()
  }

  render() {
    this.props.confirmResult && this.props.navigation.navigate('VerifyCodeInputScreen')

    const opacity = this.state.opacity.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.3, 1]
    })
    return (
      <View style={styles.container} >
        <Animated.View style={{ opacity: opacity }} >
          <ScrollView >
            <TouchableWithoutFeedback onPress={() => this.hideKeyboard()} >
              <View>
                <View>
                  <Image source={image} width='100%' height='100%' resizeMode='contain' resizeMethod='resize' />
                </View>
                <View style={{ padding: 25 }} >
                  <View>
                    <Text style={{ fontSize: 18 }}> Enter Phone Number</Text>
                  </View>
                  <View>
                    <TextInput
                      onChangeText={(phoneNumber) => {
                        this.setState({ phoneNumber, error: false })
                        this.props.invalid_phoneno_removeFN()
                      }}
                      keyboardType='numeric'
                      maxLength={11}
                      placeholder='Enter Phone Number'
                      style={styles.input}
                    />
                  </View>
                  {this.state.error &&
                    <View>
                      <Text style={styles.invalid_phoneno} > Invalid Phone Number </Text>
                    </View>
                  }
                  {this.props.invalid_phoneno &&
                    <View>
                      <Text style={styles.invalid_phoneno} > Invalid Phone Number </Text>
                    </View>
                  }
                </View>
                <View style={{ alignItems: 'center' }} >
                  <Button mode='outlined' onPress={() => this.signIn()} >
                    Submit
                  </Button>
                </View>
                {this.indicator()}
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </Animated.View>
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
    checkUserExist, invalid_phonenoFun,
    invalid_phoneno_removeFN, 
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PhoneAuth);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    marginVertical: 20,
    borderBottomColor: '#3570dd', borderBottomWidth: 1
  },
  inputStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingRight: 5,
    paddingLeft: 35,
    fontSize: 18,
  },
  invalid_phoneno: {
    color: 'red',
    fontSize: 15,
  },
})