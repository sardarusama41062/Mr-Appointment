import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, } from 'react-native'

///////// redux coding ////////
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import {
    getUser
} from '../../../actions'
import { getUserRating } from '../../../actions/userActions'

///////////////////////////////
import AsyncStorage from '@react-native-community/async-storage';
import UserRating from '../../Dashboard/profileScreenComponents/userRating'

class CategoriesScreen extends Component {
    constructor() {
        super()
        this.state = {
            categories: [],
        }
    }
    componentDidMount = async () => {
        const categories = [
            {
                name: 'Child Specialist',
                image: require('../../../assests/baby.png')
            }, {
                name: 'Women Health',
                image: require('../../../assests/women.png')
            }, {
                name: 'Skin',
                image: require('../../../assests/skin.png')
            }, {
                name: 'Bones and Joints',
                image: require('../../../assests/bones.png')
            }, {
                name: 'Ear Nose Throat',
                image: require('../../../assests/nose.png')
            }, {
                name: 'Dental Care',
                image: require('../../../assests/tooth.png')
            }, {
                name: 'Eye Specialist',
                image: require('../../../assests/eye.png')
            }, {
                name: 'Digestive Issue',
                image: require('../../../assests/stomach.png')
            }, {
                name: 'Physiotherapy',
                image: require('../../../assests/physiotherapy.png')
            }, {
                name: 'Dibaties Management',
                image: require('../../../assests/diabetes-test.png')
            }, {
                name: 'Brain and Nerves',
                image: require('../../../assests/brain.png')
            }, {
                name: 'Kidney and Urinary Issue',
                image: require('../../../assests/kidney.png')
            }, {
                name: 'Heart Problems',
                image: require('../../../assests/heart.png')
            }, {
                name: 'Lungs and Breathing',
                image: require('../../../assests/lungs.png')
            }, {
                name: 'Cancer',
                image: require('../../../assests/cancer.png')
            }, {
                name: 'General Physician',
                image: require('../../../assests/general.png')
            },
        ]
        this.setState({
            categories
        })
        const phoneNumber = await AsyncStorage.getItem('userToken')
        const { getUser, getUserRating } = this.props;
        getUser(phoneNumber)
        getUserRating(phoneNumber)
    }
    handlePress = (diseaseName) => {
        this.props.navigation.navigate('MapForDrLoc', { diseaseName })
    }

    render() {
        if (this.props.userData) { this.props.userData.acceptedByAdmin ? this.props.navigation.navigate('Pro') : null }
        return (
            <View style={{ paddingVertical: 10, marginTop: 20 }} >
                {this.props.getUserRatingModel &&
                    <UserRating userRating={this.props.getUserRatingModel} />
                }
                <ScrollView >
                    <View style={{ paddingBottom: 50, flex: 1, flexDirection: 'row', flexWrap: 'wrap', }}>
                        {this.state.categories.map((data, index) => {
                            const { name, image } = data;
                            return (
                                <TouchableOpacity key={index} style={styles.container}
                                    onPress={() => this.handlePress(name)}
                                >
                                    <View style={styles.imgContainer} >
                                        <Image source={image} resizeMode='cover' style={{
                                            height: 50, width: 50,
                                            borderWidth: 1, borderRadius: 100,
                                            backgroundColor: 'white'
                                        }} />
                                    </View>
                                    <View style={styles.textContainer} >
                                        <Text style={styles.text} >
                                            {name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    console.log(state)
    return {
        userData: state.signUpReducer.userData,
        getUserRatingModel: state.userReducer.getUserRating,
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getUser, getUserRating
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CategoriesScreen);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 20,
        width: '44%', backgroundColor: '#e2d9d9',
        marginBottom: 10, padding: 5,
        marginRight: 10, marginLeft: 10,
    },
    imgContainer: {
        width: '20%',
        justifyContent: 'center',
        marginRight: '15%',
    },
    textContainer: {
        width: '70%',
        justifyContent: 'center',
        paddingHorizontal: 5,
        alignItems: 'flex-start'
    },
    text: {
        alignItems: 'center',
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold',
    }
})