import React, { useState, useEffect }  from 'react'
import {useMutation, useQuery} from '@apollo/react-hooks'
import { currentUser } from "./src/gql/queries/currentUser.js"
import { Text, StyleSheet, ActivityIndicator } from 'react-native'
import { newRefreshToken } from "./src/gql/mutations/refreshToken.js"
import {View} from "react-native"
import {signIn, signOut, getToken, getRefreshToken, setFcmToken, setUser} from './src/util'
import { AppLoading } from 'expo'
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants'
import { THEME } from './src/theme'

const Loading = ({navigation}) => {
        let tokenSaved
        let refreshTokenSaved
        let fcmToken
        const [isLoadTokens, setIsLoadTokens] = useState(false)
        const [refreshTokenValue, setRefreshTokenValue] = useState('')
        const [tokenValue, setTokenValue] = useState('')

        const [refreshTokenMutation, {loading, error: errorRefreshToken}] = useMutation(newRefreshToken, {
            onCompleted: async ({resfreshToken}) => {
                if (resfreshToken.token && resfreshToken.refresh_token) {
                    await signIn(resfreshToken.token, resfreshToken.refresh_token)
                    navigation.navigate('App')
                }
            },
            onError: (error) => {
                if (error) {
                    console.log('error', error)
                    signOut()
                    navigation.navigate('Login')
                }
            },
        })
        const registerForPushNotifications = async () => {
            console.log('мы зашли в функицю!')
            if (Constants.isDevice) {
                const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    alert('Failed to get push token for push notification!');
                    return;
                }
                fcmToken = await Notifications.getExpoPushTokenAsync();
            } else {
                alert('Must use physical device for Push Notifications');
            }

            if (Platform.OS === 'android') {
                await Notifications.createChannelAndroidAsync('default', {
                    name: 'default',
                    sound: true,
                    priority: 'max',
                    vibrate: [0, 250, 250, 250],
                })
            }
            return fcmToken
        }
        const loadTokens = async() => {
            tokenSaved = await getToken()
            refreshTokenSaved = await getRefreshToken()
            fcmToken = await registerForPushNotifications()
            await setFcmToken(fcmToken)
        }
        useEffect(() => {
            loadTokens().then(() => {
                setTokenValue(tokenSaved)
                setRefreshTokenValue(refreshTokenSaved)
                setIsLoadTokens(true)
            });
        }, [])
        const {error, data} = useQuery(currentUser, {variables: {}})
        if (!isLoadTokens) {
            return (
                <AppLoading
                />
            )
        }


        if (!tokenValue || !refreshTokenValue ) {
            navigation.navigate('Login')
        } else {
            if (error) {
                console.log('error', error)
                if (refreshTokenSaved) {
                    refreshTokenMutation({variables: {refreshToken: refreshTokenValue}})
                }
                if (error.message.indexOf('code 403')) {
                    return (
                        <View style={styles.centerError}>
                            <Text style={styles.loadingError}>Ваш профиль заблокирован администратором приложения!</Text>
                            <Text style={styles.loading}>Причину блокировки Вы можете узнать, написав на почту lihachevdw@mail.ru </Text>
                        </View>
                    )
                }

            }

            if (data) {         
                let fio = data.currentUser.name ? `${data.currentUser.name.last} ${data.currentUser.name.first} ${data.currentUser.name.middle}` : 'Пользователь №' + data.currentUser.id
                navigation.navigate('App', {
                    fio
                })
            }
        }

        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color={THEME.MAIN_COLOR} />
            </View>
        )
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    centerError: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20
    },
    loading: {
    },
    loadingError: {
        fontWeight: "bold"
    },
    container: {
        flex: 1,
        justifyContent: "center"
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }
})

export default Loading
