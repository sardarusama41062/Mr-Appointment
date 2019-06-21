import firebase from 'react-native-firebase';
const DB = firebase.database()


export const getDoctorByCategory = (category) => {
    return (dispatch) => {
        DB.ref(`/doctors/specialistOf/${category}`).on('value',
            function (snap) {
                const data = snap.val()
                var keys = []
                for (let key in data) {
                    keys.push({
                        ...data[key], id: key
                    })
                }
                dispatch({
                    type: 'GET_DOCTORS_BY_CATEGORY',
                    payload: keys,
                })
            },
            function (err) {
                console.log(err)
            }
        )
    }
}

export const removeDoctorsByCategory = () => {
    return (dispatch) => {
        dispatch({
            type: 'REMOVE_DOCTORS_BY_CATEGORY',
        })
    }
}

export const getDoctorDetails = (doctorId) => {
    return (dispatch) => {
        DB.ref(`/doctors/doctorList/${doctorId}/info`)
            .on('value', function (snapshot) {
                dispatch({
                    type: 'GET_DOCTOR_DETAILS',
                    payload: snapshot.val()
                })
            }, function (error) {
                dispatch({
                    type: 'GET_DOCTOR_DETAILS_ERR',
                })
            })
    }
}

export const removeDoctorDetails = () => {
    return (dispatch) => {
        dispatch({
            type: 'REMOVE_DOCTOR_DETAILS',
        })
    }
}

export const bookAppointment = (data) => {
    return (dispatch) => {
        const { drId, userId, date, drToken, userToken, userName, time, imageUrl } = data
        DB.ref(`/doctors/doctorList/${drId}/requests`).push(
            { drId, userId, date, drToken, userToken, userName, time, imageUrl }
        ).then(() => {
            DB.ref(`/users/${userId}/requestsSend/${drId}`).set({
                userId, drId, status: 'booking'
            })
        }).catch(() => {
            dispatch({
                type: 'BOOKING_ERROR',
            })
        })
    }
}

export const getPendingAppointments = (phoneNumber) => {
    return (dispatch) => {
        DB.ref(`/users/${phoneNumber}/pending`).on('value', function (snapshot) {
            const data = snapshot.val();
            var keys = []
            for (let key in data) {
                keys.push({
                    ...data[key], id: key
                })
            }
            dispatch({
                type: 'GET_USER_PENDING',
                payload: keys
            })
        })
    }
}

export const getSummary = (phoneNumber) => {
    return (dispatch) => {
        DB.ref(`/users/${phoneNumber}/summary`)
            .on('value', function (snapshot) {
                const data = snapshot.val();
                var keys = []
                for (let key in data) {
                    keys.push({
                        ...data[key], id: key
                    })
                }
                dispatch({
                    type: 'GET_USER_SUMMARY',
                    payload: keys
                })
            })
    }
}

export const updateUserForm = (values, phoneNumber, token, imageUrl) => {
    return (dispatch) => {
        const { fname, lname, gender, city } = values;
        DB.ref(`/users/${phoneNumber}/info`)
            .update({
                fname, lname, gender, city, imageUrl, token
            }).then(() => {
                dispatch({
                    type: 'UPDATED_USER_SUCCESS',
                })
            }).catch(error => {
                dispatch({
                    type: 'UPDATED_USER_FAILD',
                })
            })
    }
}

export const resetUpdatedUser = () => {
    return (dispatch) => {
        dispatch({
            type: 'RESET_UPDATED_USER'
        })
    }
}

export const getSentRequests = (phoneNumber) => {
    return (dispatch) => {
        DB.ref(`/users/${phoneNumber}/requestsSend`)
            .on('value', function (snapshot) {
                const data = snapshot.val();
                var keys = []
                for (let key in data) {
                    keys.push({
                        ...data[key], id: key
                    })
                }
                dispatch({
                    type: 'GET_SENT_REQUESTS',
                    payload: keys
                })
            }, function (err) {
                console.log(err)
            })
    }
}

export const getUserRating = (phoneNumber) => {
    return (dispatch) => {
        DB.ref(`/users/${phoneNumber}/rating`)
            .endAt().limitToLast(1).on('child_added',
                function (snap) {
                    dispatch({
                        type: 'GET_USER_RATING',
                        payload: snap.val()
                    })
                },
                function (err) {
                    console.log(err.val())
                },
            )
    }
}

export const postUserRating = (drId, rating, userId) => {
    return (dispatch) => {
        DB.ref(`/doctors/doctorList/${drId}/info`)
            .update({
                rating
            })
            .then(() => {
                DB.ref(`/users/${userId}/rating/${drId}`)
                    .remove()
                    .then(() => {
                        dispatch({
                            type: 'POST_USER_RATING',
                        })
                    })
            })
            .catch(() => console.log('err'))
    }
}

export const firebaseTokenChanged = (phoneNumber, fcmToken) => {
    return () => {
        firebase.database().ref(`/users/${phoneNumber}/info`)
            .update({ token: fcmToken })
    }
}