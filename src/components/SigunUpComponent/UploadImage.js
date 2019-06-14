import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { uploadImage } from '../../actions'
import ImagePicker from 'react-native-image-picker';
import { Button } from 'react-native-paper';

class UploadImage extends Component {
    state = {
        ImageSource: null,
    };
    selectPhotoTapped() {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else {
                let source = { uri: response.uri };
                this.setState({
                    ImageSource: source
                });
                const { phoneNumber, uploadImage } = this.props
                const { uri } = response;
                const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
                uploadImage(uploadUri, phoneNumber)

            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                {!this.state.ImageSource
                    ?
                    null
                    :
                    <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                        <View style={styles.ImageContainer}>
                            <Image style={styles.ImageContainer} source={this.state.ImageSource} />
                        </View>
                    </TouchableOpacity>
                }
                {/* <TouchableOpacity style={styles.pickImage} onPress={this.selectPhotoTapped.bind(this)}>
                    <Text style={{ color: 'white' }} >Select a Photo</Text>
                </TouchableOpacity> */}
                <Button icon="add-a-photo" mode="contained" onPress={this.selectPhotoTapped.bind(this)}>
                    Upload Photo
                </Button>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        phoneNumber: state.signUpReducer.phoneNumber,
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        uploadImage
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadImage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    ImageContainer: {
        borderRadius: 10,
        width: 250,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    pickImage: {
        height: 50, backgroundColor: 'blue',
        justifyContent: 'center', alignItems: 'center',
        width: '50%'
    }
});
