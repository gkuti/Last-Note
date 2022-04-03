import {Alert, Animated, FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {listStyles, styles} from "../styles/styles";
import Logo from "../assets/add_contacts.svg";
import {Swipeable} from "react-native-gesture-handler";
import React, {useEffect, useState} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import Config from "../config/Config.json";
import {Spinner} from "./Spinner";
import {Controller, useForm} from "react-hook-form";
import {getInitials} from "../utils/Util";

export function ContactsScreen({navigation, route}) {
    const [contacts, setContacts] = useState([])
    const [refreshFlag, updateRefreshFlag] = useState(false)
    const [fetching, setFetching] = useState(true)
    React.useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <TouchableOpacity style={{marginRight: 16}} activeOpacity={.5} onPress={() => {
                    navigation.navigate("AddContactScreen")
                }}>
                    <Ionicons name={"add-circle"} size={24} color={"#181818"}/>
                </TouchableOpacity>
        })
        getContacts().then(data => {
            setContacts(data)
            setFetching(false)
        }).catch(e => {
            Alert.alert("Connection Error", e)
        })
    }, [])

    const getContacts = async () => {
        const response = await fetch(Config.API_BASE_URL + 'api/contacts/' + global.user.id, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json()
        if (!response.ok) {
            console.error(JSON.stringify(json))
            throw 'Unable to get Contacts'
        }
        return json
    }

    React.useEffect(() => {
        if (route.params?.contact) {
            updateData(route.params.contact)
        }
    }, [route.params?.contact]);

    const updateData = (contact) => {
        const index = contacts.findIndex(otherContact => otherContact.id === contact.id)
        if (index > -1) {
            contacts[index] = contact
            console.log(contact)
            updateRefreshFlag(!refreshFlag)
        } else {
            contacts.push(contact)
            updateRefreshFlag(!refreshFlag)
        }
        console.log(index)
    }

    const deleteContact = async (contact) => {
        const response = await fetch(Config.API_BASE_URL + 'api/contacts/' + contact.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json()
        if (!response.ok) {
            console.error(JSON.stringify(json))
            throw 'Unable to delete Contacts'
        }
        return contact
    }

    return (
        <View style={{flex: 1}}>
            <Spinner visible={fetching}/>
            {contacts.length === 0 ? <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity activeOpacity={.5} onPress={() => navigation.navigate("AddContactScreen")}>
                    <View style={{flex: 0, justifyContent: "center", alignItems: "center"}}>
                        <Logo height={150}/>
                        <Text>Add a new Contact</Text>
                    </View>
                </TouchableOpacity>
            </View> : <View style={listStyles.container}>
                <FlatList
                    extraData={refreshFlag}
                    data={contacts}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => <ContactItem contact={item} clickHandler={() => {
                        navigation.navigate("AddContactScreen", {
                            contact: item
                        })
                    }} deleteHandler={() => {
                        deleteContact(item).then(contact => {
                            const newContacts = contacts.filter(otherContact => otherContact.id !== contact.id)
                            console.log(newContacts)
                            setContacts(newContacts)
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

const ContactItem = ({contact, clickHandler, deleteHandler}) => {
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
                    <View style={listStyles.contactItemContainer}>
                        <View style={listStyles.initialsContainer}>
                            <Text style={listStyles.initials}>{getInitials(contact.contactName).toUpperCase()}</Text>
                        </View>
                        <View style={listStyles.contactContainer}>
                            <Text style={listStyles.name}>{contact.contactName}</Text>
                            <Text style={listStyles.email}>{contact.contactEmail}</Text>
                        </View>
                    </View>
                    <View style={listStyles.lineDivider}>
                    </View>
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
}

export function AddContactScreen({navigation, route}) {
    const [saving, setSaving] = useState(false)
    let contact
    if (route.params) {
        contact = route.params.contact
    }
    const {
        control,
        handleSubmit,
        formState: {isValid}
    } = useForm(
        {
            mode: "onChange",
            defaultValues: {
                name: contact === undefined ? "" : contact.contactName,
                email: contact === undefined ? "" : contact.contactEmail,
                phone: contact === undefined ? "" : contact.contactPhone,
            }
        }
    )

    const onSubmit = data => {
        saveContact({
            userId: global.user.id,
            contactName: data.name,
            contactEmail: data.email,
            contactPhone: data.phone
        }).then(data => {
            navigation.navigate({
                name: 'ContactsScreen',
                params: {contact: data},
                merge: true,
            });
        }).catch(e => {
            setSaving(false)
            console.error(e)
            Alert.alert("Error Occurred", "Contact saving failure")
        })
    }

    const saveContact = async (data) => {
        setSaving(true)
        const route = contact === undefined ? 'api/contacts/' : "api/contacts/" + contact.id
        const response = await fetch(Config.API_BASE_URL + route, {
            method: contact === undefined ? 'POST' : 'PUT',
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
            <Text style={styles.header}>Contact Name</Text>
            <Controller
                control={control}
                name="name"
                render={({field: {onChange, value, onBlur}}) => (
                    <TextInput
                        style={styles.textInput}
                        placeholder="Firstname Lastname"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}/>
                )}
                rules={{
                    required: {
                        value: true,
                        message: 'Name is required!'
                    }
                }}
            />
            <Text style={styles.header}>Contact Email</Text>
            <Controller
                control={control}
                name="email"
                render={({field: {onChange, value, onBlur}}) => (
                    <TextInput
                        style={styles.textInput}
                        placeholder="email@mail.com, email2@mail.com"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}/>
                )}
                rules={{
                    required: {
                        value: true,
                        message: 'Email is required!'
                    }
                }}
            />
            <Text style={styles.header}>Contact Phone</Text>
            <Controller
                control={control}
                name="phone"
                render={({field: {onChange, value, onBlur}}) => (
                    <TextInput
                        style={styles.textInput}
                        placeholder="+445566556, +23454545464"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}/>
                )}
                rules={{
                    required: {
                        value: true,
                        message: 'Phone is required!'
                    }
                }}
            />
            <TouchableOpacity style={!isValid ? styles.buttonDisabled : styles.button} activeOpacity={.7}
                              onPress={handleSubmit(onSubmit)}>
                <Text style={[styles.text, {textAlign: "center"}]}>{"Save"}</Text>
            </TouchableOpacity>
        </View>
    );
}