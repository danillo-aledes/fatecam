import React, { useState, useEffect, useRef } from 'react';
import { Platform, SafeAreaView, TouchableOpacity, StyleSheet, Text, View, Modal, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';

// Components
import Cabecalho from './components/Cabecalho';

export default function App() {
  const [temPermissao, setTemPermissao] = useState(null);
  const [iconePadrao, setIconePadrao] = useState('md');
  const [tipoCamera, setTipoCamera] = useState(Camera.Constants.Type.back);
  const [tipoFlash, setTipoFlash] = useState(Camera.Constants.FlashMode.off);
  const [photoCapturada, setPhotoCapturada] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const cameraRef = useRef(null);

  useEffect(() => {
    setShowModal(false);
    switch (Platform.OS) {
      case 'ios':
        setIconePadrao('md');
        break;
      case 'android':
        setIconePadrao('ios');
      default:
        break;
    }
  }, []);

  useEffect(() => {
    (
      async () => {
        if (Platform.OS === 'web') {
          const cameraDisponivel = await Camera.isAvailableAsync();
          setTemPermissao(cameraDisponivel);
        } else {
          const { status } = await Camera.requestPermissionsAsync();
          setTemPermissao(status === 'granted' ? true : false);
        }
      }
    )()
  }, []);

  if (!temPermissao) {
    return (
      <SafeAreaView>
        <Text>Acesso da camera negado! Verifique e se o seu equipamento passui este recurso.</Text>
      </SafeAreaView>
    )
  }

  const tirarPhoto = async () => {
    if (cameraRef) {
      const options = {
        quality: 0.5,
        skipProcessing: true
      }

      const photo = await cameraRef.current.takePictureAsync(options);
      // console.log(photo);

      setPhotoCapturada(photo.uri);
      setShowModal(true);

      // setTimeout(() => {
      //   setShowModal(false);
      // }, 3000);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Cabecalho titulo={'FateCam'} />

      <Camera
        ref={cameraRef}
        style={{ flex: 1 }}
        type={tipoCamera}
        flashMode={tipoFlash}
      >
        <View style={styles.camera}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.touch}
            onPress={() => setTipoFlash(tipoFlash ? Camera.Constants.FlashMode.off : Camera.Constants.FlashMode.on)}
          >
            <Ionicons
              name={tipoFlash ? `${iconePadrao}-flash` : `${iconePadrao}-flash-off`}
              size={40}
              color={"#9e9e9e"} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.touch}
            onPress={tirarPhoto}
          >
            <Ionicons name={`${iconePadrao}-camera`} size={40} color={"#9e9e9e"} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.touch}
            onPress={() => setTipoCamera(
              tipoCamera === Camera.Constants.Type.back ?
                Camera.Constants.Type.front : Camera.Constants.Type.back
            )}
          >
            <Ionicons name={`${iconePadrao}-camera-reverse`} size={40} color={"#9e9e9e"} />
          </TouchableOpacity>
        </View>
      </Camera>

      <Modal
        visible={showModal}
        animationType={"slide"}
        transparent={true}
      >
        <View style={styles.modalView}>
          <Image
            source={{ uri: photoCapturada }}
            style={{ width: "90%", height: "50%", borderRadius: 20 }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  camera: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end"
  },
  touch: {
    margin: 20,
    backgroundColor: "#ededed",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    justifyContent: "center",
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    alignItems: "center"
    // opacity: 0.9,
  }
});
