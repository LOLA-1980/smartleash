import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
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

import { theme } from "../styles/theme";

export default function HomeScreen() {
  const [dogs, setDogs] = useState<any[]>([]);
  const [newDog, setNewDog] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const [userName, setUserName] = useState("Amigo");

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const savedDogs = await AsyncStorage.getItem("dogs");

        if (savedDogs) {
          setDogs(JSON.parse(savedDogs));
        }

        const savedUser = await AsyncStorage.getItem("user");

        if (savedUser) {
          const user = JSON.parse(savedUser);

          if (user?.name) {
            setUserName(user.name);
          }
        }
      };

      load();
    }, [])
  );

  const pickImage = async () => {

  const result = await ImagePicker.launchImageLibraryAsync({

    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,

  });

  if (result.canceled) return null;

  const originalUri = result.assets[0].uri;

  const fileName = `dog_${Date.now()}.jpg`;

  const newUri =
    FileSystem.documentDirectory + fileName;

  try {

    await FileSystem.copyAsync({
      from: originalUri,
      to: newUri,
    });

    setImage(newUri);

    return newUri;

  } catch (error) {

    console.log("Error copiando imagen", error);

    setImage(originalUri);

    return originalUri;

  }

};

  const sendCommand = (pattern: number[]) => {
    if (pattern) {
      Vibration.vibrate(pattern);
    }
  };

  const deleteDog = async (index: number) => {
    const updated = dogs.filter((_, i) => i !== index);

    setDogs(updated);

    await AsyncStorage.setItem(
      "dogs",
      JSON.stringify(updated)
    );
  };

  const saveEdit = async () => {
    if (editingIndex === null) return;

    const updated = [...dogs];

    updated[editingIndex].name = editingName;

    setDogs(updated);

    await AsyncStorage.setItem(
      "dogs",
      JSON.stringify(updated)
    );

    setEditingIndex(null);
    setEditingName("");
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <View style={styles.screen}>

  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.container}
  >

    <LinearGradient
      colors={[
        theme.colors.gradientStart,
        theme.colors.gradientEnd,
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >

      {/* Barra superior */}

      <View style={styles.topBar}>

        <View style={styles.brandRow}>

          <Image
            source={require("../../assets/images/logo-smartleash.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />

          <Text style={styles.logo}>
            SmartLeash
          </Text>

        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutText}>
            Salir
          </Text>
        </TouchableOpacity>

      </View>

      <Text style={styles.greeting}>
        Hola {userName} 👋
      </Text>

      <Text style={styles.description}>
        Porque la comunicación siempre ha existido;
        {"\n"}
        SmartLeash la adapta a las nuevas necesidades
        de tu mejor amigo.
      </Text>

      {/* Tarjeta resumen */}

      <View style={styles.resumeCard}>

        <View style={styles.resumeItem}>

          <Text style={styles.resumeNumber}>
            {dogs.length}
          </Text>

          <Text style={styles.resumeLabel}>
            Compañeros
          </Text>

        </View>

        <View style={styles.resumeDivider} />

        <View style={styles.resumeItem}>

          <Text style={styles.resumeNumber}>
            {dogs.reduce(
              (acc, dog) => acc + (dog.commands?.length || 0),
              0
            )}
          </Text>

          <Text style={styles.resumeLabel}>
            Comandos
          </Text>

        </View>

      </View>

    </LinearGradient>


    <View style={styles.dashboard}>

      <TouchableOpacity
        style={styles.dashboardCard}
        onPress={() => router.push("/connect")}
      >
        <Text style={styles.dashboardIcon}>📶</Text>
        <Text style={styles.dashboardTitle}>
          Conectar SmartLeash
        </Text>
        <Text style={styles.dashboardSubtitle}>
          Buscar y conectar el collar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dashboardCard}
        onPress={() => router.push("/train")}
      >
        <Text style={styles.dashboardIcon}>🧠</Text>
        <Text style={styles.dashboardTitle}>
          Entrenar IA
        </Text>
        <Text style={styles.dashboardSubtitle}>
          Crear comandos personalizados
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dashboardCard}
        onPress={() => router.push("/history")}
      >
        <Text style={styles.dashboardIcon}>📜</Text>
        <Text style={styles.dashboardTitle}>
          Historial
        </Text>
        <Text style={styles.dashboardSubtitle}>
          Revisar comandos enviados
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dashboardCard}
        onPress={() => router.push("/settings")}
      >
        <Text style={styles.dashboardIcon}>⚙️</Text>
        <Text style={styles.dashboardTitle}>
          Configuración
        </Text>
        <Text style={styles.dashboardSubtitle}>
          Preferencias de SmartLeash
        </Text>
      </TouchableOpacity>

    </View>

        <Text style={styles.sectionTitle}>
          Mis compañeros
        </Text>

        <View style={styles.addCard}>

          <View style={styles.addHeader}>

            <View>

              <Text style={styles.cardTitle}>
                Nuevo compañero
              </Text>

              <Text style={styles.cardSubtitle}>
                Agrega un nuevo integrante a SmartLeash
              </Text>

            </View>

          </View>

          <TextInput
            placeholder="Nombre del perro"
            placeholderTextColor={theme.colors.textLight}
            value={newDog}
            onChangeText={setNewDog}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.photoButton}
            onPress={pickImage}
          >

            <Text style={styles.photoButtonText}>

              {image
                ? "📸 Cambiar fotografía"
                : "📸 Seleccionar fotografía"}

            </Text>

          </TouchableOpacity>

          {image && (

            <Image
              source={{ uri: image }}
              style={styles.previewImage}
            />

          )}

          <TouchableOpacity
            style={styles.primaryButton}
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

              await AsyncStorage.setItem(
                "dogs",
                JSON.stringify(updated)
              );

              setNewDog("");
              setImage(null);

            }}
          >

            <Text style={styles.primaryButtonText}>
              Agregar compañero
            </Text>

          </TouchableOpacity>

        </View>

        {dogs.map((dog, index) => (

  <View
    key={index}
    style={styles.dogCard}
  >

    <TouchableOpacity
      style={styles.dogHeader}
      onPress={() =>
        router.push({
          pathname: "/dog/[dog]",
          params: {
            dog: JSON.stringify(dog),
          },
        })
      }
    >

      <Image
        source={{ uri: dog.image }}
        style={styles.dogImage}
      />

      <View style={styles.dogInfo}>

        <Text style={styles.dogName}>
          {dog.name}
        </Text>

        <View style={styles.statusBadge}>

          <View style={styles.statusDot} />

          <Text style={styles.statusText}>
            Conectado
          </Text>

        </View>

      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          setEditingIndex(index);
          setEditingName(dog.name);
        }}
      >
        <Text style={styles.editText}>
          ✏️
        </Text>
      </TouchableOpacity>

    </TouchableOpacity>

    {editingIndex === index && (

      <View style={styles.editContainer}>

        <TextInput
          value={editingName}
          onChangeText={setEditingName}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveEdit}
        >
          <Text style={styles.primaryButtonText}>
            Guardar cambios
          </Text>
        </TouchableOpacity>

      </View>

    )}

    <View style={styles.commandsContainer}>

      <Text style={styles.commandsTitle}>
        Comandos disponibles
      </Text>

      {dog.commands?.length > 0 ? (

        dog.commands.map((cmd: any, i: number) => (

          <TouchableOpacity
            key={i}
            style={styles.commandButton}
            onPress={() => sendCommand(cmd.pattern)}
          >
            <Text style={styles.commandText}>
              {cmd.label}
            </Text>
          </TouchableOpacity>

        ))

      ) : (

        <View style={styles.emptyCommands}>
          <Text style={styles.emptyText}>
            Aún no hay comandos configurados.
          </Text>
        </View>

      )}

    </View>

    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => deleteDog(index)}
    >
      <Text style={styles.deleteText}>
        Eliminar compañero
      </Text>
    </TouchableOpacity>

  </View>

))}

      </ScrollView>

    </View>

  );
}



