import {ActivityIndicator, Image, Modal, Pressable, Text, View} from "react-native";
import {listStyles, styles, textStyles} from "../styles/styles";
import {TouchableOpacity} from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, {useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/build/providers/Google";
import {CommonActions} from "@react-navigation/native";
import {getInitials} from "../utils/Util";
import {Spinner} from "./Spinner";
import Config from "../config/Config.json";

export default function SettingsScreen({navigation}) {
    const [user, setUser] = useState({})
    const [frequency, setFrequency] = useState(false)
    const [loading, setLoading] = useState(true)
    const [checkin, setCheckin] = useState({})

    React.useEffect(() => {
        setUser(global.user)
        getCheckin().then(data => {
            setLoading(false)
            setCheckin(data)
        }).catch(e => {
            setLoading(false)
            console.error(e)
        })
    }, [])

    const getCheckin = async () => {
        const response = await fetch(Config.API_BASE_URL + 'api/checkin/' + global.user.id, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json()
        if (!response.ok) {
            console.error(JSON.stringify(json))
            throw 'Unable to get Contacts'
        }
        return json
    }

    const updateFrequency = async (checkin) => {
        setLoading(true)
        const response = await fetch(Config.API_BASE_URL + 'api/checkin/frequency/', {
            headers: {
                'Content-Type': 'application/json'
            }, method: 'PUT', body: JSON.stringify(checkin)
        });
        const json = await response.json()
        if (!response.ok) {
            console.error(JSON.stringify(json))
            throw 'Unable to get Contacts'
        }
        return json
    }

    const signOut = async () => {
        const token = AsyncStorage.getItem('token')
        AuthSession.revokeAsync({
            token: token, clientId: '977657415683-pr3k3bm7cmg5b3oj8f414kr8sq6m7hj0.apps.googleusercontent.com'
        }, Google.discovery).then(r => {
            AsyncStorage.removeItem('token')
            navigation.getParent().dispatch(CommonActions.navigate({
                name: 'SigninScreen'
            }))
        })
    }
    return (<View>
        <Spinner visible={loading}/>
        <FrequencyPreference update={(value) => {
            console.log(value)
            setFrequency(false)
            updateFrequency({userId: global.user.id, checkinFrequency: value}).then(data => {
                setCheckin(data)
                setLoading(false)
            })
        }} visible={frequency} close={() => {
            setFrequency(false)
        }} checkinFrequency={checkin.checkinFrequency}
        />
        <Text style={textStyles.header}>ACCOUNT</Text>
        <View style={{backgroundColor: "#ffffff"}}>
            <View style={{
                marginBottom: 24, backgroundColor: "#e3e3e3", height: 1
            }}/>
            {user.picture == null || user.picture === "" ? <View style={{
                alignSelf: "center",
                justifyContent: "center",
                backgroundColor: "#f3f3f3",
                borderRadius: 50,
                height: 100,
                width: 100
            }}>
                <Text style={listStyles.initials}>{getInitials(user.name)}</Text>
            </View> : <Image
                style={{width: 100, height: 100, borderRadius: 50, alignSelf: "center"}}
                source={{uri: user.picture}}
            />}
            <Text
                style={[listStyles.name, {
                    fontSize: 15, textAlign: "center", paddingTop: 10
                }]}>{user.name}</Text>
            <Text style={[listStyles.email, {fontSize: 15, textAlign: "center"}]}>{user.email}</Text>
            <View style={{
                marginTop: 24, backgroundColor: "#e3e3e3", height: 1
            }}/>
        </View>

        <Text style={[textStyles.header, {marginTop: 24}]}>PREFERENCES</Text>
        <TouchableOpacity activeOpacity={.5} onPress={() => {
            setFrequency(!frequency)
        }}>
            <View style={{backgroundColor: "#ffffff"}}>
                <View style={{
                    backgroundColor: "#e3e3e3", height: 1
                }}/>
                <View style={{flexDirection: "row"}}>
                    <Text
                        style={[listStyles.name, {
                            fontSize: 14, padding: 16, flexGrow: 1
                        }]}>{"Check-in Frequency"}</Text>
                    <Ionicons name={"chevron-forward"} size={16} color={"#444444"}
                              style={{marginRight: 16, alignSelf: "center"}}/>
                </View>
                <View style={{
                    backgroundColor: "#e3e3e3", height: 1
                }}/>
            </View>
        </TouchableOpacity>

        <Text style={[textStyles.header, {marginTop: 24}]}>ABOUT</Text>
        <View style={{backgroundColor: "#ffffff"}}>
            <View style={{
                backgroundColor: "#e3e3e3", height: 1,
            }}/>
            <View style={{flexDirection: "row"}}>
                <Text
                    style={[listStyles.name, {
                        fontSize: 14, padding: 16, flexGrow: 1
                    }]}>{"Version"}</Text>
                <Text
                    style={[listStyles.email, {
                        fontSize: 14, padding: 16
                    }]}>{"1.0"}</Text>
            </View>
        </View>
        <TouchableOpacity activeOpacity={.5}>
            <View style={{backgroundColor: "#ffffff"}}>
                <View style={{
                    backgroundColor: "#e3e3e3", marginLeft: 16, height: 1
                }}/>
                <View style={{flexDirection: "row"}}>
                    <Text
                        style={[listStyles.name, {
                            fontSize: 14, padding: 16, flexGrow: 1
                        }]}>{"3rd-party Libraries"}</Text>
                    <Ionicons name={"chevron-forward"} size={16} color={"#444444"}
                              style={{marginRight: 16, alignSelf: "center"}}/>
                </View>
                <View style={{
                    backgroundColor: "#e3e3e3", height: 1
                }}/>
            </View>
        </TouchableOpacity>
        <Pressable style={[styles.button, {marginLeft: 16, marginRight: 16}]} onPress={() => signOut()}>
            <Text style={styles.text}>{"Signout"}</Text>
        </Pressable>
    </View>);
}

const FrequencyPreference = ({visible, close, update, checkinFrequency}) => {
    console.log(checkinFrequency)
    return <Modal statusBarTranslucent={true} transparent visible={visible}>
        <View style={[styles.modal, {justifyContent: 'center'}]}>
            <View style={{backgroundColor: "#ffffff", margin: 32, borderRadius: 16}}>
                <View style={{flexDirection: "row", paddingLeft: 16, paddingRight: 16, marginBottom: 16}}>
                    <Text
                        style={[listStyles.name, {
                            fontSize: 16, paddingTop: 12, paddingBottom: 12, flexGrow: 1, textAlign: 'center'
                        }]}>{"Check-in Frequency"}</Text>
                    <TouchableOpacity style={{justifyContent: "center", flex: 1}} activeOpacity={.5}
                                      onPress={close}>
                        <Ionicons name={"close"} size={20} color={"#444444"}/>
                    </TouchableOpacity>
                </View>
                <View style={{
                    backgroundColor: "#e3e3e3", height: 1
                }}/>
                <FrequencyRow title={"Every 5 Minutes"} clickHandler={() => update("5minutes")}
                              checked={checkinFrequency === "5minutes"}/>
                <View style={{
                    backgroundColor: "#e3e3e3", height: 1, marginLeft: 16
                }}/>
                <FrequencyRow title={"Every Day"} clickHandler={() => update("daily")}
                              checked={checkinFrequency === "daily"}/>
                <View style={{
                    backgroundColor: "#e3e3e3", height: 1, marginLeft: 16
                }}/>
                <FrequencyRow title={"Every Week"} clickHandler={() => update("weekly")}
                              checked={checkinFrequency === "weekly"}/>
                <View style={{
                    backgroundColor: "#e3e3e3", height: 1, marginLeft: 16
                }}/>
                <FrequencyRow title={"Every Month"} clickHandler={() => update("monthly")}
                              checked={checkinFrequency === "monthly"}/>
                <View style={{
                    backgroundColor: "#e3e3e3", height: 1, marginLeft: 16
                }}/>
                <FrequencyRow title={"Every 6 Months"} clickHandler={() => update("6months")}
                              checked={checkinFrequency === "6months"}/>
            </View>
        </View>
    </Modal>
}

const FrequencyRow = ({title, clickHandler, checked}) => {
    return <TouchableOpacity activeOpacity={.3} onPress={clickHandler}>
        <View style={{
            flexDirection: "row", paddingLeft: 16, paddingRight: 16
        }}>
            <Text
                style={[listStyles.name, {
                    fontSize: 14, paddingTop: 12, paddingBottom: 12, flexGrow: 1
                }]}>{title}</Text>
            {checked ? <Ionicons name={"checkmark-sharp"} size={20} color={"#444444"}
                                 style={{alignSelf: "center"}}/> : null}

        </View>
    </TouchableOpacity>
}
