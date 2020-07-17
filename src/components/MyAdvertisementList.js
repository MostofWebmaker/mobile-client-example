import React from 'react'
import { View, StyleSheet, FlatList, Text } from 'react-native'
import { MyAdvertisement } from './MyAdvertisement'

const MyAdvertisementList = ({ data, onOpen, navigation }) => {
    if (data && data.length) {
        return (
            <View>
                <View style={styles.wrapper}>
                    <FlatList
                        data={data}
                        keyExtractor={post => post.id.toString()}
                        renderItem={({ item }) => <MyAdvertisement post={item} onOpen={onOpen} />}
                    />
                </View>
            </View>
        )
    } else {
        return (
            <View style={styles.center}>
                <Text style={styles.text}>У вас пока нет ни одного объявления...</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        padding: 10
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 15,
        fontWeight: "300"
    }
})
export default MyAdvertisementList