const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl * 3,
  },

  header: {
  paddingTop: theme.spacing.xxl,
  paddingBottom: theme.spacing.xl,
  paddingHorizontal: theme.spacing.lg,
  marginHorizontal: -theme.spacing.lg,
  marginTop: -theme.spacing.xl,
  marginBottom: theme.spacing.xl,
  borderBottomLeftRadius: 34,
  borderBottomRightRadius: 34,
},

topBar: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing.xl,
},

brandRow: {
  flexDirection: "row",
  alignItems: "center",
},

logoImage: {
  width: 54,
  height: 54,
  marginRight: theme.spacing.sm,
},

logo: {
  color: theme.colors.text,
  fontFamily: theme.typography.logo.fontFamily,
  fontSize: 28,
},

logoutButton: {
  backgroundColor: "rgba(255,255,255,0.85)",
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 30,
},

logoutText: {
  color: theme.colors.primaryDark,
  fontWeight: "700",
},

greeting: {
  color: theme.colors.text,
  fontSize: 30,
  fontWeight: "700",
  marginBottom: theme.spacing.sm,
},

description: {
  color: theme.colors.textSecondary,
  fontSize: 15,
  lineHeight: 22,
  marginBottom: theme.spacing.xl,
},

resumeCard: {
  backgroundColor: "rgba(255,255,255,0.88)",
  borderRadius: 20,
  paddingVertical: 18,
  flexDirection: "row",
  justifyContent: "space-evenly",
  alignItems: "center",
},

