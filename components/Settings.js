import {Image, Pressable, Text, View} from "react-native";
import {listStyles, styles, textStyles} from "../styles/styles";
import {TouchableOpacity} from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, {useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/build/providers/Google";
import {CommonActions} from "@react-navigation/native";

export default function SettingsScreen({navigation}) {
    const [user, setUser] = useState({})
    React.useEffect(() => {
        setUser(global.user)
    }, [])

    const signOut = async () => {
        const token = AsyncStorage.getItem('token')
        AuthSession.revokeAsync({
            token: token,
            clientId: '977657415683-pr3k3bm7cmg5b3oj8f414kr8sq6m7hj0.apps.googleusercontent.com'
        }, Google.discovery).then(r => {
            AsyncStorage.removeItem('token')
            navigation.getParent().dispatch(
                CommonActions.navigate({
                        name: 'SigninScreen'
                    }
                ))
        })
    }
    return (<View>
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
                <Text style={listStyles.initials}>{"GK"}</Text>
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
        <TouchableOpacity activeOpacity={.5}>
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