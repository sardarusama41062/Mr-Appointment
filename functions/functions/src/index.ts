import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
admin.initializeApp(functions.config().firebase);
// const twilio = require('twilio');

// const accountSid = 'AC1624d44703a9ebe6bbe98d888c514422'
// const authToken = '6f7985b90a6a152883bc796a30b9b864'

// const client = new twilio(accountSid, authToken);

// const twilioNumber = '+16179630782'

//////////// user request for appointment /////////////////

export const userPushNotification = functions.database.ref('/doctors/doctorList/{drId}/requests/{reqId}')
    .onCreate((snapshot, context) => {
        console.log(snapshot)
        console.log(context)
        const data = snapshot.val()
        const receiverId = data.drToken;
        const senderId = data.userToken;

        const payload = {
            notification: {
                title: 'Mr. Appointment',
                body: 'You have a new Appointment Request',
                sound: 'default',
                badge: '1',
            }
        }
        const options = {
            show_in_foreground: true,
        }

        console.log(`receiver: ${receiverId}, sender: ${senderId}`)
        return admin.messaging().sendToDevice(receiverId, payload, options)
            .then((result: any) => console.log(result))
            .catch((error: any) => console.error(error));
    })

//////////// create user in admin database /////////////////

export const createUser = functions.database.ref(`/users/{uid}/info`)
    .onCreate((snapshot, context) => {
        console.log(snapshot)
        console.log(context)
        const uid = context.params.uid;
        const data = snapshot.val();

        return admin.database().ref(`/admin/users/${uid}/info`).set(data)
            .then((res) => console.log(res))
            .catch((error) => console.log(error))
    })

//////////// doctor is accepted by the admin /////////////////

export const DoctorAccepted = functions.database.ref(`/admin/doctors/{drId}/info`)
    .onUpdate((snapshot, context) => {
        const data = snapshot.after.val()
        const token = data.token
        const accepted = data.accepted
        const id = context.params.drId
        const acceptedByAdmin = true
        const payload = {
            notification: {
                title: 'Mr. Appointment',
                body: 'ّYou have no been Registered as a Doctor.',
                sound: 'default',
                badge: '1',
            }
        }
        if (accepted) {
            return admin.messaging().sendToDevice(token, payload)
                .then(() => {
                    return admin.database().ref(`/doctors/doctorList/${id}/info`).set(data)
                        .then(() => {
                            return admin.database().ref(`users/${id}/info`).update({ acceptedByAdmin })
                                .then(() => {
                                    return admin.database().ref(`/admin/doctors/${id}/info`).once('value')
                                        .then(
                                            (res) => {
                                                const { speciality, drName, clinickLoc, drImageUrl } = res.val()
                                                speciality.forEach((specialist: any) => {
                                                    return admin.database().ref(`/doctors/specialistOf/${specialist}/${id}`)
                                                        .set({ drName, id, drImageUrl, loc: clinickLoc, })
                                                        .then(() => {
                                                            console.log('success')
                                                        })
                                                })
                                            }
                                        )
                                })
                        })
                })
                .catch(err => console.log(err))
        }
        else return null
    })

//////////// delete appointment from doctor requests using pendin collection /////////////////

export const DeleteRequest = functions.database.ref(`/doctors/doctorList/{drId}/pending/{pendingId}`)
    .onCreate((snapshot, context) => {
        const data = snapshot.val();
        const { userToken, id, drId } = data
        const payload = {
            notification: {
                title: 'Mr. Appointment',
                body: `Your Request for Appointment has been accepted `,
                sound: 'default',
                badge: '1'
            }
        }
        return admin.database().ref(`/doctors/doctorList/${drId}/requests/${id}`).remove()
            .then(res => {
                return admin.messaging().sendToDevice(userToken, payload)
                // const textMessage = {
                //     body: `Appointment request accepted`,
                //     to: userId,  // Text to this number
                //     from: twilioNumber // From a valid Twilio number
                // }
                // return client.messages.create(textMessage)
            })
            // .then(message => console.log(message.sid, 'success'))
            // })
            .catch(err => console.log(err))
    })

/////////////// DoctorRating ////////////////////
export const DoctorRating = functions.database.ref(`/doctors/doctorList/{drId}/info`)
    .onUpdate((snapshot, context) => {
        const newVal = snapshot.after.val()
        const preVal = snapshot.before.val()
        var newRating = newVal.rating
        const preRating = preVal.rating
        console.log(newRating)
        console.log(preRating)
        if (newRating === preRating) {
            return null
        }
        else {
            var finalRating = (newRating + preRating) / 2
            const { drId } = context.params
            return admin.database().ref(`/doctors/doctorList/${drId}/info`).update({
                finalRating,
            }).then(() => {
                console.log('rating updated')
            })
        }
    })
///////////////////////////////////