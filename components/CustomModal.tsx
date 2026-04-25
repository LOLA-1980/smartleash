import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CustomModal({
  visible,
  title,
  message,
  onClose,
  showCancel = false,
}: any) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>

          {showCancel && (
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  box: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  message: {
    marginBottom: 15,
    textAlign: "center",
  },

  button: {
    backgroundColor: "#ff8fab",
    padding: 10,
    borderRadius: 10,
    width: "60%",
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  cancel: {
    marginTop: 10,
    color: "gray",
  },
});