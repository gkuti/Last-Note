import {ActivityIndicator, Modal, View} from "react-native";
import {styles} from "../styles/styles";
import React from "react";

export function Spinner({visible}) {
    return (
        <Modal statusBarTranslucent={true} transparent visible={visible}>
            <View style={styles.modal}>
                <ActivityIndicator style={{flex: 1}} size="large" color="#181818"/>
            </View>
        </Modal>
    )
}