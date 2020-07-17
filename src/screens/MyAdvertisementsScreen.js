import React, {useEffect, useState } from 'react'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { AppHeaderIcon } from '../components/AppHeaderIcon'
import MyAdvertisementList from '../components/MyAdvertisementList'
import {useQuery} from "@apollo/react-hooks"
import {myAdvertisementList} from "../gql/queries/myAdvertisementList"
import {advertisementStatusTypeList} from "../gql/queries/advertisementStatusTypeList"
import {ActivityIndicator, StyleSheet, Text, View} from "react-native"
import {getUser} from "../util"
import {AppLoading} from "expo"
import {THEME} from "../theme"

export const MyAdvertisementsScreen = ({ navigation }) => {
    let datum
    let statusList
    let userId
    const [isLoading, setIsLoading] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const loadUser = async() => {
        userId = await getUser()
    }
    const {error, data} = useQuery(myAdvertisementList, {variables: {userId: currentUser},  skip: !isLoading, pollInterval: 120000})
    const {error: advertisementStatusTypeListError, data: advertisementStatusTypeListData} = useQuery(advertisementStatusTypeList, {variables: {},  skip: !isLoading})
    useEffect(() => {
        loadUser().then(() => {
            console.log('User!', userId)
            setCurrentUser(userId)
            setIsLoading(true)
        });
    }, [data])
    if (!isLoading) {
        return (
            <AppLoading
            />
        )
    }
    if (data) {
        if (advertisementStatusTypeListData) {
            statusList = advertisementStatusTypeListData['advertisementStatusTypeList']['advertisementStatusType']
                .filter(item => item)
                .map(item => new Object({label: item.description, value: item.id}))
            //console.log('statusList', statusList)
        }
        datum = data['advertisement_list']['advertisements']
        const openPostHandler = post => {
            navigation.navigate('MyPost', {
                postId: post.id,
                datum,
                statusList,
                userId
            })
        }
        return <MyAdvertisementList data={datum} onOpen={openPostHandler} userId={userId}/>
    }
    if (error) {
        console.log('myAdvertisementListQuery error', error)
    }
    if (advertisementStatusTypeListError) {
        console.log('advertisementStatusTypeListError', advertisementStatusTypeListError)
    }
    return (
        <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color={THEME.MAIN_COLOR} />
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 200
    },
    textWrap: {
        padding: 5
    },
    title: {
        fontSize: 17,
        fontWeight: "bold",
        padding: 5,
        marginBottom: 5,
        textAlign: 'center'
    },
    textarea: {
        padding: 10,
        marginBottom: 10
    },
    desc: {
        marginBottom: 10
    },
    contacts: {
        marginTop: 5
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loading: {
    },
    price: {
        fontWeight: "bold",
        marginBottom: 5
    },
    fio: {
        fontWeight: "bold",
        fontSize: 15,
        marginBottom: 5
    },
    cat: {
        marginBottom: 5
    },
    catText: {
        textDecorationLine: "underline"
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

MyAdvertisementsScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: 'Мои объявления',
  headerRight: (
    <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
      <Item
          title='Уведомления'
          iconName='ios-notifications'
          onPress={() => navigation.push('Notifications')}
      />
    </HeaderButtons>
  ),
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
