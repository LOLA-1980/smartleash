import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { theme } from "./styles/theme";

type Pattern = {
  id: number;
  name: string;
  vibration: number[];
};

export default function TrainScreen() {
  const { dog } = useLocalSearchParams();

  const parsedDog = JSON.parse(dog as string);

  const [isRecording, setIsRecording] = useState(false);

  const [detectedCommand, setDetectedCommand] = useState("");

  const [selectedPattern, setSelectedPattern] = useState<number | null>(null);

  const patterns: Pattern[] = [
    {
      id: 1,
      name: "Suave",
      vibration: [0, 200],
    },
    {
      id: 2,
      name: "Media",
      vibration: [0, 400],
    },
    {
      id: 3,
      name: "Fuerte",
      vibration: [0, 200, 120, 200],
    },
  ];

  const startRecording = () => {
    setIsRecording(true);

    Alert.alert(
      "Modo entrenamiento",
      "Aquí después conectaremos la IA.\n\nEscuchará tu voz, reconocerá el comando y automáticamente lo mostrará aquí."
    );

    // Simulación temporal
    setTimeout(() => {
      setDetectedCommand("Ven");
      setIsRecording(false);
    }, 2500);
  };

  const saveTraining = async () => {
    if (!detectedCommand) {
      Alert.alert(
        "SmartLeash",
        "Primero debes grabar un comando."
      );
      return;
    }

    if (selectedPattern === null) {
      Alert.alert(
        "SmartLeash",
        "Selecciona una vibración."
      );
      return;
    }

    try {
      const savedDogs = await AsyncStorage.getItem("dogs");

      if (!savedDogs) return;

      const dogs = JSON.parse(savedDogs);

      const pattern = patterns.find(
        (p) => p.id === selectedPattern
      );

      const updatedDogs = dogs.map((d: any) => {
        if (d.name !== parsedDog.name) return d;

        return {
          ...d,
          commands: [
            ...(d.commands || []),
            {
              label: detectedCommand,
              pattern: pattern?.vibration || [0, 200],
            },
          ],
        };
      });

      await AsyncStorage.setItem(
        "dogs",
        JSON.stringify(updatedDogs)
      );

      Alert.alert(
        "SmartLeash",
        "Entrenamiento guardado correctamente."
      );

      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        Entrenar comando
      </Text>

      <Text style={styles.subtitle}>
        Enseñaremos un nuevo comando para {parsedDog.name}.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Paso 1
        </Text>

        <Text style={styles.text}>
          Presiona el botón y pronuncia el comando.
        </Text>

        <TouchableOpacity
          style={[
            styles.recordButton,
            isRecording && styles.recording,
          ]}
          onPress={startRecording}
        >
          <Text style={styles.recordText}>
            {isRecording
              ? "Escuchando..."
              : "🎤 Grabar comando"}
          </Text>
        </TouchableOpacity>

        {detectedCommand !== "" && (
          <View style={styles.detectedBox}>
            <Text style={styles.detectedLabel}>
              Comando detectado
            </Text>

            <Text style={styles.detectedCommand}>
              {detectedCommand}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Paso 2
        </Text>

        <Text style={styles.text}>
          Selecciona el patrón de vibración.
        </Text>

        {patterns.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.patternButton,
              selectedPattern === item.id &&
                styles.patternSelected,
            ]}
            onPress={() => setSelectedPattern(item.id)}
          >
            <Text
              style={[
                styles.patternText,
                selectedPattern === item.id &&
                  styles.patternTextSelected,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveTraining}
      >
        <Text style={styles.saveText}>
          Guardar entrenamiento
        </Text>
      </TouchableOpacity>
    </ScrollView>
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
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },

  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadow.card,
  },

  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  text: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },

  recordButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },

  recording: {
    backgroundColor: theme.colors.danger,
  },

  recordText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: theme.typography.body.fontSize,
  },

  detectedBox: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  detectedLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },

  detectedCommand: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    fontWeight: "700",
  },

  patternButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },

  patternSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  patternText: {
    color: theme.colors.text,
    fontWeight: "600",
    fontSize: theme.typography.body.fontSize,
  },

  patternTextSelected: {
    color: theme.colors.white,
  },

  saveButton: {
    backgroundColor: theme.colors.success,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },

  saveText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: theme.typography.body.fontSize,
  },
});