import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

export default function HomeScreen() {
  const [dogs, setDogs] = useState<any[]>([]);
  const [newDog, setNewDog] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  // 🔥 CARGAR SIEMPRE QUE REGRESAS A LA PANTALLA
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const saved = await AsyncStorage.getItem("dogs");
        if (saved) setDogs(JSON.parse(saved));
      };
      load();
    }, [])
  );

  // 📸 imagen
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
  };

  // 🎯 vibrar
  const sendCommand = (pattern: number[]) => {
    if (pattern) Vibration.vibrate(pattern);
  };

  // ❌ eliminar perro
  const deleteDog = async (index: number) => {
    const updated = dogs.filter((_, i) => i !== index);
    setDogs(updated);
    await AsyncStorage.setItem("dogs", JSON.stringify(updated));
  };

  // ✏️ editar nombre
  const saveEdit = async () => {
    if (editingIndex === null) return;

    const updated = [...dogs];
    updated[editingIndex].name = editingName;

    setDogs(updated);
    await AsyncStorage.setItem("dogs", JSON.stringify(updated));

    setEditingIndex(null);
    setEditingName("");
  };

  return (
    <LinearGradient colors={["#fbc2eb", "#a6c1ee"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🐶 SmartLeash</Text>
        <Text style={styles.subtitle}>Tus perritos conectados 💖</Text>

        <TextInput
          placeholder="Nombre del perro"
          value={newDog}
          onChangeText={setNewDog}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={async () => {
            const uri = await pickImage();
            if (uri) setImage(uri);
          }}
        >
          <Text style={styles.addButtonText}>Seleccionar foto</Text>
        </TouchableOpacity>

        {/* ➕ AGREGAR PERRO */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={async () => {
            if (!newDog.trim()) return;

            const newDogObj = {
              name: newDog,
              image:
                image ||
                "https://cdn-icons-png.flaticon.com/512/616/616408.png",
              commands: [],
            };

            const updated = [...dogs, newDogObj];
            setDogs(updated);
            await AsyncStorage.setItem("dogs", JSON.stringify(updated));

            setNewDog("");
            setImage(null);
          }}
        >
          <Text style={styles.addButtonText}>Agregar perro</Text>
        </TouchableOpacity>

        {/* LISTA */}
        {dogs.map((dog, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.leftSection}
                onPress={() =>
                  router.push({
                    pathname: "/dog/[dog]",
                    params: { dog: JSON.stringify(dog) },
                  })
                }
              >
                <Image source={{ uri: dog.image }} style={styles.avatar} />
                <Text style={styles.dogName}>{dog.name}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setEditingIndex(index);
                  setEditingName(dog.name);
                }}
                style={styles.editButton}
              >
                <Text style={styles.editText}>✏️</Text>
              </TouchableOpacity>
            </View>

            {editingIndex === index && (
              <>
                <TextInput
                  value={editingName}
                  onChangeText={setEditingName}
                  style={styles.input}
                />

                <TouchableOpacity
                  onPress={saveEdit}
                  style={styles.saveButton}
                >
                  <Text style={styles.addButtonText}>Guardar</Text>
                </TouchableOpacity>
              </>
            )}

            <Text style={styles.status}>🟢 Conectado</Text>

            {/* 🔥 MOSTRAR COMANDOS */}
            {dog.commands?.length > 0 ? (
              dog.commands.map((cmd: any, i: number) => (
                <TouchableOpacity
                  key={i}
                  style={styles.button}
                  onPress={() => sendCommand(cmd.pattern)}
                >
                  <Text style={styles.buttonText}>{cmd.label}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ color: "gray", marginTop: 10 }}>
                No hay comandos aún
              </Text>
            )}

            <TouchableOpacity
              onPress={() => deleteDog(index)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100 },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginTop: 40,
  },

  subtitle: {
    color: "white",
    marginBottom: 10,
  },

  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  addButton: {
    backgroundColor: "#ff8fab",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },

  saveButton: {
    backgroundColor: "#6c8cff",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },

  addButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 20,
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 10,
  },

  dogName: {
    fontSize: 20,
    fontWeight: "bold",
  },

  editButton: {
    backgroundColor: "#a6c1ee",
    padding: 10,
    borderRadius: 10,
  },

  editText: {
    color: "white",
  },

  status: {
    color: "gray",
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#FFE082",
    padding: 14,
    borderRadius: 25,
    marginTop: 10,
  },

  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },

  deleteButton: {
    marginTop: 10,
    backgroundColor: "#ff6b6b",
    padding: 10,
    borderRadius: 12,
  },

  deleteText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});