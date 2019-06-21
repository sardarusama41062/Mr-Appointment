import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
const img = require('../../../../assests/no_data_found.png')

///////// redux coding ////////
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { getSummary } from '../../../../actions/doctorActions'

///////////////////////////////

class DoctorHistoryScreen extends Component {
    componentDidMount() {
        const { phoneNumber, getSummary } = this.props
        getSummary(phoneNumber)
    }
    render() {
        return (
            <ScrollView>
                <View style={{ padding: 10, paddingBottom: 100 }} >
                    {this.props.summary ?
                        <View>
                            {this.props.summary.map((data, index) => {
                                return (
                                    <View key={index} style={styles.container} >
                                        <View style={styles.imgContainer} >
                                            <Image source={{
                                                uri: data.imageUrl,
                                                cache: 'reload', method: 'GET'
                                            }}
                                                key={data.imageUrl}
                                                style={{
                                                    height: 80, width: 80,
                                                    borderWidth: 1, borderRadius: 100,
                                                }} />
                                        </View>
                                        <View style={styles.textContainer} >
                                            <Text>
                                                Patient Name : {data.userName}
                                            </Text>
                                            <Text>
                                                Visited on : {data.date}
                                            </Text>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                        :
                        <View style={{ flex: 1 }} >
                            <Text>
                                Sorry! No Patient Have Visited You Yet.
                            </Text>
                            <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }} >
                                <Image source={img} width='75%' height='100%' />
                            </View>
                        </View>
                    }
                </View>
            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        phoneNumber: state.doctorReducer.doctorData.phoneNumber,
        summary: state.doctorReducer.summary
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getSummary
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DoctorHistoryScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 2,
        paddingVertical: 20,
        borderBottomColor: '#f7c744',
    },
    imgContainer: {
        width: '30%',
        justifyContent: 'center'
    },
    textContainer: {
        width: '70%',
        justifyContent: 'center'
    }
})