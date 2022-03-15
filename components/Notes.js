import {Text, TouchableOpacity, Animated, View, TextInput, Pressable, FlatList} from "react-native";
import Logo from "../new_note.svg";
import {listStyles, styles} from "../styles/styles";
import {Swipeable} from "react-native-gesture-handler";

export function NotesScreen({navigation}) {
    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity activeOpacity={.5} onPress={() => navigation.navigate("AddNoteScreen")}>
                <View style={{flex: 0, justifyContent: "center", alignItems: "center"}}>
                    <Logo height={150}/>
                    <Text>Add a new Note</Text>
                </View>
            </TouchableOpacity>
        </View>
        // <NotesListView/>
    );
}

const NotesListView = () => {
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
                renderItem={({item}) => <NoteItem/>}
            />
        </View>
    );
}

const NoteItem = () => {
    return (
        <Swipeable renderRightActions={renderRightActions}>
            <TouchableOpacity activeOpacity={.5}>
                <View>
                    <View style={listStyles.noteItemContainer}>
                        <Text style={listStyles.noteTitle}>{"My credit informatio..."}</Text>
                        <View style={listStyles.noteDetailContainer}>
                            <Text style={[listStyles.note, {marginRight: 10}]}>{"10/11/2022"}</Text>
                            <Text style={listStyles.note}>{"anita.nelson@mail.co..."}</Text>
                        </View>
                    </View>
                    <View style={[listStyles.lineDivider, {marginLeft: 16}]}/>
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

export function AddNoteScreen() {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.header}>Note Name</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="metamask"
                    maxLength={20}
                />
                <Text style={styles.header}>Note</Text>
                <TextInput
                    style={styles.NoteTextInput}
                    placeholder="3#56@1342**/"
                    multiline={true}
                />
                <Text style={styles.header}>Additional Comment</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="optional"
                    multiline={true}
                />
                <Pressable style={styles.button}>
                    <Text style={styles.text}>{"Save"}</Text>
                </Pressable>
            </View>
        </View>
    );
}

