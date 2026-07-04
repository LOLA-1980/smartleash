import React, { useState } from 'react';

import {
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import base64 from 'react-native-base64';
import { BleManager, Device } from 'react-native-ble-plx';

const manager = new BleManager();

function App(): React.JSX.Element {
  const [device, setDevice] = useState<Device | null>(null);

  async function requestPermissions() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    }
  }

  async function scanAndConnect() {
    console.log('Botón presionado');
    await requestPermissions();
    console.log('Iniciando scan...');

    manager.startDeviceScan(null, null, (error, scannedDevice) => {
      if (error) {
        console.log('ERROR COMPLETO');
        console.log(JSON.stringify(error, null, 2));
        return;
      }

      console.log('Dispositivo:', scannedDevice?.name);

      if (scannedDevice?.name?.toUpperCase() === 'SMARTLEASH') {
        console.log('SmartLeash encontrado, conectando...');
        manager.stopDeviceScan();

        scannedDevice
          .connect()
          .then(async (connectedDevice) => {
            console.log('Conectado exitosamente!');
            setDevice(connectedDevice);

            await connectedDevice.discoverAllServicesAndCharacteristics();

            console.log('Servicios descubiertos!');

            const services = await connectedDevice.services();

            for (const service of services) {
              console.log('SERVICE:', service.uuid);

              const characteristics =
                await service.characteristics();

              for (const characteristic of characteristics) {
                console.log(
                  'CHARACTERISTIC:',
                  characteristic.uuid
                );
              }
            }

            return connectedDevice;
          })
          .catch((err) => {
            console.log('Error conectando:', err);
          });
      }
    });
  }

 async function sendCommand(command: string) {
  if (!device) {
    console.log('No hay dispositivo conectado');
    return;
  }

  try {
    const serviceUUID =
      '00001234-0000-1000-8000-00805f9b34fb';

    const characteristicUUID =
      '0000abcd-0000-1000-8000-00805f9b34fb';

    const message = base64.encode(command);

    await device.writeCharacteristicWithResponseForService(
      serviceUUID,
      characteristicUUID,
      message
    );

    console.log(`Comando enviado: ${command}`);
  } catch (error) {
    console.log('ERROR ENVIANDO COMANDO');
    console.log(error);
  }
}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        SmartLeash 🐶
      </Text>

      <Button
        title="Conectar Collar"
        onPress={scanAndConnect}
      />

      <View style={{ height: 20 }} />

      <Button
        title="🐶 Vámonos"
        onPress={() => sendCommand("1")}
      />

      <View style={{ height: 15 }} />

      <Button
        title="🐶 Fea"
        onPress={() => sendCommand("2")}
      />

      <View style={{ height: 15 }} />

      <Button
        title="🛑 Quieta"
        onPress={() => sendCommand("3")}
      />
    </View>    
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
  },
});

export default App;