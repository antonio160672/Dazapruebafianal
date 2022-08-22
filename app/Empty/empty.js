import React from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'
function Empty(props) {
    return (
        <View>
            <Text style={styles.title}>
                {props.text}
            </Text>
        </View>
    )
}
const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft:10

    }
})
export default Empty;