import React, {
    useState,
    useEffect,
} from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StatusBar,
    NativeModules,
    NativeEventEmitter,
    Platform,
    PermissionsAndroid,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import moment from 'moment';

import Styles from './componentesDispositivosBLE'
import { Buffer } from "buffer"
import BleManager from 'react-native-ble-manager';
import Subtitle from '../subtitle';
import Divice from '../Divice/divice';
import Empty from '../Empty/empty';
import AsyncStorage from '@react-native-async-storage/async-storage';




let _ = require('underscore')
let global = false;
let deviceObje = new Object();
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
const peripherals = new Map();


function DispositivosBLE(props) {
    const [isScanning, setIsScanning] = useState(false);
    const [peripherals, setPeripherals] = useState(new Map());
    const [peripheralInfo2, setPeripheralInfo] = useState(new Map());
    const [list, setList] = useState([]);
    const [realTime, setRealTime] = useState(false);
    const [arrayAcele, setArrayAcele] = useState([]);
    const render = ({ item, index }) => {
        return <Divice
            {...item}
            onPress={() => testPeripheral(item)}
        />
    }

    useEffect(() => {

        console.log(deviceObje)

        BleManager.start({ showAlert: false });

        bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
        bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
        bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                if (result) {
                  console.log("Permission is OK");
                } else {
                  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                    if (result) {
                      console.log("User accept");
                    } else {
                      console.log("User refuse");
                    }
                  });
                }
            });
          }  
          
    }, []);

    useEffect( () => {
        for (let prop in deviceObje) {
            deviceObje[prop] = []
        }
        // console.log(deviceObje);
        // if (realTime) {
        //     interval = setInterval(() => {
        //         insertInfo()
        //         for (let prop in deviceObje) { 
        //             deviceObje[prop] = []
        //         }
        //     }, 30000);
        // } else {
        //     clearInterval(interval);
        //     setArrayAcele([]);
        //     //setList([])
        // }
        // return () => clearInterval(interval);
    }, [realTime]);


    useEffect( () => {
        startScan()

    }, []);

    const startScan = async () => {
        console.log("1");
        setList([])
        await BleManager.enableBluetooth()
            .then(() => {
                console.log('The bluetooh is already enabled or the user confirm');
            })
            .catch((error) => {
                console.log('The user refuse to enable bluetooth');
            });
        if (!isScanning) {
            await BleManager.scan([], 3, true).then((results) => {
                console.log('Scanning...');
                setIsScanning(true);
            }).catch(err => {
                console.error(err);
            });
        }
    }

    const handleDiscoverPeripheral = (peripheral) => {
        console.log("2");
        if (!peripheral.name) {
            peripheral.name = 'NO NAME';
        }
        setPeripherals(peripherals.set(peripheral.id, peripheral));
        setList(Array.from(peripherals.values()));
    }

    const handleStopScan = () => {
        console.log("3");
        console.log('Scan is stopped');
        setIsScanning(false);
        setArrayAcele([])
        getdata()
    }

    const handleDisconnectedPeripheral = (data) => {
        console.log('4')
        let peripheral = peripherals.get(data.peripheral);
        if (peripheral) {
            peripheral.connected = false;
            peripherals.set(peripheral.id, peripheral);
            setList(Array.from(peripherals.values()));
        }
        setRealTime(false)
        console.log('segun el automatico' + data.peripheral);
    }
    const disconect = () => {
        console.log('5')
        for (const [key, Data1] of Object.entries(deviceObje)) {
            let peripheral = peripherals.get(key);
            if (peripheral) {
                peripheral.connected = false;
                console.log(peripheral.id);
                BleManager.disconnect(key);
                peripherals.set(peripheral.id, peripheral);
                setList(Array.from(peripherals.values()));
            }
            setRealTime(false)
            console.log('desconectado manual ' + key);
        }
    }

    const retrieveConnected = async () => {
        console.log("6");
        await BleManager.getConnectedPeripherals([]).then((results) => {
            results.forEach((result) => {
                result.connected = true;
                peripherals.set(result.id, result);
                setRealTime(true)
                setList(Array.from(peripherals.values()));
            })
        }).catch((error) => {
            console.log('Connection error', error);
        });
    }

    const handleUpdateValueForCharacteristic = async ({ value, peripheral, characteristic, service }) => {
        console.log("Entro")
        // if (global) {
        //     const buffer = Buffer.from(value);

        //     const dataacelero = buffer.toString() + "," + peripheral;
        //     var ejes = buffer.toString().split(",")
        //     // Detección de la caída libre
        //     if((ejes[0] == 1)){

        //         console.log("Se detecto caida");
        //         Alert.alert("DETECCIÓN DE UNA CAÍDA", "SE DETECTO UNA CAÍDA", [ { text: "OK", onPress: () => console.log("OK Pressed") }])

        //     }
        //     if((ejes[0] == 0)){

        //         console.log(ejes[1]);


        //     }

        // }

    }

    const saveData = async (data) => {
        try {
            key =data.id 
            await AsyncStorage.setItem(key, JSON.stringify(data))
            console.log("agregado o actualizado");
        } catch (e) { 
            console.error(e);  
        }
    }

    const getdata = async () => {
        try {
            keys = await AsyncStorage.getAllKeys()            
            if (keys.length > 0) {
                jsonValues = await AsyncStorage.multiGet(keys)
                jsonValues.map(async function (jsonValue) {
                    const value=JSON.parse(jsonValue[1])
                    console.log(jsonValue[0])
                    await automaticconnect(value)                    
                })
            }
        } catch (e) {
            console.error("error al consultar");  
            console.error(e);  
        }
    }

    const automaticconnect = async (peripheral) => {
        await BleManager.connect(peripheral.id).then(() => {
            let d = peripherals.get(peripheral.id);
            if (d) {
                d.connected = true;
                setPeripherals(peripherals.set(peripheral.id, d))
                setList(Array.from(peripherals.values()));
            }
            setTimeout(async () => {
                await BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
                    setPeripheralInfo(peripheralInfo2.set(peripheral.id, peripheralInfo))
                    var service = peripheralInfo.characteristics[3].service;
                    var bakeCharacteristic = peripheralInfo.characteristics[3].characteristic;

                    if (!_.has(deviceObje, peripheral.id)) {
                        deviceObje[peripheral.id] = []
                    }
                    setTimeout(async () => {
                        await  BleManager.startNotification(peripheral.id, service, bakeCharacteristic).then(
                            () => {
                                console.log("entro al star notification");
                            }).catch((error) => {
                                console.log('Notification error', error);
                            });
                    }, 1000);
                }).catch((error) => {
                    console.log('Notification error', error);
                });
            }, 1500);
        }).catch((error) => {
            console.log('Connection error', error);
        });
    }

    const testPeripheral = async (peripheral) => {
        var peripheral2 = peripheral
        if (peripheral) {
            if (peripheral.connected) {
                let d = peripherals.get(peripheral.id);
                if (d) {
                    d.connected = "false";
                    setPeripherals(peripherals.set(peripheral.id, d))
                    setList(Array.from(peripherals.values()));
                }
                await BleManager.disconnect(peripheral.id);
            } else {
                await BleManager.connect(peripheral.id).then(() => {
                    let d = peripherals.get(peripheral.id);
                    if (d) {
                        d.connected = true;
                        setPeripherals(peripherals.set(peripheral.id, d))
                        setList(Array.from(peripherals.values()));
                    }
                    setTimeout(() => {
                        BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
                            setPeripheralInfo(peripheralInfo2.set(peripheral.id, peripheralInfo))
                            var service = peripheralInfo.characteristics[3].service;
                            var bakeCharacteristic = peripheralInfo.characteristics[3].characteristic;

                            if (!_.has(deviceObje, peripheral.id)) {
                                deviceObje[peripheral.id] = []
                            }
                            setTimeout(() => {
                                BleManager.startNotification(peripheral.id, service, bakeCharacteristic).then(
                                    () => {
                                        saveData(peripheral2)
                                    }).catch((error) => {
                                        console.log('Notification error', error);
                                    });
                            }, 1000);
                        });
                    }, 1500);
                }).catch((error) => {
                    console.log('Connection error', error);
                });
            }
        }
    }


    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.container}

                contentInsetAdjustmentBehavior="automatic">

                <ScrollView
                    style={Styles.scrollView}>
                    {global.HermesInternal == null ? null : (
                        <View style={Styles.engine}>
                            <Text style={Styles.footer}>Engine: Hermes</Text>
                        </View>
                    )}
                    <View style={Styles.body}>
                        <Text style={styles.text}>ESCANEO DE DISPOSITIVOS BLUETOOTH</Text>

                        <View style={styles.contBoton}>
                            <View style={{ margin: 10 }}>
                                <TouchableOpacity onPress={() => startScan()} style={Styles.appButtonContainer}>
                                    <Text style={Styles.appButtonText}>'Scan Bluetooth'</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ margin: 10 }}>
                                {!realTime && (
                                    <TouchableOpacity onPress={() => retrieveConnected()} style={Styles.appButtonContainer}>
                                        <Text style={Styles.appButtonText}>Recuperar datos</Text>
                                    </TouchableOpacity>
                                )}
                                {realTime && (
                                    <TouchableOpacity onPress={() => disconect()} style={Styles.appButtonContainer}>
                                        <Text style={Styles.appButtonText}>Terminar Experimento</Text>
                                    </TouchableOpacity>
                                )}

                            </View>
                        </View>
                        <Subtitle title="LISTA DE DISPOSITIVOS" />
                        {(list.length == 0) &&
                            <Empty text='No hay dispositivos' />
                        }

                    </View>
                </ScrollView>

                {(list.length > 0) && (
                    <FlatList
                        data={list}
                        renderItem={
                            render
                        }

                    />
                )}
            </SafeAreaView>
        </>
    )
} const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    text: {
        fontSize: 30,
        marginLeft: 15
    },
    icon: {
        width: 200,
        height: 200,
        marginVertical: 50

    },
    contBoton: {
        paddingVertical: 15,
        flexDirection: 'row'
    },
})

export default DispositivosBLE;