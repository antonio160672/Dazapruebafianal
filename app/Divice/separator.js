import React from 'react'
import {
    View,
    StyleSheet
} from 'react-native'
function Divice(props) {
    return (
            <View
                style={[styles.separador,
                {
                    borderColor:props.color? props.color:'#444D54'
                }]}
            />

    )
}
const styles = StyleSheet.create({
    separador: {
        flex:1,
        borderTopWidth:2,
        marginLeft:20,
        marginRight:25
    },
    
})
export default Divice;