import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Cabecalho = ({ titulo }) => {
  return (
    <View>
      <Text style={styles.cabecalho}>
        {titulo}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cabecalho: {
    fontSize: 20,
    padding: 10,
    backgroundColor: "#1A237E",
    color: "#fff",
    textAlign: "center"
  }
});

export default Cabecalho;
