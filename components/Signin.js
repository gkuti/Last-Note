import {ActivityIndicator, Pressable, Text, TouchableOpacity, View} from "react-native";
import Logo from "../signin.svg";
import {styles} from "../styles/styles";
import * as Google from "expo-auth-session/build/providers/Google";
import React, {useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from "expo-auth-session";

export function SigninScreen({navigation}) {
    const [data, setData] = useState({})
    const [oAuthSigned, setOAuthSigned] = useState(true)

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: '977657415683-pr3k3bm7cmg5b3oj8f414kr8sq6m7hj0.apps.googleusercontent.com',
        iosClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
        androidClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
        webClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    });

    const getUserProfile = async (token) => {
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            const json = await response.json()
            if (!response.ok) {
                setOAuthSigned(false)
                throw Error(JSON.stringify(json))
            }
            setData(json)
        } catch (error) {
            console.error(error)
        }
    }
    const saveUser = async (user) => {
        try {
            const jsonValue = JSON.stringify(user)
            console.log(JSON.parse(jsonValue))
            await AsyncStorage.setItem('userProfile', jsonValue)
        } catch (e) {
            console.error(e)
        }
    }

    const saveToken = async (token) => {
        try {
            await AsyncStorage.setItem('token', token)
        } catch (e) {
            console.error(e)
        }
    }

    React.useEffect(() => {
        if (response?.type === 'success') {
            console.log(response)
            const {authentication} = response;
            saveToken(authentication.accessToken).then(() => {
                    setOAuthSigned(true)
                    getUserProfile(authentication.accessToken).catch(e => {
                            console.error(e)
                        }
                    )
                }
            )
        }
    }, [response])

    React.useEffect(() => {
        if (Object.keys(data).length !== 0) {
            saveUser(data).then(_ => {
                navigation.replace("Main")
            })
        }
    }, [data])

    React.useEffect(() => {
        getToken()
    }, [])

    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            console.log(token)
            if (token !== null) {
                getUserProfile(token).catch(e => {
                    setOAuthSigned(false)
                    console.error(e)
                })
            } else {
                setOAuthSigned(false)
            }
        } catch (e) {
            console.error(e)
            setOAuthSigned(false)
        }
    }

    return (
        <View style={{padding: 16}}>
            <Text style={{marginTop: 52, fontSize: 48, fontWeight: "bold"}}>
                {"Welcome!"}
            </Text>
            <Text style={{fontSize: 24, fontWeight: "bold"}}>
                {"Sign in to continue"}
            </Text>
            <View style={{alignItems: "center", marginTop: 24}}>
                <Logo height={300} width={300}/>
            </View>
            {oAuthSigned ? <ActivityIndicator size="large" color="#181818"/> :
                <TouchableOpacity style={styles.button} activeOpacity={.7} onPress={() => promptAsync()}>
                    <Text style={[styles.text, {textAlign: "center"}]}>{"Sign in with Google"}</Text>
                </TouchableOpacity>
            }
        </View>
    )
}

