import {createStackNavigator} from "@react-navigation/stack";
import Main from "./components/Main";
import {SigninScreen} from "./components/Signin";
import {NavigationContainer} from "@react-navigation/native";
import React from "react";
import * as Notifications from "expo-notifications";

const Stack = createStackNavigator();
export default function App() {
    React.useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response.notification.request.content.data)
        });
        return () => subscription.remove();
    }, []);
    return (
        <NavigationContainer>
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