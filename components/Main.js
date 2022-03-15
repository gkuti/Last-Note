import {AddContactScreen, ContactsScreen} from "./Contacts";
import {Platform, TouchableOpacity} from "react-native";
import {AddNoteScreen, NotesScreen} from "./Notes";
import {createStackNavigator} from "@react-navigation/stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import {NavigationContainer} from "@react-navigation/native";
import SettingsScreen from "./Settings";
import {styles} from "../styles/styles";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ContactStack() {
    return (
        <Stack.Navigator
            initialRouteName="Contacts">
            <Stack.Screen
                name="ContactsScreen"
                component={ContactsScreen}
                options={{
                    title: "Contacts",
                    headerLeft: () => null,
                }}/>
            <Stack.Screen
                name="AddContactScreen"
                component={AddContactScreen}
                options={{
                    title: "Add Contact",
                    headerBackTitleVisible: false,
                    headerLeftContainerStyle: {paddingLeft: Platform.OS === "ios" ? 16 : 0},
                    headerRightContainerStyle: {paddingRight: Platform.OS === "ios" ? 16 : 0},
                    headerBackImage: () => <Ionicons name={"arrow-back"} size={24} color={"#181818"}/>
                }}/>
        </Stack.Navigator>
    );
}

function SettingsStack() {
    return (
        <Stack.Navigator
            initialRouteName="Settings">
            <Stack.Screen
                name="SettingsScreen"
                component={SettingsScreen}
                options={{
                    title: "Settings",
                    headerLeft: () => null,
                    headerRight: () =>
                        <TouchableOpacity style={{marginRight: 16}} activeOpacity={.5} onPress={() => {
                        }}>
                            <Ionicons name={"checkmark-circle"} size={24} color={"#181818"}/>
                        </TouchableOpacity>
                }}/>
        </Stack.Navigator>
    );
}

function NoteStack() {
    return (
        <Stack.Navigator
            initialRouteName="Notes">
            <Stack.Screen
                name="NotesScreen"
                component={NotesScreen}
                options={{
                    title: "Notes",
                    headerLeft: () => null,
                }}/>
            <Stack.Screen
                name="AddNoteScreen"
                component={AddNoteScreen}
                options={{
                    title: "Add Note",
                    headerBackTitleVisible: false,
                    headerLeftContainerStyle: {paddingLeft: Platform.OS === "ios" ? 16 : 0},
                    headerRightContainerStyle: {paddingRight: Platform.OS === "ios" ? 16 : 0},
                    headerBackImage: () => <Ionicons name={"arrow-back"} size={24} color={"#181818"}/>
                }}/>
        </Stack.Navigator>
    );
}

export default function Main() {
    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;

                    if (route.name === "Notes") {
                        iconName = focused
                            ? "folder"
                            : "folder-outline";
                    } else if (route.name === "Contacts") {
                        iconName = focused ? "people" : "people-outline";
                    } else if (route.name === "Settings") {
                        iconName = focused ? "settings" : "settings-outline";
                    }
                    return <Ionicons name={iconName} size={size} color={color}/>;
                },
                headerShown: false,
                tabBarActiveTintColor: "#181818",
                tabBarInactiveTintColor: "#9d9d9d",
            })}
        >
            <Tab.Screen name="Notes" component={NoteStack}/>
            <Tab.Screen name="Contacts" component={ContactStack}/>
            <Tab.Screen name="Settings" component={SettingsStack}/>
        </Tab.Navigator>
    )
}