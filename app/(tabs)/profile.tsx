import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  // 📥 cargar usuario
  useEffect(() => {
    const loadUser = async () => {
      const data = await AsyncStorage.getItem("user");

      if (data) {
        const parsed = JSON.parse(data);
        setUser(parsed);
        setName(parsed.name);
      }
    };

    loadUser();
  }, []);

  // 💾 guardar cambios
  const saveProfile = async () => {
    try {
      const updatedUser = { ...user, name };

      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      setUser(updatedUser);
      setEditing(false);

      Alert.alert("✨ Listo", "Perfil actualizado");
    } catch (error) {
      console.log(error);
    }
  };

  // 📸 seleccionar imagen
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permiso requerido");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      const updatedUser = { ...user, image: uri };

      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  // 🚪 logout
  const logout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      {/* 📸 FOTO */}
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{
            uri:
              user.image ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.editPhoto}>Cambiar foto</Text>
      </TouchableOpacity>

      {/* 👤 NOMBRE */}
      {editing ? (
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      ) : (
        <Text style={styles.name}>{user.name}</Text>
      )}

      {/* ✏️ EDITAR / GUARDAR */}
      {editing ? (
        <TouchableOpacity style={styles.button} onPress={saveProfile}>
          <Text style={styles.buttonText}>Guardar cambios</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setEditing(true)}
        >
          <Text style={styles.buttonText}>Editar perfil</Text>
        </TouchableOpacity>
      )}

      {/* 🚪 LOGOUT */}
      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fbc2eb",
    padding: 20,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  editPhoto: {
    color: "white",
    textAlign: "center",
    marginTop: 5,
    fontSize: 12,
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },

  input: {
    backgroundColor: "white",
    width: "80%",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },

  button: {
    backgroundColor: "#ff8fab",
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    width: "80%",
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  logout: {
    marginTop: 25,
  },

  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
});