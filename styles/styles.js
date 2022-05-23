import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#FFFFFF",
    },
    header: {
        color: "#181818",
        fontSize: 16,
        paddingBottom: 8,
        paddingTop: 24
    },
    inputContainer: {},
    textInput: {
        color: "#181818",
        backgroundColor: "#f3f3f3",
        height: 40,
        fontSize: 15,
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 6
    },
    NoteTextInput: {
        color: "#181818",
        backgroundColor: "#f3f3f3",
        height: 100,
        fontSize: 15,
        textAlign: "left",
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 6
    },
    button: {
        marginTop: 44,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 6,
        elevation: 3,
        backgroundColor: "#181818",
    },
    buttonDisabled: {
        marginTop: 44,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 6,
        elevation: 3,
        backgroundColor: "#cecece",
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        letterSpacing: 0.25,
        color: "white",
    },
    modal: {
        backgroundColor: 'rgba(0,0,0,0.15)',
        bottom: 0,
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
    }
});

export const textStyles = StyleSheet.create({
    header: {
        fontSize: 14,
        paddingTop: 16,
        paddingLeft: 16,
        paddingBottom: 8,
        fontWeight: "bold",
        color: "#444444",
    },
    text: {
        fontSize: 16,
        paddingBottom: 8,
        color: "#656565",
    }
})

export const listStyles = StyleSheet.create({
    container: {
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#ffffff"
    },
    contactItemContainer: {
        marginLeft: 16,
        marginTop: 6,
        marginBottom: 6,
        flexDirection: "row"
    },
    initialsContainer: {
        justifyContent: "center",
        backgroundColor: "#f3f3f3",
        borderRadius: 34,
        height: 68,
        width: 68,
    },
    initials: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "#181818",
    },
    contactContainer: {
        justifyContent: "center",
        marginLeft: 16
    },
    name: {
        fontSize: 15,
        color: "#181818",
    },
    email: {
        fontSize: 15,
        color: "#949494",
    },
    lineDivider: {
        backgroundColor: "#f3f3f3",
        height: 1,
        marginLeft: 100
    },
    deleteButton: {
        backgroundColor: '#ce0b0b',
        flexDirection: 'column',
        justifyContent: 'center',
        width: 86
    },
    deleteButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: "center",
        padding: 16
    },
    noteItemContainer: {
        marginLeft: 16,
        marginRight: 16,
        marginTop: 8,
        marginBottom: 8,
    },
    noteTitle: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#181818",
    },
    noteDetailContainer: {
        marginTop: 8,
        flexDirection: "row"
    },
    note: {
        flex: 1,
        fontSize: 14,
        color: "#949494",
    }
});