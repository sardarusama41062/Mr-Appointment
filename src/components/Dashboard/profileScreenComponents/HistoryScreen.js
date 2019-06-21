import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
const img = require('../../../assests/no_data_found.png')

///////// redux coding ////////
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import {
    getSummary
} from '../../../actions/userActions'
///////////////////////////////

class HistoryScreen extends Component {

    componentDidMount() {
        const { getSummary, phoneNumber } = this.props
        getSummary(phoneNumber)
    }
    render() {
        return (
            <View>
                {this.props.summary ?
                    <ScrollView>
                        <View style={{ padding: 10, paddingBottom: 100 }} >
                            {this.props.summary.length ?
                                <View>
                                    {this.props.summary.map((data, index) => {
                                        return (
                                            <View key={index} style={styles.container} >
                                                <View style={styles.imgContainer} >
                                                    <Image source={{ uri: data.drImageUrl }} style={{
                                                        height: 80, width: 80,
                                                        borderWidth: 1, borderRadius: 100,
                                                    }} />
                                                </View>
                                                <View style={styles.textContainer} >
                                                    <Text>
                                                        DR. Name : {data.drName}
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
                                        Sorry! You Have Not Visited Any Doctor Yet.
                            </Text>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }} >
                                        <Image source={img} width='75%' height='100%' />
                                    </View>
                                </View>
                            }
                        </View>
                    </ScrollView>
                    :
                    <View style={{ flex: 1 }} >
                        <Text>
                            Sorry! You Have Not Visited Any Doctor Yet.
                        </Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%' }} >
                            <Image source={img} width='75%' height='100%' />
                        </View>
                    </View>
                }
            </View>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        phoneNumber: state.signUpReducer.userData.phoneNumber,
        summary: state.userReducer.summary
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getSummary
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryScreen);

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