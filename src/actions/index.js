
import firebase from 'react-native-firebase';

export const restoreSession = () => {
    return (dispatch) => {
        firebase.auth()
            .onAuthStateChanged((user) => {
                if (user) {
                    dispatch({
                        type: 'RESTORE_SESSION',
                        payload: user
                    })
                } else {
                    // User has been signed out, reset the state
                    dispatch({
                        type: 'SIGN_OUT',
                        payload: null
                    })
                }
            });
    }
}

export const cancleConfirmREsult = () => {
    return {
        type: 'CANCLE_CONFIRM_RESULT',
        payload: null
    }
};

export function checkUserExist(phoneNumber) {
    return (dispatch) => {
        firebase.database().ref('/users/')
            .orderByKey().equalTo(phoneNumber)
            .once('value')
            .then(res => {
                if (res.val()) {
                    dispatch({
                        type: 'FIREBSE_USER_EXIST',
                        payload: true,
                    })
                }
                else {
                    dispatch({
                        type: 'FIREBSE_USER_NOT_EXIST'
                    })
                }
            })
    }
}

export const signInWithPhone = (phoneNumber) => {
    return (dispatch) => {
        firebase.auth()
            .signInWithPhoneNumber(phoneNumber)
            .then((confirmResult) => {
                dispatch({
                    type: 'SIGN_IN_WITH_PHONE',
                    payload: confirmResult,
                    phoneNumber
                })
            })
            .catch((error) => {
                dispatch({
                    type: 'INVALID_PHONE_NUMBER',
                })
            })

    }
}

export const invalid_phonenoFun = () => {
    return (dispatch) => {
        dispatch({
            type: 'INVALID_PHONE_NUMBER',
        })
    }
}

export const invalid_phoneno_removeFN = () => {
    console.log('removed')
    return (dispatch) => {
        dispatch({
            type: 'INVALID_PHONE_NUMBER_REMOVE',
        })
    }
}

export const invalid_codeFun = () => {
    return (dispatch) => {
        dispatch({
            type: 'INVALID_CODE',
        })
    }
}

export const indicatorFun = () => {
    return {
        type: 'INDICATOR',
    }
}

export const disableIndicatorFun = () => {
    return {
        type: 'DISABLE_INDICATOR',
    }
}

export const conformCode = (confirmResult, codeInput) => {
    return (dispatch) => {
        confirmResult.confirm(codeInput)
            .then((user) => {
                dispatch({
                    type: 'CONFIRM_CODE_SUCCESS',
                    payload: user,
                })
            })
    }
}

export const uploadImage = (imageUrl, phoneNumber) => {
    return (dispatch) => {
        firebase.storage()
            .ref(`photos/${phoneNumber}`)
            .putFile(imageUrl)
            .then(file => {
                dispatch({
                    type: 'UPLOAD_IMAGE',
                    payload: file.downloadURL
                })
            })
            .catch(error => console.log(error));
    }
}

export const submitForm = (values, phoneNumber, token, imageUrl) => {
    return (dispatch) => {
        const { fname, lname, age, gender, city } = values;
        const isDoctor = false
        const acceptedByAdmin = false
        firebase.database()
            .ref(`/users/${phoneNumber}/info`).set({
                phoneNumber, fname, lname, age, gender,
                city, isDoctor, token, acceptedByAdmin, imageUrl
            }).then(() => {
                dispatch({
                    type: 'CREATED_NEW_USER',
                })
            }).catch(error => {
                dispatch({
                    type: 'CREATEING_NEW_USER_FAILD',
                })
            })
    }
}

export const getUser = (userId) => {
    return (dispatch) => {
        firebase.database()
            .ref(`/users/${userId}/info`)
            .on('value',
                function (snap) {
                    dispatch({
                        type: 'USER_DATA',
                        payload: snap.val()
                    })
                }
            )
    }
}
