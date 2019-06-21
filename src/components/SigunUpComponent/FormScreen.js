import React, { Component } from 'react';
import {
  StyleSheet, Platform, Text, View, TouchableHighlight, ScrollView, ActivityIndicator,
  TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { submitForm, indicatorFun, disableIndicatorFun } from '../../actions'
import AsyncStorage from '@react-native-community/async-storage';
import UploadImage from './UploadImage'
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

class UserForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      indicator: false,
      fname: '',
      fnameErr: false,
      lname: '',
      lnameErr: false,
      age: null,
      ageErr: false,
      gender: 'Male',
      city: 'Faisalabad',
      photoErr: false,
      Cityexpanded: false
    }
  }
  static navigationOptions = {
    header: null
  }
  onPress = async () => {
    const { fname, lname, age, gender, city } = this.state
    const { uploadImage } = this.props
    if (!fname && !lname && !age && !gender && !city && !uploadImage) {
      this.setState({
        fnameErr: true,
        lnameErr: true,
        ageErr: true,
      })
    }
    else {
      const value = { fname, lname, age, gender, city }
      const token = await AsyncStorage.getItem('fcmToken')
      const { phoneNumber, submitForm, indicatorFun } = this.props;
      if (uploadImage) {
        this.setState({ photoErr: false })
        indicatorFun()
        await submitForm(value, phoneNumber, token, uploadImage)
      }
      else {
        this.setState({ photoErr: true })
      }
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
  render = () => {
    const { create_new_user, navigation, create_new_user_failed, phoneNumber } = this.props;
    if (create_new_user) {
      AsyncStorage.setItem('userToken', phoneNumber);
      navigation.navigate('App')
    }

    return (
      <View style={{ backgroundColor: '#f7f8f9', height: '100%', flex: 1 }} >
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
                <TextInput
                  label='Age'
                  value={this.state.age}
                  onChangeText={age => {
                    this.setState({ age, ageErr: false })
                  }}
                  mode='outlined'
                  onBlur={() => !this.state.fname && this.setState({ ageErr: true })}
                />
                <HelperText
                  type="info"
                  visible={this.state.ageErr}
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
                    <ScrollView showsVerticalScrollIndicator
                    // style={{ height: 200 }}
                    >
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
            <Button mode='contained' onPress={this.onPress}>
              Submit
            </Button>
            {create_new_user_failed ?
              <View>
                {this.props.disableIndicatorFun}
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
  return {
    phoneNumber: state.signUpReducer.phoneNumber,
    create_new_user: state.signUpReducer.create_new_user,
    create_new_user_failed: state.signUpReducer.create_new_user_failed,
    indicator: state.signUpReducer.indicator,
    uploadImage: state.signUpReducer.uploadImage
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    submitForm, indicatorFun, disableIndicatorFun,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserForm);


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