
import firebase from 'react-native-firebase'
import AsyncStorage from '@react-native-community/async-storage';

export default checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
}

getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
    console.log(fcmToken)
}

requestPermission = async () => {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        this.requestPermission()
    }
}