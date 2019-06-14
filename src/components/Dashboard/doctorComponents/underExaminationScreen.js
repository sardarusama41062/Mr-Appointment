import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default class UnderExaminationScreen extends Component {

    render() {
        return (
            <View style={{ height: '100%' }} >
                <View style={styles.container}>
                    <Text style={{  alignItems: 'center', fontWeight: 'bold', fontSize: 25, width: '75%', marginBottom: 20 }} >
                        Your Profile is under Examination.
                    </Text>
                    <Text>
                        You will be noticed within 24 hours.
                    </Text>
                    <TouchableOpacity style = {styles.btn} onPress = {()=> this.props.navigation.popToTop() } >
                        <Text style = {{color: 'white', fontSize : 20}} >
                            Go Back 
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 50,
        alignItems: 'center',
        padding: 10
    },
    btn:{
        width: '50%',
        height: 40,
        marginTop: 30,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems:'center',
    }
});