resumeItem: {
  alignItems: "center",
  flex: 1,
},

resumeDivider: {
  width: 1,
  height: 45,
  backgroundColor: "#D8DCE6",
},

resumeNumber: {
  fontSize: 28,
  fontWeight: "700",
  color: theme.colors.primaryDark,
},

resumeLabel: {
  marginTop: 4,
  fontSize: 13,
  color: theme.colors.textSecondary,
},

  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.h2.fontSize,
    fontWeight: "700",
    marginBottom: theme.spacing.md,
  },

  addCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadow.card,
  },

  cardTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.h3.fontSize,
    fontWeight: "700",
    marginBottom: theme.spacing.md,
  },

  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
  },

  secondaryButton: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },

  secondaryButtonText: {
    textAlign: "center",
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: theme.typography.body.fontSize,
  },

  previewImage: {
    width: 112,
    height: 112,
    borderRadius: theme.radius.round,
    alignSelf: "center",
    marginBottom: theme.spacing.md,
    ...theme.shadow.card,
  },

  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
  },

  primaryButtonText: {
    color: theme.colors.white,
    textAlign: "center",
    fontWeight: "700",
    fontSize: theme.typography.body.fontSize,
  },

  dogCard: {
  backgroundColor: theme.colors.surface,
  borderRadius: 24,
  padding: theme.spacing.lg,
  marginBottom: theme.spacing.lg,
  ...theme.shadow.card,
},

dogHeader: {
  flexDirection: "row",
  alignItems: "center",
},

avatarContainer: {
  position: "relative",
  marginRight: theme.spacing.md,
},

dogImage: {
  width: 76,
  height: 76,
  borderRadius: 38,
  borderWidth: 3,
  borderColor: theme.colors.white,
},

onlineDot: {
  position: "absolute",
  width: 16,
  height: 16,
  borderRadius: 8,
  backgroundColor: theme.colors.success,
  borderWidth: 3,
  borderColor: theme.colors.white,
  right: 1,
  bottom: 4,
},

dogInfo: {
  flex: 1,
},

dogName: {
  color: theme.colors.text,
  fontFamily: theme.typography.h3.fontFamily,
  fontSize: 21,
  marginBottom: 3,
},

dogDescription: {
  color: theme.colors.textSecondary,
  fontFamily: theme.typography.bodySmall.fontFamily,
  fontSize: theme.typography.bodySmall.fontSize,
  marginBottom: theme.spacing.sm,
},

statusBadge: {
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "flex-start",
  backgroundColor: "#F0FDF4",
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: theme.radius.round,
},

statusDot: {
  width: 7,
  height: 7,
  borderRadius: 4,
  backgroundColor: theme.colors.success,
  marginRight: 6,
},

