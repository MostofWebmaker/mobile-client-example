import * as SecureStore from 'expo-secure-store'
import { AsyncStorage } from "react-native"


const AUTH_TOKEN = 'AUTH_TOKEN'
const REFRESH_TOKEN = 'REFRESH_TOKEN'
const FCM_TOKEN = 'FCM_TOKEN'
const CURRENT_USER = 'CURRENT_USER'
let user
let token
let refreshToken
let fcmToken

export const getUser = async () => {
    try {
        if (user) {
            return await Promise.resolve(user);
        }
        user = await AsyncStorage.getItem(CURRENT_USER);
        if (user !== null) {
            // We have data!!
            console.log('user in getUser function: ', user);
        }
    }  catch (error) {
        // Error retrieving data
        console.log('error in getUser',error)
    }
    return user;
}

export const setUser = async (userId) => {
    try{
        user = userId;
        await AsyncStorage.setItem(FCM_TOKEN, fcmToken);
        console.log('CURRENT_USER', user)
    } catch (error) {
        console.log('error', error)
    }
};


export const getToken = async () => {
    try {
        if (token) {
            return await Promise.resolve(token);
        }
        token = await AsyncStorage.getItem(AUTH_TOKEN);
        if (token !== null) {
            // We have data!!
            console.log('token in getToken function CLIENT: ', token);
        }
    }  catch (error) {
        // Error retrieving data
        console.log('error in getToken',error)
    }
    return token;
}

export const getRefreshToken = async () => {
        try {
            if (refreshToken) {
                return await Promise.resolve(refreshToken);
            }

            refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN)
            if (refreshToken !== null) {
                // We have data!!
                console.log('refreshToken in getRefreshToken function: ', refreshToken);
            }
        } catch (error) {
            // Error retrieving data
            console.log('error in getRefreshToken ', error)

        }
        return refreshToken;
}

export const getFcmToken = async () => {
    try {
        // if (fcmToken) {
        //     return await Promise.resolve(fcmToken);
        // }

        fcmToken = await AsyncStorage.getItem(FCM_TOKEN);
        console.log('fcmToken getter', fcmToken)

        // if (!fcmToken) {
        //     fcmToken = await firebase.messaging().getToken();
        //     await setFcmToken(fcmToken)
        // }
    } catch (e) {
        console.log('error', error)
    }
    return fcmToken
};

export const setFcmToken = async (newFcmToken) => {
    try{
    fcmToken = newFcmToken;
    await AsyncStorage.setItem(FCM_TOKEN, fcmToken);
    console.log('FCM_TOKEN', FCM_TOKEN)
    } catch (e) {
        console.log('error', error)
    }
};

export const signIn = async (newToken, newRefreshToken) => {
    try{
        token = newToken;
        refreshToken = newRefreshToken;
        await AsyncStorage.setItem(AUTH_TOKEN, newToken);
        await AsyncStorage.setItem(REFRESH_TOKEN, newRefreshToken)
        // console.log('newToken in signIN', newToken )
        // console.log('newRefreshToken in signIN', newRefreshToken )
    } catch (error) {
        console.log('error', error)
    }
}

export const signOut = async () => {
    token = undefined;
    refreshToken = undefined;
    fcmToken = undefined;
    user = undefined;

    await AsyncStorage.removeItem(AUTH_TOKEN);
    await AsyncStorage.removeItem(REFRESH_TOKEN);
    await AsyncStorage.removeItem(FCM_TOKEN);
    await AsyncStorage.removeItem(CURRENT_USER);
}