import CustomModal from "@/components/CustomModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
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

export default function DogDetail() {
  const { dog } = useLocalSearchParams();
  const parsedDog = JSON.parse(dog as string);

  // 🔥 NORMALIZAR (soporta viejo y nuevo formato)
  const normalizeCommands = (cmds: any) => {
    if (!cmds) return [];

    if (Array.isArray(cmds)) return cmds;

    return Object.keys(cmds).map((key) => ({
      label: key,
      pattern: cmds[key],
    }));
  };

  const [commands, setCommands] = useState(
    normalizeCommands(parsedDog.commands)
  );

  const [modalVisible, setModalVisible] = useState(false);

  // ➕ agregar comando
  const addCommand = () => {
    if (commands.length >= 3) {
      alert("Solo puedes agregar máximo 3 comandos 🐶");
      return;
    }

    setCommands([
      ...commands,
      { label: "", pattern: [0, 200] },
    ]);
  };

  // ✏️ editar nombre
  const updateLabel = (index: number, text: string) => {
    const updated = [...commands];
    updated[index].label = text;
    setCommands(updated);
  };

  // 🎛️ cambiar vibración
  const updatePattern = (index: number, pattern: number[]) => {
    const updated = [...commands];
    updated[index].pattern = pattern;
    setCommands(updated);
  };

  // ❌ eliminar
  const deleteCommand = (index: number) => {
    const updated = commands.filter((_, i) => i !== index);
    setCommands(updated);
  };

  // 💾 guardar
  const saveCommands = async () => {
    try {
      const savedDogs = await AsyncStorage.getItem("dogs");
      if (!savedDogs) return;

      const dogs = JSON.parse(savedDogs);

      const updatedDogs = dogs.map((d: any) =>
        d.name === parsedDog.name ? { ...d, commands } : d
      );

      await AsyncStorage.setItem("dogs", JSON.stringify(updatedDogs));

      setModalVisible(true);
    } catch (error) {
      console.log("Error guardando:", error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: parsedDog.name,
          headerBackTitle: "Atrás",
        }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: parsedDog.image }} style={styles.image} />
        <Text style={styles.name}>{parsedDog.name}</Text>

        {/* 👇 SI NO HAY COMANDOS */}
        {commands.length === 0 && (
          <Text style={styles.emptyText}>
            Aún no tienes comandos 🐾  
            Agrega uno abajo 👇
          </Text>
        )}

        {/* 🧩 LISTA */}
        {commands.map((cmd: any, index: number) => (
          <View key={index} style={styles.card}>
            {/* ✏️ NOMBRE */}
            <TextInput
              placeholder="Ej: Ven, Tobby, Corre..."
              value={cmd.label}
              onChangeText={(text) => updateLabel(index, text)}
              style={styles.input}
            />

            {/* 🎛️ OPCIONES */}
            <View style={styles.options}>
              <Option
                label="Suave"
                selected={
                  JSON.stringify(cmd.pattern) === JSON.stringify([0, 200])
                }
                onPress={() => updatePattern(index, [0, 200])}
              />
              <Option
                label="Media"
                selected={
                  JSON.stringify(cmd.pattern) === JSON.stringify([0, 400])
                }
                onPress={() => updatePattern(index, [0, 400])}
              />
              <Option
                label="Fuerte"
                selected={
                  JSON.stringify(cmd.pattern) ===
                  JSON.stringify([0, 200, 100, 200])
                }
                onPress={() =>
                  updatePattern(index, [0, 200, 100, 200])
                }
              />
            </View>

            {/* 🔊 PROBAR */}
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => Vibration.vibrate(cmd.pattern)}
            >
              <Text style={styles.testText}>Probar</Text>
            </TouchableOpacity>

            {/* ❌ ELIMINAR */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteCommand(index)}
            >
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* ➕ AGREGAR */}
        <TouchableOpacity style={styles.addButton} onPress={addCommand}>
          <Text style={styles.addText}>+ Agregar comando</Text>
        </TouchableOpacity>

        {/* 💾 GUARDAR */}
        <TouchableOpacity style={styles.saveButton} onPress={saveCommands}>
          <Text style={styles.buttonText}>Guardar cambios</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 💅 MODAL FIX */}
      <CustomModal
        visible={modalVisible}
        title="🐶 Listo"
        message="Configuración guardada correctamente"
        showCancel={false} // 🔥 ESTO ARREGLA TU PROBLEMA
        onClose={() => {
          setModalVisible(false);
          router.back();
        }}
      />
    </>
  );
}

// 🎯 OPCIÓN
function Option({ label, onPress, selected }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.option,
        { backgroundColor: selected ? "#ff8fab" : "#eee" },
      ]}
    >
      <Text style={{ color: selected ? "white" : "black" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
    alignItems: "center",
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
  },

  emptyText: {
    color: "gray",
    marginBottom: 15,
    textAlign: "center",
  },

  card: {
    backgroundColor: "white",
    width: "100%",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },

  input: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    padding: 5,
  },

  options: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },

  option: {
    padding: 8,
    borderRadius: 10,
  },

  testButton: {
    backgroundColor: "#FFE082",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },

  testText: {
    textAlign: "center",
    fontWeight: "bold",
  },

  deleteButton: {
    backgroundColor: "#ff6b6b",
    padding: 8,
    borderRadius: 10,
  },

  deleteText: {
    color: "white",
    textAlign: "center",
  },

  addButton: {
    backgroundColor: "#a6c1ee",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    width: "100%",
  },

  addText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },

  saveButton: {
    backgroundColor: "#6c8cff",
    padding: 14,
    borderRadius: 14,
    marginTop: 10,
    width: "100%",
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});