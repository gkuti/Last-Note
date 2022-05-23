import {
    Text,
    TouchableOpacity,
    Animated,
    View,
    TextInput,
    FlatList, Alert, Modal,
} from "react-native";
import Logo from "../assets/new_note.svg";
import {listStyles, styles, textStyles} from "../styles/styles";
import {Swipeable} from "react-native-gesture-handler";
import React, {useState} from "react";
import {format} from 'date-fns'
import {Spinner} from "./Spinner";
import Config from "../config/Config.json";
import {useForm, Controller} from 'react-hook-form'
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Notifications from "expo-notifications";
import {getInitials} from "../utils/Util";

export function NotesScreen({navigation, route}) {
    const [notes, setNotes] = useState([])
    const [refreshFlag, updateRefreshFlag] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [checkin, setCheckin] = useState(false)

    // Get the last notification received when the user opens the app
    const lastNotificationResponse = Notifications.useLastNotificationResponse();
    React.useEffect(() => {
        if (
            lastNotificationResponse &&
            lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
        ) {
            //Get the userId from the notification data model and perform checkin
            const userId = lastNotificationResponse.notification.request.content.data.userId
            console.log(userId)
            userCheckin(userId).then(data => {
                    console.log(data)
                    setCheckin(true)
                }
            ).catch(reason => {
                console.log(reason)
                alert('Failed to checkIn, try again using the checkin button from the settings page');
            })
        }
    }, [lastNotificationResponse]);

    React.useEffect(() => {
        //Add top right icon to toolbar
        navigation.setOptions({
            headerRight: () =>
                <TouchableOpacity style={{marginRight: 16}} activeOpacity={.5} onPress={() => {
                    navigation.navigate("AddNoteScreen")
                }}>
                    <Ionicons name={"add-circle"} size={24} color={"#181818"}/>
                </TouchableOpacity>
        })
        //Load user notes
        getNotes().then(data => {
            setNotes(data)
            setFetching(false)
        }).catch(e => {
            Alert.alert("Connection Error", e)
        })
    }, [])

    //API call to submit a checkin
    const userCheckin = async (userId) => {
        const response = await fetch(Config.API_BASE_URL + 'api/checkin/' + userId, {
            method: 'PUT'
        });
        if (!response.ok) {
            const json = await response.json()
            console.error(JSON.stringify(json))
            throw 'Unable to checkin'
        }
        return response.status
    }

    //API call to fetch user notes using the users id
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

    //We use this hook to update the in memory notes list when the user creates or modifies a note
    React.useEffect(() => {
        if (route.params?.note) {
            updateData(route.params.note)
        }
    }, [route.params?.note]);

    //Updates the notes list with the new note by updating the notes if present or appending the notes if it's new
    const updateData = (note) => {
        //We find the index of the note from the current note list, it returns -1 if it's  not found
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

    //API call to delete a users note using the note id
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

    //List of notes screen, displays "Add a new Note" view when the list of notes is empty
    return (
        <View style={{flex: 1}}>
            <Spinner visible={fetching}/>
            <CheckinSuccess visible={checkin && !fetching} dismiss={() => {
                setCheckin(false)
            }}/>
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

//A single row note item using a Swipeable component to support swipe to delete
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

    //Check if the route contains a note to determine if the user is editing or adding a new note
    let note
    if (route.params) {
        note = route.params.note
    }

    //Form controller using isValid to determine form state
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

    //Button onPress handler for saving a new note
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

    //API call to save a new note
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

const CheckinSuccess = ({visible, dismiss}) => {
    return <Modal statusBarTranslucent={true} transparent visible={visible}>
        <View style={[styles.modal, {justifyContent: 'center'}]}>
            <View style={{backgroundColor: "#ffffff", margin: 32, borderRadius: 16, padding: 24}}>
                <Ionicons name={"checkmark-circle"} size={64} color={"#181818"} style={{
                    alignSelf: "center"
                }}/>
                <Text
                    style={[textStyles.header, {
                        fontSize: 16, textAlign: "center", paddingTop: 10
                    }]}>Checkin Success</Text>
                <Text
                    style={[textStyles.text, {
                        textAlign: "center"
                    }]}>You will recieve another notification on your next checkin date</Text>

                <TouchableOpacity style={{
                    marginTop: 16,
                    marginBottom: 16,
                    marginLeft: 48,
                    marginRight: 48,
                    justifyContent: "center",
                    paddingVertical: 12,
                    borderRadius: 24,
                    backgroundColor: "#181818"
                }} activeOpacity={.7} onPress={dismiss}>
                    <Text style={[styles.text, {textAlign: "center"}]}>{"Dismiss"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
}

