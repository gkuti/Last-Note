import {Animated, FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {listStyles, styles} from "../styles/styles";
import Logo from "../add_contacts.svg";
import {Swipeable} from "react-native-gesture-handler";

export function ContactsScreen({navigation}) {
    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity activeOpacity={.5} onPress={() => navigation.navigate("AddContactScreen")}>
                <View style={{flex: 0, justifyContent: "center", alignItems: "center"}}>
                    <Logo height={150}/>
                    <Text>Add a new Contact</Text>
                </View>
            </TouchableOpacity>
        </View>
        // <ContactsListView/>
    );
}

const ContactsListView = () => {
    return (
        <View style={listStyles.container}>
            <FlatList
                data={[
                    {key: "Devin"},
                    {key: "Dan"},
                    {key: "Dominic"},
                    {key: "Jackson"},
                    {key: "James"},
                    {key: "Joel"},
                    {key: "John"},
                    {key: "Jillian"},
                    {key: "Jimmy"},
                    {key: "Julie"},
                ]}
                renderItem={({item}) => <ContactItem/>}
            />
        </View>
    );
}

const ContactItem = () => {
    return (
        <Swipeable renderRightActions={renderRightActions}>
            <TouchableOpacity activeOpacity={.5}>
                <View>
                    <View style={listStyles.contactItemContainer}>
                        <View style={listStyles.initialsContainer}>
                            <Text style={listStyles.initials}>{"AN"}</Text>
                        </View>
                        <View style={listStyles.contactContainer}>
                            <Text style={listStyles.name}>{"Anita Nelson..."}</Text>
                            <Text style={listStyles.email}>{"anita.nelson@mail.co..."}</Text>
                        </View>
                    </View>
                    <View style={listStyles.lineDivider}>
                    </View>
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
}

const renderRightActions = (
    progress,
    dragX,
) => {
    const opacity = dragX.interpolate({
        inputRange: [-86, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });


    return (
        <Animated.View style={[listStyles.deleteButton, {opacity}]}>
            <TouchableOpacity>
                <Text style={listStyles.deleteButtonText}>{"Delete"}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

export function AddContactScreen() {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.header}>Contact Name</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Firstname Lastname"
                    maxLength={20}
                />
                <Text style={styles.header}>Contact Email</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="email@mail.com, email2@mail.com"
                />
                <Text style={styles.header}>Contact Phone</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="+445566556, +23454545464"
                />
                <Pressable style={styles.button}>
                    <Text style={styles.text}>{"Save"}</Text>
                </Pressable>
            </View>
        </View>
    );
}