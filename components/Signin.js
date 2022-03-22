import {ActivityIndicator, Platform, Text, TouchableOpacity, View} from "react-native";
import Logo from "../assets/signin.svg";
import {styles} from "../styles/styles";
import * as Google from "expo-auth-session/build/providers/Google";
import React, {useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Config from "../config/Config.json";

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
        global.user = user
        try {
            const jsonValue = JSON.stringify(user)
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
    const savePushToken = async (user) => {
        console.log(user)
        const response = await fetch(Config.API_BASE_URL + 'api/user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        const json = await response.json()
        console.log(json)
        if (!response.ok) {
            console.error(JSON.stringify(json))
            throw "Unable to save token"
        }
    }

    React.useEffect(() => {
        if (response?.type === 'success') {
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
            // registerForPushNotificationsAsync().then(token => {
            //     if (token != null) {
            //         savePushToken({userId: data.id, pushToken: token}).then(_ =>
            //             saveUser(data).then(_ => {
            //                 navigation.replace("Main")
            //             })
            //         ).catch(e => {
            //             setOAuthSigned(false)
            //             console.error(e)
            //         })
            //     } else {
            //         setOAuthSigned(false)
            //     }
            // }).catch(e => {
            //     setOAuthSigned(false)
            //     console.error(e)
            // })
        }
    }, [data])

    React.useEffect(() => {
        getToken()
    }, [])

    const getToken = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
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

    const registerForPushNotificationsAsync = async () => {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        return (await Notifications.getExpoPushTokenAsync()).data

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    };

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

