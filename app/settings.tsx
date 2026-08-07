import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "./styles/theme";

export default function SettingsScreen() {

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        <Text style={styles.title}>
          Configuración
        </Text>

        <Text style={styles.subtitle}>
          Administra SmartLeash y personaliza la experiencia de tu compañero.
        </Text>

        <View style={styles.card}>

          <Text style={styles.section}>
            Cuenta
          </Text>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>
              👤 Mi perfil
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>
              🐶 Administrar compañeros
            </Text>
          </TouchableOpacity>

        </View>

        <View style={styles.card}>

          <Text style={styles.section}>
            SmartLeash
          </Text>

          <TouchableOpacity
            style={styles.option}
            onPress={() => router.push("/connect")}
          >
            <Text style={styles.optionText}>
              📶 Conectar SmartLeash
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => router.push("/history")}
          >
            <Text style={styles.optionText}>
              📊 Historial
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>
              🔋 Estado de batería
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>
              🤖 Estado de la IA
            </Text>
          </TouchableOpacity>

        </View>

        <View style={styles.card}>

          <Text style={styles.section}>
            Información
          </Text>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>
              📄 Acerca de SmartLeash
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>
              ❤️ Nuestra misión
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>
              ℹ️ Versión 1.0
            </Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutText}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },

  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadow.card,
  },

  section: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },

  option: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  optionText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },

  logoutButton: {
    backgroundColor: theme.colors.danger,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },

  logoutText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: theme.typography.body.fontSize,
  },

});