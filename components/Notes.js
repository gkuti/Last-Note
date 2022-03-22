import {
    Text,
    TouchableOpacity,
    Animated,
    View,
    TextInput,
    FlatList, Alert,
} from "react-native";
import Logo from "../assets/new_note.svg";
import {listStyles, styles} from "../styles/styles";
import {Swipeable} from "react-native-gesture-handler";
import React, {useState} from "react";
import {format} from 'date-fns'
import {Spinner} from "./Spinner";
import Config from "../config/Config.json";
import {useForm, Controller} from 'react-hook-form'
import Ionicons from "react-native-vector-icons/Ionicons";

export function NotesScreen({navigation, route}) {
    const [notes, setNotes] = useState([])
    const [refreshFlag, updateRefreshFlag] = useState(false)
    const [fetching, setFetching] = useState(true)

    React.useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <TouchableOpacity style={{marginRight: 16}} activeOpacity={.5} onPress={() => {
                    navigation.navigate("AddNoteScreen")
                }}>
                    <Ionicons name={"add-circle"} size={24} color={"#181818"}/>
                </TouchableOpacity>
        })
        getNotes().then(data => {
            setNotes(data)
            setFetching(false)
        }).catch(e => {
            Alert.alert("Connection Error", e)
        })
    }, [])

    const getNotes = async () => {
        const response = await fetch(Config.API_BASE_URL + 'api/notes/' + global.user.id, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json()
        if (!response.ok) {
            console.error(JSON.stringify(json))
            throw 'Unable to get Notes'
        }
        return json
    }

    React.useEffect(() => {
        if (route.params?.note) {
            updateData(route.params.note)
        }
    }, [route.params?.note]);

    const updateData = (note) => {
        const index = notes.findIndex(otherNote => otherNote.id === note.id)
        if (index > -1) {
            notes[index] = note
            console.log(note)
            updateRefreshFlag(!refreshFlag)
        } else {
            notes.push(note)
            updateRefreshFlag(!refreshFlag)
        }
        console.log(index)
    }
    const deleteNote = async (note) => {
        const response = await fetch(Config.API_BASE_URL + 'api/notes/' + note.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json()
        if (!response.ok) {
            console.error(JSON.stringify(json))
            throw 'Unable to delete Notes'
        }
        return note
    }

    return (
        <View style={{flex: 1}}>
            <Spinner visible={fetching}/>
            {notes.length === 0 ? <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity activeOpacity={.5} onPress={() => navigation.navigate("AddNoteScreen")}>
                    <View style={{flex: 0, justifyContent: "center", alignItems: "center"}}>
                        <Logo height={150}/>
                        <Text>Add a new Note</Text>
                    </View>
                </TouchableOpacity>
            </View> : <View style={listStyles.container}>
                <FlatList
                    extraData={refreshFlag}
                    data={notes}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => <NoteItem note={item} clickHandler={() => {
                        navigation.navigate("AddNoteScreen", {
                            note: item
                        })
                    }} deleteHandler={() => {
                        deleteNote(item).then(note => {
                            const newNotes = notes.filter(otherNote => otherNote.id !== note.id)
                            setNotes(newNotes)
                            updateRefreshFlag(!refreshFlag)
                        }).catch(e => {
                            Alert.alert("Connection Error", e)
                        })
                    }
                    }/>}
                />
            </View>}
        </View>
    );
}

const NoteItem = ({note, clickHandler, deleteHandler}) => {
    return (
        <Swipeable renderRightActions={(
            progress,
            dragX
        ) => {
            const opacity = dragX.interpolate({
                inputRange: [-86, 0],
                outputRange: [1, 0],
                extrapolate: 'clamp',
            });

            return (
                <Animated.View style={[listStyles.deleteButton, {opacity}]}>
                    <TouchableOpacity onPress={deleteHandler}>
                        <Text style={listStyles.deleteButtonText}>{"Delete"}</Text>
                    </TouchableOpacity>
                </Animated.View>
            )
        }}>
            <TouchableOpacity activeOpacity={.5} onPress={clickHandler}>
                <View>
                    <View style={listStyles.noteItemContainer}>
                        <Text
                            style={listStyles.noteTitle}>{note.noteTitle}</Text>
                        <View style={listStyles.noteDetailContainer}>
                            <Text
                                style={[listStyles.note, {marginRight: 10, flex: 0}]}>
                                {format(new Date(note.updatedAt), 'dd/MM/yyyy')}
                            </Text>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode={'tail'}
                                style={listStyles.note}>{note.note}</Text>
                        </View>
                    </View>
                    <View style={[listStyles.lineDivider, {marginLeft: 16}]}/>
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
}

export function AddNoteScreen({navigation, route}) {
    const [saving, setSaving] = useState(false)
    let note
    if (route.params) {
        note = route.params.note
    }
    const {
        control,
        handleSubmit,
        formState: {isValid}
    } = useForm(
        {
            mode: "onChange",
            defaultValues: {
                name: note === undefined ? "" : note.noteTitle,
                note: note === undefined ? "" : note.note,
                comment: note === undefined ? "" : note.additionalComment,
            }
        }
    )

    const onSubmit = data => {
        saveNote({
            userId: global.user.id,
            noteTitle: data.name,
            note: data.note,
            additionalComment: data.comment
        }).then(data => {
            navigation.navigate({
                name: 'NotesScreen',
                params: {note: data},
                merge: true,
            });
        }).catch(e => {
            setSaving(false)
            console.error(e)
            Alert.alert("Error Occurred", "Note saving failure")
        })
    }


    const saveNote = async (data) => {
        setSaving(true)
        const route = note === undefined ? 'api/notes/' : "api/notes/" + note.id
        const response = await fetch(Config.API_BASE_URL + route, {
            method: note === undefined ? 'POST' : 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const json = await response.json()
        if (!response.ok) {
            console.error(JSON.stringify(json))
            throw json
        }
        setSaving(false)
        return json
    }
    return (
        <View style={styles.container}>
            <Spinner visible={saving}/>
            <Text style={styles.header}>Note Name</Text>
            <Controller
                control={control}
                name="name"
                render={({field: {onChange, value, onBlur}}) => (
                    <TextInput
                        style={styles.textInput}
                        placeholder="metamask"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        maxLength={20}/>
                )}
                rules={{
                    required: {
                        value: true,
                        message: 'Title is required!'
                    }
                }}
            />
            <Text style={styles.header}>Note</Text>
            <Controller
                control={control}
                name="note"
                render={({field: {onChange, value, onBlur}}) => (
                    <TextInput
                        style={styles.NoteTextInput}
                        placeholder="3#56@1342**/"
                        multiline={true}
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}/>
                )}
                rules={{
                    required: {
                        value: true,
                        message: 'Note is required!'
                    }
                }}
            />
            <Text style={styles.header}>Additional Comment</Text>
            <Controller
                control={control}
                name="comment"
                render={({field: {onChange, value, onBlur}}) => (
                    <TextInput
                        style={styles.textInput}
                        placeholder="optional"
                        multiline={true}
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}/>
                )}
            />
            <TouchableOpacity style={!isValid ? styles.buttonDisabled : styles.button} activeOpacity={.7}
                              onPress={handleSubmit(onSubmit)}>
                <Text style={[styles.text, {textAlign: "center"}]}>{"Save"}</Text>
            </TouchableOpacity>
        </View>
    );
}

