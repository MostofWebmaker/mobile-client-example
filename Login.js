import React, { useState, useEffect  }  from 'react'
import { TextInput } from 'react-native'
import { Container, Button, Content, Form, Item, Input, Text } from 'native-base'
import { useMutation } from '@apollo/react-hooks'
import { userLogin } from "./src/gql/mutations/userLogin.js"
import {StyleSheet, View} from "react-native"
import {HeaderButtons} from "react-navigation-header-buttons"
import {AppHeaderIcon} from "./src/components/AppHeaderIcon"
import { signIn, signOut, getFcmToken } from './src/util'
import {fcmTokenUpdate} from "./src/gql/mutations/fcmTokenUpdate"
import {THEME} from "./src/theme"

const Login = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [deviceId, setDeviceId] = useState('')
    const [loginError, setLoginError] = useState(false)
    const [editable, setEditable] = useState(false)
    useEffect(() => {
        setEditable(true)
    }, [])
    const [fcmTokenUpdateMutation] = useMutation(fcmTokenUpdate)

    const [loginMutation, { loading, error }] = useMutation(userLogin, {
        onCompleted: async({ login }) => {
            if (login.token && login.refresh_token) {
                /*console.log('token', login.token )
                console.log('refresh_token', login.refresh_token )*/
                await signIn(login.token, login.refresh_token)
                const fcmToken = await getFcmToken()
                if (fcmToken) {
                    fcmTokenUpdateMutation({variables: {fcmToken}})
                }
                flushState()
                navigation.navigate('Loading')
            }
        },
        onError: async (error) => {
            if (error) {
                setLoginError(true)
                flushState()
                await signOut()
                console.log('ошибка логина!',error)
            }
        },
    })

    const handlerChangeEmail = (value) => {
        console.log(value)
        setEmail(value)
    }

    const handlerChangePassword = (value) => {
        console.log(value)
        setPassword(value)
    }

    const flushState = () => {
        setEmail('')
        setPassword('')
        setDeviceId('')
    }

    return (
        < View>
            {loginError && <Text style={styles.error}>Неверный логин и(или) пароль! </Text>}
            <TextInput
                placeholder="Email"
                onChangeText={(email) => setEmail(email)}
                value = {email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={editable}
                style={styles.input}
            />
            <TextInput
                placeholder="Пароль"
                onChangeText={(password) => setPassword(password)}
                autoCapitalize="none"
                autoCorrect={false}
                value = {password}
                editable={editable}
                style={styles.input}
                secureTextEntry={true}
            />

            <Button onPress={
                () => {
                console.log('deviceId перед логином', deviceId)
                loginMutation({variables: {email:email, password: password, deviceId: ""}} )
            }
            }><Text style={styles.title}>Войти</Text></Button>

        </View>
    )
};

Login.navigationOptions = ({navigation}) => ({
    headerTitle: 'Авторизация',
    headerLeft: (
        <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
            <Item
                title='Toggle Drawer'
                iconName='ios-menu'
                onPress={() => navigation.toggleDrawer()}
            />
        </HeaderButtons>
    )
})

const styles = StyleSheet.create({
    wrapper: {
        padding: 10
    },
    title: {
        fontSize: 16,
        flex: 1,
        //fontFamily: 'OpenRegular',
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        padding: 10,
        borderWidth: 0.5,
        borderColor: 'black',
        fontSize: 16,
    },
    error: {
        padding: 10,
        marginBottom: 2,
        color: THEME.DANGER_COLOR
    }
})

export default Login;
