import React from 'react'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { AppHeaderIcon } from '../components/AppHeaderIcon'
import AdvertisementList from '../components/AdvertisementList'
import {useQuery} from "@apollo/react-hooks"
import {allAdvertisementList} from "../gql/queries/allAdvertisementList"
import {ActivityIndicator, StyleSheet, Text, View} from "react-native"
import {THEME} from "../theme"

export const MainScreen = ({ navigation }) => {
  let datum
  const {error, data} = useQuery(allAdvertisementList, {variables: {},  pollInterval: 120000})

  if (data) {
    datum = data['advertisement_list']['advertisements']
    const openPostHandler = post => {
      navigation.navigate('Post', {
        postId: post.id,
        datum
      })
    }
    return <AdvertisementList data={datum} onOpen={openPostHandler}/>
  }
  if (error) {
    console.log('myAdvertisementListQuery error', error)
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

MainScreen.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: 'Все объявления',
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
  }
}
