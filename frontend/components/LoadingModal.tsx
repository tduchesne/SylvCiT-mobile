import React from "react";
import { View, Modal, StyleSheet, Text, ActivityIndicator } from "react-native";

export default function LoadingModal(props: LoadingModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ActivityIndicator
            size="large"
            color="red"
          />
          {props.text ? (
            <Text style={styles.modalText}>{props.text}</Text>
          ) : (
            <Text style={styles.modalText}>Loading...</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0008",
  },
  modalView: {
    margin: 20,
    width: 200,
    height: 70,
    backgroundColor: "white",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginVertical: 15,
    textAlign: "center",
    fontSize: 17,
    marginLeft: 15,
  },
});

export interface LoadingModalProps {
  visible: boolean;

  /**
   * Text to display with the  Loading....
   * @param string title
   */
  title?: string;

  text: string;

  /**
   * Size of the loading indicator
   * @param string indicatorSize
   */

  indicatorSize?: "small" | "large";
}
