import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    Button,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import { createDrawerNavigator } from 'react-navigation-drawer'
import { Ionicons } from '@expo/vector-icons'
import { MainScreen } from '../screens/MainScreen'
import { AdvertisementScreen } from '../screens/AdvertisementScreen'
import { AboutScreen } from '../screens/AboutScreen'
import { CreateAdvertisementScreen } from '../screens/CreateAdvertisementScreen'
import { THEME } from '../theme'
import Logout  from "../../Logout"
import Registration from "../../Registration"
import Login from "../../Login"
import Loading from "../../Loading"
import {CategoryAdvertisementScreen} from "../screens/CategoryAdvertisementScreen"
import ChooseCategoriesScreen from "../screens/ChooseCategoriesScreen"
import {MyAdvertisementsScreen} from "../screens/MyAdvertisementsScreen"
import {MyAdvertisementScreen} from "../screens/MyAdvertisementScreen"
import {NotificationsScreen} from "../screens/NotificationsScreen"
import { DrawerItems } from 'react-navigation-drawer'
import {EditAdvertisementScreen} from "../screens/EditAdvertisementScreen"

    const navigatorOptions = {
        defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: THEME.MAIN_COLOR,
          //marginTop: 30, // отступ от верха экрана
        },
        headerTintColor: '#fff'
        }
    }

    const CategoryAdvertisementNavigator = createStackNavigator(
        {
          ChooseCategories: ChooseCategoriesScreen,
          Main: MainScreen,
          Post: AdvertisementScreen,
          CategoryAdvertisement: CategoryAdvertisementScreen
        },
        navigatorOptions
    )

    const AdvertisementNavigator = createStackNavigator(
        {
        Main: MainScreen,
        Post: AdvertisementScreen
        },
        navigatorOptions
    )

    const MyAdvertisementsNavigator = createStackNavigator(
        {
            MyAdvertisements: MyAdvertisementsScreen,
            Main: MainScreen,
            MyPost: MyAdvertisementScreen
        },
        navigatorOptions
    )

    const CreateNavigator = createStackNavigator(
        {
            Create: CreateAdvertisementScreen,
            Edit: EditAdvertisementScreen
        },
        navigatorOptions
    )


    const bottomTabsConfig = {
        Advertisement: {
            screen: AdvertisementNavigator,
            navigationOptions: {
              tabBarLabel: 'Все',
              tabBarIcon: info => (
                <Ionicons name='ios-albums' size={25} color={info.tintColor} />
              )
            }
        },
        MyAdvertisements: {
            screen: MyAdvertisementsNavigator,
            navigationOptions: {
                tabBarLabel: 'Мои объявления',
                tabBarIcon: info => (
                    <Ionicons name='ios-folder-open' size={25} color={info.tintColor} />
                )
            }
        },
        Create: {
            screen: CreateNavigator,
            navigationOptions: {
                tabBarLabel: <Text style={{ fontSize: 10 }}>Создать новое </Text>,
                tabBarIcon: info => (
                    <Ionicons name='ios-add-circle' size={25} color={info.tintColor} />
                )
            }
        },
        Category: {
            screen: CategoryAdvertisementNavigator,
            navigationOptions: {
                tabBarLabel: 'Категории',
                tabBarIcon: info => (
                    <Ionicons name='ios-list' size={25} color={info.tintColor} />
                )
              }
        }
    }


    const BottomNavigator =
    createMaterialBottomTabNavigator(bottomTabsConfig, {
        activeTintColor: '#fff',
        shifting: true,
        barStyle: {
          backgroundColor: THEME.MAIN_COLOR
        }
    })



    const AboutNavigator = createStackNavigator(
        {
        About: AboutScreen
        },
        navigatorOptions
    )

    const LogoutNavigator = createStackNavigator(
        {
        Logout: {screen: Logout },
        },
        navigatorOptions
    )



    const NotificationsNavigator = createStackNavigator(
        {
            Notifications: NotificationsScreen
        },
        navigatorOptions
    )

    const RegistrationNavigator = createStackNavigator(
    {
        Registration: {screen: Registration },
    },
    navigatorOptions
    )

    const LoginNavigator = createStackNavigator(
    {
        Login
    },
    navigatorOptions
    )

    const CustomDrawerContentComponent = (props) => (
        // <ScrollView>
        <View>
            <View style={styles.container}>
               <Text style={styles.text}>  <Ionicons name='ios-person' size={25} style={styles.wrapper}/> {props.navigation.getParam('fio', 'Пользователь')} </Text>
            </View>
            <DrawerItems {...props} />
        </View>

        // </ScrollView>
    )

    const styles = StyleSheet.create({
        container: {
            paddingLeft: 10,
            marginTop: 50,
            marginBottom: 20,
        },
        text: {
            fontWeight: '600',
            fontSize: 16,
        },
        wrapper: {
            marginRight: 15
        }
    });


    const MainNavigator = createDrawerNavigator(
        {
        PostTabs: {
          screen: BottomNavigator,
          navigationOptions: {
            drawerLabel: 'Главная'
          }
        },
        MyAdvertisements: {
          screen: MyAdvertisementsNavigator,
          navigationOptions: {
            drawerLabel: 'Мои объявления'
          }
        },
        Categories: {
          screen: CategoryAdvertisementNavigator,
          navigationOptions: {
            drawerLabel: 'Категории'
          }
        },
        Create: {
          screen: CreateNavigator,
          navigationOptions: {
            drawerLabel: 'Новое объявление'
          }
        },
        Notifications: {
          screen: NotificationsNavigator,
          navigationOptions: {
            drawerLabel: 'Уведомления'
          }
        },
        About: {
            screen: AboutNavigator,
            navigationOptions: {
                drawerLabel: 'О приложении'
            }
        },
        Logout: {
            screen: LogoutNavigator,
            navigationOptions: {
                drawerLabel: 'Выйти'
            }
        }
        },
        {
        contentOptions: {
          activeTintColor: THEME.MAIN_COLOR,
          labelStyle: {
          },
        },
        contentComponent:  CustomDrawerContentComponent
        }
    )

    const AuthNavigator = createDrawerNavigator(
    {
        Login: {
            screen: LoginNavigator,
            navigationOptions: {
                drawerLabel: 'Авторизация'
            }
        },
        Registration: {
            screen: RegistrationNavigator,
            navigationOptions: {
                drawerLabel: 'Регистрация'
            }
        }
    },
    {
        contentOptions: {
            activeTintColor: THEME.MAIN_COLOR,
            labelStyle: {
            }
        }
    }
    )



    export default createAppContainer(createSwitchNavigator(
        {
            App: MainNavigator,
            Loading,
            Auth: AuthNavigator
        },
        {
            initialRouteName: 'Loading',
            headerMode: "none",
        }
    ));
