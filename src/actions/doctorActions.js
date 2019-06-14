import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
const DB = firebase.database()
export const submitMapLoc = (clinickLoc) => {
    return (dispatch) => {
        dispatch({
            type: 'MAP_LOC',
            clinickLoc
        })
    }
}
export const removeLoc = () => {
    return (dispatch) => {
        dispatch({
            type: 'RMV_MAP_LOC',
            
        })
    }
}

export const becomeDoctor = (data) => {
    return (dispatch) => {
        const accepted = false;
        const {
            imageUrl, drName, edu, fee, clinick,
            speciality, address, gender, city, sTime,
            sTimeAM, eTime, eTimeAM, phoneNumber, token,
            clinickLoc, pmdc
        } = data
        const drImageUrl = imageUrl
        DB.ref(`/admin/doctors/${phoneNumber}/info`)
            .set({
                drImageUrl, drName, edu, fee, clinick, speciality, pmdc,
                address, gender, city, sTime, sTimeAM, eTime, eTimeAM,
                phoneNumber, accepted, token, rating: 3.5, clinickLoc,
                finalRating: 3.5, outOf: 1
            }).then(async () => {
                DB.ref(`/users/${phoneNumber}/info`)
                    .update({ isDoctor: true })
                console.log('created new Doctor...')
                await AsyncStorage.setItem('isDoctor', 'true')
                dispatch({
                    type: 'CREATED_NEW_DOCTOR',
                    payload: data,
                    accepted
                });
            }).catch(error => {
                console.log(error)
                dispatch({
                    type: 'CREATEING_NEW_DOCTOR_FAILD',
                })
            });
    }
}

export const removeErr = () => {
    return (dispatch) => {
        dispatch({
            type: 'REMOVE_ERROR',
        })
    }
}

export const getDoctor = (phoneNumber) => {
    console.log(phoneNumber)
    return (dispatch) => {
        DB.ref(`/doctors/${phoneNumber}/info`)
            .on('value', function (snapshot) {
                console.log(snapshot)
                dispatch({
                    type: 'GET_DOCTOR_DATA',
                    payload: snapshot.val()
                })
            }, function (error) {
                console.log(error)
            })
    }
}

export const getRequests = (phoneNumber) => {
    console.log(phoneNumber)
    return (dispatch) => {
        DB.ref(`doctors/${phoneNumber}/requests`).on('value', function (snapshot) {
            var data = snapshot.val();
            console.log(data)
            var keys = []
            for (let key in data) {
                keys.push({
                    ...data[key], id: key
                })
            }
            console.log(keys)
            dispatch({
                type: 'GET_REQUESTS',
                payload: keys
            })
        })
    }
}

export const postAppointment = (data, token, selectedTime, drName, drImageUrl) => {
    return () => {
        const { userName, date, drId, id, userId, userToken, imageUrl } = data
        DB.ref(`/doctors/${drId}/pending`).push({
            userName, date, id, token, selectedTime, userToken, drId, drName, userId, imageUrl, drImageUrl
        }).then((res) => {
            DB.ref(`/users/${userId}/pending/${drId}`).set({
                date, id, token, selectedTime, drName, drImageUrl
            }).then(() => {
                DB.ref(`users/${userId}/requestsSend/${drId}`).update({
                    status: 'booked'
                })
            })
        }).catch(error => console.log(error))
    }
}
export const getPendingAppointments = (phoneNumber) => {
    return (dispatch) => {
        DB.ref(`doctors/${phoneNumber}/pending`).on('value', function (snapshot) {
            // console.log(snapshot.val())
            var data = snapshot.val();
            var keys = []
            for (let key in data) {
                keys.push({
                    ...data[key], id: key
                })
            }
            console.log(keys)
            dispatch({
                type: 'GET_PENDING',
                payload: keys
            })
        })
    }
}
export const removePendingAppointments = (data) => {
    return () => {
        const { userName, date, userToken, drId, id, userId, drName, imageUrl, drImageUrl } = data
        DB.ref(`/doctors/${drId}/summary`).push({
            userName, date, userToken, imageUrl
        }).then((res) => {
            DB.ref(`/doctors/${drId}/pending/${id}`).remove()
            DB.ref(`/users/${userId}/pending/${drId}`).remove()
            DB.ref(`/users/${userId}/summary/`).push({
                drName, date, drId, drImageUrl
            })
            DB.ref(`/users/${userId}/rating/${drId}`).set({
                drName, drId, userId
            })
            DB.ref(`users/${userId}/requestsSend/${drId}`).update({
                status: 'book'
            })
        }).catch(error => console.log(error))
    }
}
export const getSummary = (phoneNumber) => {
    return (dispatch) => {
        DB.ref(`doctors/${phoneNumber}/summary`).on('value', function (snapshot) {
            // console.log(snapshot.val())
            var data = snapshot.val();
            var keys = []
            for (let key in data) {
                keys.push({
                    ...data[key], id: key
                })
            }
            console.log(keys)
            dispatch({
                type: 'GET_SUMMARY',
                payload: keys
            })
        })
    }
}

export const updateDrProfile = (data) => {
    return (dispatch) => {
        const { drName, edu, fee, clinick, speciality, address, gender, city, sTime, sTimeAM, eTime, eTimeAM, phoneNumber, token, drImageUrl } = data
        DB.ref(`/doctors/${phoneNumber}/info`).update({
            drName, edu, fee, clinick, speciality, address, gender, city, sTime, sTimeAM, eTime, eTimeAM, phoneNumber, token, drImageUrl
        }).then(async () => {
            dispatch({
                type: 'UPDATED_PROFILE',
            });
        })
            .catch(error => {
                dispatch({
                    type: 'CREATEING_NEW_DOCTOR_FAILD',
                })
            })
    }
}

export const removeUpdated = () => {
    return (dispatch) => {
        dispatch({
            type: 'REMOVE_UPDATED_PROP'
        })
    }
}