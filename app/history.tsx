import { ScrollView, StyleSheet, Text, View } from "react-native";
import { theme } from "./styles/theme";

const history = [
  {
    id: 1,
    command: "Ven",
    vibration: "Fuerte",
    time: "03 Ago 2026 - 10:32 AM",
    status: "Enviado correctamente",
  },
  {
    id: 2,
    command: "Quieta",
    vibration: "Suave",
    time: "03 Ago 2026 - 10:40 AM",
    status: "Enviado correctamente",
  },
  {
    id: 3,
    command: "Vamos",
    vibration: "Media",
    time: "03 Ago 2026 - 11:05 AM",
    status: "Enviado correctamente",
  },
];

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Historial</Text>

        <Text style={styles.subtitle}>
          Aquí podrás consultar todos los comandos enviados por SmartLeash.
        </Text>

        {history.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.command}>🎤 {item.command}</Text>

              <View style={styles.statusBadge}>
                <Text style={styles.status}>
                  ✔
                </Text>
              </View>
            </View>

            <Text style={styles.vibration}>
              📳 Vibración: {item.vibration}
            </Text>

            <Text style={styles.time}>
              🕒 {item.time}
            </Text>

            <Text style={styles.result}>
              {item.status}
            </Text>
          </View>
        ))}
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
    marginBottom: theme.spacing.md,
    ...theme.shadow.card,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },

  command: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },

  statusBadge: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.round,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },

  status: {
    color: theme.colors.success,
    fontSize: 18,
    fontWeight: "700",
  },

  vibration: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  time: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },

  result: {
    ...theme.typography.caption,
    color: theme.colors.success,
    fontFamily: theme.typography.body.fontFamily,
  },

});