
import React, { Component } from 'react';
import { ScrollView, SafeAreaView, View } from 'react-native';
import { DrawerItems } from 'react-navigation';
import { Card, Title, Paragraph } from 'react-native-paper';

///////// redux coding ////////
import { connect } from 'react-redux';
///////////////////////////////

class ProfileCustomComponent extends Component {
    render() {
        return (
            <ScrollView>
                <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
                    <Card>
                        <Card.Content style={{ backgroundColor: 'rgb(3,155,229)', marginBottom: 10 }} >
                            <Title style={{ color: 'white' }} >Mr. Appointment</Title>
                        </Card.Content>
                        {this.props.userData ?
                            <View>
                                <Card.Cover source={{ uri: this.props.userData.drImageUrl }} resizeMode='contain' />
                                <Card.Content style={{ alignItems: 'center', marginBottom: 10 }} >
                                    <Title style={{ color: 'orange' }} >{this.props.userData.drName}</Title>
                                    <Paragraph> User ID : {this.props.userData.phoneNumber}</Paragraph>
                                </Card.Content>
                            </View>
                            :
                            null
                        }
                    </Card>
                    <DrawerItems {...this.props} />
                </SafeAreaView>
            </ScrollView>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        userData: state.doctorReducer.doctorData,
    }
}
export default connect(mapStateToProps, null)(ProfileCustomComponent);
