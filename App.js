import {createStackNavigator} from "@react-navigation/stack";
import Main from "./components/Main";
import {SigninScreen} from "./components/Signin";
import {NavigationContainer} from "@react-navigation/native";
import React from "react";
import * as Notifications from "expo-notifications";
import {StatusBar} from "react-native";

const Stack = createStackNavigator();
export default function App() {
    return (
        <NavigationContainer>
            <StatusBar
                animated={true}
                backgroundColor="#61dafb"
                barStyle={'dark-content'}/>
            <Stack.Navigator initialRouteName="SigninScreen">
                <Stack.Screen
                    name="SigninScreen"
                    component={SigninScreen}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Main"
                    component={Main}
                    options={{
                        headerShown: false,
                        headerBackTitleVisible: false
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}