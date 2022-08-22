import React from 'react'
import {
    View,
    Text,
    TouchableHighlight,
    Image
} from 'react-native'
import Separator from './separator'
import styles from './componentesDivice'

function Divice(props) {
    const color =
        props.connected ? 'green' :
            props.connected === "undefined" ? 'red' : '#fff';

    const testPeripheral = () => {
        console.log('hola mundo')
        console.log(props)
    }

    return (
        <>
            <TouchableHighlight
                style={
                    styles.wrapper
                }
                onPress={props.onPress}
            >
                <View
                    style={styles.wrapperName,
                        { backgroundColor: color }}
                        onPress={testPeripheral}
                >
                    <View
                        style={styles.wrapperLeft}
                        
                    >
                        <Image
                            style={styles.iconLeft}
                            source={props.iconLeft}
                        />
                    </View>
                    <View
                        style={styles.wrapperRigth}
                    >
                        <Text style={styles.Name}
                        >
                            {props.name}
                        </Text>
                        <Text
                            style={styles.Name}
                        >
                            {props.rssi}
                        </Text>
                        <Text
                            style={styles.Name}
                        >{props.id}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
            <Separator />
        </>

    )
}
export default Divice;