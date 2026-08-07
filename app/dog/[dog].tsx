import CustomModal from "@/components/CustomModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
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

  const [dogImage, setDogImage] = useState(parsedDog.image);

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


  const changePhoto = async () => {

  const result = await ImagePicker.launchImageLibraryAsync({

    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,

  });

  if (result.canceled) return;

  const originalUri = result.assets[0].uri;

  const fileName = `dog_${Date.now()}.jpg`;

  const newUri = FileSystem.documentDirectory + fileName;

  try {

    await FileSystem.copyAsync({
      from: originalUri,
      to: newUri,
    });

    const savedDogs = await AsyncStorage.getItem("dogs");

    if (!savedDogs) return;

    const dogs = JSON.parse(savedDogs);

    const updatedDogs = dogs.map((d: any) =>
      d.name === parsedDog.name
        ? {
            ...d,
            image: newUri,
          }
        : d
    );

    await AsyncStorage.setItem(
      "dogs",
      JSON.stringify(updatedDogs)
    );

    setDogImage(newUri);

  } catch (error) {

    console.log("Error cambiando fotografía:", error);

  }

};



  return (
    <>
      <Stack.Screen
        options={{
          title: "Entrenar comandos",
          headerBackTitle: "Mis compañeros",
        }}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.headerCard}>

          <Image
            source={{ uri: dogImage }}
            style={styles.image}
          />

          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={changePhoto}
          >
            <Text style={styles.changePhotoText}>
              📷 Cambiar fotografía
            </Text>
          </TouchableOpacity>

          <Text style={styles.name}>
            {parsedDog.name}
          </Text>

          <Text style={styles.subtitle}>
            Configura hasta 3 comandos de vibración para comenzar el entrenamiento.
          </Text>

        </View>

        {commands.length === 0 && (

          <View style={styles.emptyCard}>

            <Text style={styles.emptyTitle}>
              Todavía no hay comandos
            </Text>

            <Text style={styles.emptyDescription}>
              Presiona "Agregar comando" para comenzar a enseñarle nuevas órdenes a {parsedDog.name}.
            </Text>

          </View>

        )}

        {/* 🧩 LISTA */}
        {commands.map((cmd: any, index: number) => (

        <View
          key={index}
          style={styles.commandCard}
        >

        <Text style={styles.commandTitle}>
        Comando {index + 1}
        </Text>

        <TextInput
        placeholder="Ej. Ven, Quieta, Vamos..."
        value={cmd.label}
        onChangeText={(text)=>updateLabel(index,text)}
        style={styles.input}
        />

        <Text style={styles.vibrationLabel}>
        Tipo de vibración
        </Text>

        <View style={styles.options}>

        <Option
        label="🐾 Suave"
        selected={JSON.stringify(cmd.pattern)===JSON.stringify([0,200])}
        onPress={()=>updatePattern(index,[0,200])}
        />

        <Option
        label="🐕 Media"
        selected={JSON.stringify(cmd.pattern)===JSON.stringify([0,400])}
        onPress={()=>updatePattern(index,[0,400])}
        />

        <Option
        label="⚡ Fuerte"
        selected={
        JSON.stringify(cmd.pattern)===
        JSON.stringify([0,200,100,200])
        }
        onPress={()=>updatePattern(index,[0,200,100,200])}
        />

        </View>

        <TouchableOpacity
        style={styles.previewButton}
        onPress={()=>Vibration.vibrate(cmd.pattern)}
        >

        <Text style={styles.previewText}>
        ▶ Probar vibración
        </Text>

        </TouchableOpacity>

        <TouchableOpacity
        style={styles.deleteButton}
        onPress={()=>deleteCommand(index)}
        >

        <Text style={styles.deleteText}>
        Eliminar comando
        </Text>

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
        styles.optionCard,
        selected && styles.optionCardSelected,
      ]}
    >

      <View style={styles.optionContent}>

        <View
          style={[
            styles.radioCircle,
            selected && styles.radioCircleSelected,
          ]}
        />

        <Text
          style={[
            styles.optionText,
            selected && styles.optionTextSelected,
          ]}
        >
          {label}
        </Text>

      </View>

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

  headerCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 24,
  padding: 24,
  alignItems: "center",
  marginBottom: 24,

  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: {
    width: 0,
    height: 3,
  },
  elevation: 4,
},

subtitle: {
  marginTop: 10,
  color: "#64748B",
  textAlign: "center",
  fontSize: 15,
  lineHeight: 22,
},

emptyCard: {
  width: "100%",
  backgroundColor: "#FFFFFF",
  borderRadius: 18,
  padding: 20,
  marginBottom: 20,
},

emptyTitle: {
  fontSize: 18,
  fontWeight: "700",
  marginBottom: 8,
},

emptyDescription: {
  color: "#64748B",
  lineHeight: 22,
},

commandCard:{
backgroundColor:"#FFFFFF",
borderRadius:20,
padding:20,
marginBottom:20,

shadowColor:"#000",
shadowOpacity:.08,
shadowRadius:8,
shadowOffset:{
width:0,
height:3,
},
elevation:4,
},

commandTitle:{
fontSize:18,
fontWeight:"700",
marginBottom:14,
color:"#1E293B",
},

vibrationLabel:{
fontSize:15,
fontWeight:"600",
marginBottom:10,
marginTop:8,
color:"#475569",
},

previewButton:{
backgroundColor:"#FFD66B",
paddingVertical:14,
borderRadius:14,
marginTop:16,
},

previewText:{
textAlign:"center",
fontWeight:"700",
fontSize:16,
color:"#1E293B",
},

optionCard:{
flex:1,
borderWidth:2,
borderColor:"#E5E7EB",
borderRadius:16,
paddingVertical:14,
paddingHorizontal:12,
backgroundColor:"#FFFFFF",
},

optionCardSelected:{
borderColor:"#5B7FFF",
backgroundColor:"#EEF3FF",
},

optionContent:{
flexDirection:"row",
alignItems:"center",
},

radioCircle:{
width:18,
height:18,
borderRadius:20,
borderWidth:2,
borderColor:"#CBD5E1",
marginRight:10,
},

radioCircleSelected:{
  backgroundColor:"#5B7FFF",
  borderColor:"#5B7FFF",
},

optionText:{
  fontSize:15,
  fontWeight:"600",
  color:"#475569",
},

optionTextSelected:{
  color:"#1E293B",
},

changePhotoButton: {
  marginTop: 12,
  marginBottom: 8,
  paddingVertical: 10,
  paddingHorizontal: 18,
  backgroundColor: "#F3F4F6",
  borderRadius: 12,
},

changePhotoText: {
  color: "#2563EB",
  fontWeight: "700",
  textAlign: "center",
},

});