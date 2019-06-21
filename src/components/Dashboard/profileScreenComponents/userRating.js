import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { AirbnbRating } from 'react-native-elements';
///////// redux coding ////////
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { postUserRating } from '../../../actions/userActions'
///////////////////////////////
import Modal from 'react-native-modalbox';
import { Button } from 'react-native-paper';


class UserRating extends Component {
    ratingCompleted(rating) {
        this.setState({ rating })
    }

    handlePress = () => {
        const rating = this.state.rating
        const { userRating, postUserRating } = this.props
        const { drId, userId } = userRating
        postUserRating(drId, rating, userId)
    }

    render() {
        const { drName } = this.props.userRating
        return (
            <Modal
                isOpen={true}
                style={{ height: 300, width: '85%', }}
                position='center'
            >
                <View style={{ marginTop: 25, padding: 10, flex: 1 }}>
                    <AirbnbRating
                        onFinishRating={(rating) => this.ratingCompleted(rating)}
                    />
                    <View style={{ marginTop: 25, padding: 5, alignItems: 'center', }} >
                        <Text style={{ fontSize: 20, alignItems: 'center', color: 'black' }} > Your Review About</Text>
                        <Text style={{ fontSize: 20, alignItems: 'center', color: 'black' }} >Dr. {drName}</Text>
                        <View style={{ width: '50%', alignItems: 'center', marginTop: 10 }} >
                            <Button mode='outlined' onPress={() => this.handlePress()} > Submit </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}
const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        postUserRating
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRating); 