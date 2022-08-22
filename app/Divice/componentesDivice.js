import { StyleSheet } from 'react-native'
import {
    Colors,
} from 'react-native/Libraries/NewAppScreen';

export default StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'space-between'
    },
    wrapperLeft: {
        width: 40,
        borderRadius: 20,
        borderColor: 'gray',
        borderWidth: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapperRigth: {
        width: 300,
        marginTop:-35
    },
    iconLeft: {
        width: 30,
        height: 30,
    },
    wrapperName: {
        justifyContent: 'flex-start',
        marginLeft: 15
    },
    Name: {
        fontSize: 14,
        textAlign: 'center',
        color: '#333333',
        marginTop:2,
    },
    iconRight: {
        width: 30,
        height: 30
    },
});