statusText: {
  color: theme.colors.success,
  fontFamily: theme.typography.caption.fontFamily,
  fontSize: theme.typography.caption.fontSize,
},

chevron: {
  color: theme.colors.textLight,
  fontSize: 34,
  marginLeft: theme.spacing.sm,
},

dogStats: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: theme.spacing.lg,
  paddingVertical: theme.spacing.md,
  backgroundColor: theme.colors.background,
  borderRadius: theme.radius.md,
},

statItem: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
},

statNumber: {
  color: theme.colors.primaryDark,
  fontSize: 22,
  fontWeight: "700",
  marginBottom: 2,
},

statIcon: {
  fontSize: 20,
  marginBottom: 2,
},

statLabel: {
  color: theme.colors.textSecondary,
  fontFamily: theme.typography.caption.fontFamily,
  fontSize: theme.typography.caption.fontSize,
},

statDivider: {
  width: 1,
  height: 34,
  backgroundColor: theme.colors.border,
},

dogActions: {
  flexDirection: "row",
  marginTop: theme.spacing.md,
},

editActionButton: {
  flex: 1,
  paddingVertical: 11,
  borderRadius: theme.radius.md,
  backgroundColor: "#F3F6FF",
  marginRight: theme.spacing.sm,
},

editActionText: {
  textAlign: "center",
  color: theme.colors.primaryDark,
  fontWeight: "600",
  fontSize: 14,
},

deleteActionButton: {
  paddingVertical: 11,
  paddingHorizontal: 18,
  borderRadius: theme.radius.md,
  backgroundColor: "#FFF1F1",
},

deleteActionText: {
  textAlign: "center",
  color: theme.colors.danger,
  fontWeight: "600",
  fontSize: 14,
},

editContainer: {
  marginTop: theme.spacing.lg,
  paddingTop: theme.spacing.md,
  borderTopWidth: 1,
  borderTopColor: theme.colors.border,
},

saveButton: {
  backgroundColor: theme.colors.primaryDark,
  borderRadius: theme.radius.md,
  paddingVertical: theme.spacing.md,
},

  editButton: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.round,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },

  editText: {
    fontSize: 18,
  },

  commandsContainer: {
    marginTop: theme.spacing.xl,
  },

  commandsTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: "700",
    marginBottom: theme.spacing.md,
  },

  commandButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },

  commandText: {
    textAlign: "center",
    color: theme.colors.text,
    fontWeight: "600",
    fontSize: theme.typography.body.fontSize,
  },

  emptyCommands: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  emptyText: {
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontSize: theme.typography.bodySmall.fontSize,
  },

  deleteButton: {
    backgroundColor: theme.colors.danger,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },

  deleteText: {
    color: theme.colors.white,
    textAlign: "center",
    fontWeight: "700",
    fontSize: theme.typography.body.fontSize,
  },

  addHeader: {
    marginBottom: theme.spacing.lg,
},

cardSubtitle: {
  marginTop: 4,
  color: theme.colors.textSecondary,
  fontSize: 14,
},

photoButton: {
  borderWidth: 1.5,
  borderColor: theme.colors.primary,
  borderStyle: "dashed",
  backgroundColor: "#F8FAFF",
  borderRadius: theme.radius.md,
  paddingVertical: 14,
  alignItems: "center",
  marginBottom: theme.spacing.md,
},

photoButtonText: {
  color: theme.colors.primaryDark,
  fontWeight: "600",
  fontSize: 15,
},

dashboard: {
  marginBottom: theme.spacing.xl,
},

dashboardCard: {
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.lg,
  padding: theme.spacing.lg,
  marginBottom: theme.spacing.md,
  borderWidth: 1,
  borderColor: theme.colors.border,
  ...theme.shadow.card,
},

dashboardIcon: {
  fontSize: 32,
  marginBottom: theme.spacing.sm,
},

dashboardTitle: {
  fontSize: theme.typography.h3.fontSize,
  fontWeight: "700",
  color: theme.colors.text,
  marginBottom: 4,
},

dashboardSubtitle: {
  fontSize: theme.typography.bodySmall.fontSize,
  color: theme.colors.textSecondary,
  lineHeight: 20,
},

});