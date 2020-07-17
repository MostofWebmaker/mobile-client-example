import React from 'react'
import {View, Text, StyleSheet, FlatList} from 'react-native'
import {NotificationItemScreen} from "../screens/NotificationItemScreen"

export const NotificationsList = ({data, navigation}) => {
    if (data && data.length) {
        return (
            <View>
                <View style={styles.wrapper}>
                    <FlatList
                        data={data}
                        keyExtractor={notification => notification.id.toString()}
                        renderItem={({ item }) => <NotificationItemScreen navigation={navigation} notification={item} />}
                    />
                </View>
            </View>
        )
    } else {
        return (
            <View style={styles.center}>
                <Text style={styles.text}>Список уведомлений пока пуст...</Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  version: {
  },
  text: {
      fontSize: 15,
      fontWeight: "300"
  },
  wrapper: {
      padding: 10
  }
})
