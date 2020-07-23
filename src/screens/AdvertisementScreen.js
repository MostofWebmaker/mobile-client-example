import React, {useEffect, useState} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    Button,
    ScrollView,
    Alert, ActivityIndicator
} from 'react-native'
import { Item, HeaderButtons } from 'react-navigation-header-buttons'
import { AppHeaderIcon } from '../components/AppHeaderIcon'
import {getUser} from "../util"
import {THEME} from "../theme"


export const AdvertisementScreen = ({navigation}) => {
  const [existDateUpdated, setExistDateUpdated] = useState(false)
  const [dateUpdated, setDateUpdated] = useState('')
  const [dateCreated, setDateCreated] = useState('')
  const [existPrice, setExistPrice] = useState(false)
  const [price, setPrice] = useState(0)
  const [fio, setFio] = useState('')
  const [subwayStation, setSubwayStation] = useState('')
  const [addressString, setAddressString] = useState('')
  const [existSubwayStation, setExistSubwayStation] = useState(false)
  const [favoriteButtonTitle, setFavoriteButtonTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  let userId
  const postId = navigation.getParam('postId', 1)
  const datum = navigation.getParam('datum', [])
  const post = datum.find(p => p.id === postId)

  let street
  let house
  let addressStr
  let fioString

  const loadUser = async() => {
      userId = await getUser()
  }


  const loading = async () => {
      await loadUser()
      setDateCreated(post.dateCreated.split(' ')[0])
      if (post.dateUpdated) {
          setDateUpdated(post.dateUpdated.split(' ')[0])
          setExistDateUpdated(true)
      }
      if (post.subwayStation && post.subwayStation.title) {
          setSubwayStation(post.subwayStation.title)
          setExistSubwayStation(true)
      }
      if (post.bodyAdvertisement.price) {
          setPrice(post.bodyAdvertisement.price)
          setExistPrice(true)
      }
      let middle = post.user.name.middle ? post.user.name.middle : ''
      street = post.address.street ? ', ' + 'ул. ' + post.address.street.title : ''
      house = post.address.house ? ', ' + 'д. ' + post.address.house.title : ''
      addressStr = 'г. ' + post.address.city.title + ', ' + post.address.district.title + street + house
      fioString = post.user.name.last + ' ' + post.user.name.first + ' ' + middle
      setFio(fioString)
      setAddressString(addressStr)
      setCurrentUser(userId)
  }

  useEffect(() => {
      loading().then(r => setIsLoading(true))
  }, []);

  if (!isLoading) {
      return (
          <View style={[styles.container, styles.horizontal]}>
              <ActivityIndicator size="large" color={THEME.MAIN_COLOR} />
          </View>
      )
  }

  return (
    <ScrollView>
        <View style={styles.textWrap}>
            <Text style={styles.title}>{post.bodyAdvertisement.title}</Text>
        </View>
      <Image source={{ uri: post.photos[0].url }} style={styles.image} />
      <View style={styles.textarea}>
        <View style={styles.desc}>
            <Text>{post.bodyAdvertisement.description}</Text>
        </View>
        { existPrice && <Text style={styles.price}>Вознаграждение: {price} р.</Text> }
        <Text style={styles.cat}>Категория:  <Text style={styles.catText}>{post.categoryAdvertisement.title}</Text></Text>
        <Text style={styles.cat}>Адрес:  {addressString}</Text>
        { existSubwayStation && <Text style={styles.cat}>Ближайшая станция метро:  {subwayStation}</Text> }
        <Text>Создано:  {dateCreated}</Text>
        { existDateUpdated && <Text>Обновлено:  {dateUpdated}</Text> }
        <View style={styles.contacts}>
            <Text style={styles.fio}>Контакты:</Text>
            <Text style={styles.cat}>Пользователь:  <Text style={styles.catText}>{fio}</Text></Text>
            <Text style={styles.cat}>Email:  {post.user.email.value}</Text>
            <Text style={styles.cat}>Телефон:  {post.user.phone.value}</Text>
        </View>
      </View>
    </ScrollView>
  )
}

AdvertisementScreen.navigationOptions = ({ navigation }) => {
  const datum = navigation.getParam('datum', [])
  const postId = navigation.getParam('postId', 1)
  const post = datum.find(p => p.id === postId)
  const dateCreated = post.dateCreated.split(' ')[0]
  return {
    headerTitle: 'Объявление №' + postId +' от ' + dateCreated,
    headerTitleStyle: {
        fontSize: 16,
        fontWeight: "bold"
    },
    headerRight: (
        <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
            <Item
                title='Уведомления'
                iconName='ios-notifications'
                onPress={() => navigation.push('Notifications')}
            />
        </HeaderButtons>
    )
  }
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200
  },
  buttonWrap: {
    marginBottom: 5,
    marginTop: 5
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
  wrapper: {
      padding: 5
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
