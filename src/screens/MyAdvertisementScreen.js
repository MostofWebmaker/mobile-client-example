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
import { THEME } from '../theme'
import RNPickerSelect from "react-native-picker-select"
import {useMutation} from "@apollo/react-hooks"
import {changeAdvertisementStatus} from "../gql/mutations/changeAdvertisementStatus"
import ModalComponent from "../components/ModalComponent"

export const MyAdvertisementScreen = ({ navigation }) => {
  const [existDateUpdated, setExistDateUpdated] = useState(false)
  const [dateUpdated, setDateUpdated] = useState('')
  const [dateCreated, setDateCreated] = useState('')
  const [existPrice, setExistPrice] = useState(false)
  const [statusValue, setStatusValue] = useState(null)
  const [currentStatusValue, setCurrentStatusValue] = useState('')
  const [currentStatusId, setCurrentStatusId] = useState(null)
  const [price, setPrice] = useState(0)
  const [fio, setFio] = useState('')
  const [subwayStation, setSubwayStation] = useState('')
  const [addressString, setAddressString] = useState('')
  const [existSubwayStation, setExistSubwayStation] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [lastMessage, setLastMessage] = useState('')
  const [adminMessage, setAdminMessage] = useState('')
  const [existAdminMessage, setExistAdminMessage] = useState(false)
  const [showSelectChangeStatus, setShowSelectChangeStatus] = useState(true)
  const [showEditButton, setShowEditButton] = useState(true)


  const [isLoading, setIsLoading] = useState(false)
  const postId = navigation.getParam('postId', 1)
  const datum = navigation.getParam('datum', [])
  const post = datum.find(p => p.id === postId)
  const statusList = navigation.getParam('statusList', [])
  const userId = navigation.getParam('userId', null)
  const [changeAdvertisementStatusMutation, { loading: changeAdvertisementStatusLoading, error: changeAdvertisementStatusError }] = useMutation(changeAdvertisementStatus, {
        onCompleted: async({ changeAdvertisementStatus }) => {
            console.log('ПОЛУЧИЛИ УСПЕШНЫЙ ОТВЕТ МУТАЦИИ', changeAdvertisementStatus)
            if (changeAdvertisementStatus.advertisement_status_type) {
                let newStatusId = changeAdvertisementStatus.advertisement_status_type.id
                let newStatus = changeAdvertisementStatus.advertisement_status_type.description
                setCurrentStatusId(newStatusId)
                setCurrentStatusValue(newStatus)
                if (newStatusId === 3) {
                    let message = `Ваше объявление отправлено на модерацию администратору! Через некоторое время ваше объявление либо будет активировано, либо возвращено с комментарием на исправление.`
                    setLastMessage(message)
                    setModalVisible(true)
                }
            }
        },
        onError: async (error) => {
            if (error) {
                console.log(error)
            }
        },
  })

  let street
  let house
  let addressStr
  let fioString
  const statusIdOnModeration = 3

  const loading = () => {
      setDateCreated(post.dateCreated.split(' ')[0])
      if (post.dateUpdated) {
          setDateUpdated(post.dateUpdated.split(' ')[0])
          setExistDateUpdated(true)
      }
      if (post.subwayStation && post.subwayStation.title.length) {
          setSubwayStation(post.subwayStation.title)
          setExistSubwayStation(true)
      }
      if (post.bodyAdvertisement.price) {
          setPrice(post.bodyAdvertisement.price)
          setExistPrice(true)
      }
      let middle = post.user.name.middle ? post.user.name.middle : ''
      street = post.address.street ? ', ' + 'ул. ' + post.address.street.title : ''
      house =  post.address.house ? ', ' + 'д. ' + post.address.house.title : ''
      addressStr = 'г. ' + post.address.city.title + ', ' + post.address.district.title + street + house
      fioString = post.user.name.last + ' ' + post.user.name.first + ' ' + middle
      setFio(fioString)
      setAddressString(addressStr)
      if (post.status.advertisement_status_type.id === statusIdOnModeration) {
          setShowSelectChangeStatus(false)
          setShowEditButton(false)
      }
      if (post.status && post.status.message) {
          setExistAdminMessage(true)
          setAdminMessage(post.status.message)
      }  
      setCurrentStatusValue(post.status.advertisement_status_type.description)
      setCurrentStatusId(post.status.advertisement_status_type.id)
      setIsLoading(true)
  }

    useEffect(() => {
        console.log('userEffect working')
        loading()
    }, [post])

  useEffect(() => {
      loading()
  }, []);

  if (!isLoading) {
      return (
          <View style={[styles.container, styles.horizontal]}>
              <ActivityIndicator size="large" color={THEME.MAIN_COLOR} />
          </View>
      )
  }

    const flushState = () => {
        setLastMessage('')
        setModalVisible(false)
    }

  const changeAdvertisementStatusFunction = (value) => {
      console.log('new status value', value)
      setStatusValue(value)
      if (existAdminMessage && adminMessage.length) {
          setAdminMessage('')
          setExistAdminMessage(false)
      }
      if (value === statusIdOnModeration) {
          setShowSelectChangeStatus(false)
          setShowEditButton(false)
          if (adminMessage.length && existAdminMessage) {
              setExistAdminMessage(false)
              setAdminMessage('')
          }
      }
      changeAdvertisementStatusMutation({variables: {advertisementId: postId, statusId: value, userId: userId}})
   }

  const editHandler = () => {
    Alert.alert(
      'Редактирование объявления',
      'Вы точно хотите отредактировать объявление? ',
      [
        {
          text: 'Отменить',
          style: 'cancel'
        },
        { text: 'Редактировать', style: 'destructive', onPress: () => {
                navigation.navigate('Edit', {
                    datum,
                    postId
                })
        } }
      ],
      { cancelable: false }
    )
  }

  return (
    <ScrollView>
        <View style={styles.textWrap}>
            <Text style={styles.title}>{post.bodyAdvertisement.title} ({currentStatusValue.toLowerCase()})</Text>
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
        <Text style={styles.cat}>Текущий статус:  <Text style={styles.catText}>{currentStatusValue.toLowerCase()}</Text></Text>
        { existAdminMessage && <Text style={{color: THEME.DANGER_COLOR, fontWeight: "bold"}}>Сообщение администратора:  {adminMessage}</Text> }
        { showSelectChangeStatus && <RNPickerSelect
            placeholder={{
                label: 'Сменить статус',
                value: 'Сменить статус',
                color: 'grey',
                borderColor: 'black',
                borderWidth: 1
            }}
            style={{
                iconContainer: {
                    top: 20,
                    right: 10
                },
                placeholder: {
                    color: 'black',
                    fontSize: 12,
                    fontWeight: 'normal'
                }
            }}
            onValueChange={(statusValue) => changeAdvertisementStatusFunction(statusValue)}
            items={statusList}
            value={statusValue}
        /> }
      </View>
        { showEditButton &&  <View style={styles.desc}>
          <Button
            title='Редактировать объявление'
            color={THEME.DANGER_COLOR}
            onPress={editHandler}
          />
      </View> }
    {modalVisible && <ModalComponent text = {lastMessage} isModalVisible={modalVisible}  navigation={navigation} path={'MyAdvertisement'} callback={flushState}/>}
    </ScrollView>
  )
}

MyAdvertisementScreen.navigationOptions = ({ navigation }) => {
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
