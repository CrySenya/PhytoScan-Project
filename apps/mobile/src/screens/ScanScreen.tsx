import React, { useState } from 'react';
import { View, Text, Button, Image, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { scanPlant } from '../lib/api';

export default function ScanScreen() {
  const [result,  setResult]  = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imgUri,  setImgUri]  = useState<string | null>(null);

  const pickAndScan = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return alert('Camera permission required');

    const pic = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 });
    if (pic.canceled || !pic.assets[0].base64) return;

    setImgUri(pic.assets[0].uri);
    setLoading(true);
    try {
      const data = await scanPlant(pic.assets[0].base64);
      setResult(data);
    } catch {
      alert('Scan failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📷  Scan a Plant</Text>
      <Text style={styles.sub}>Point your camera at any plant and tap Scan.</Text>
      <Button title='Scan Plant' onPress={pickAndScan} color='#1B5E20' />
      {loading && <ActivityIndicator size='large' color='#1B5E20' style={{ marginTop: 24 }} />}
      {imgUri && <Image source={{ uri: imgUri }} style={styles.preview} />}
      {result && (
        <View style={styles.result}>
          <Text style={styles.plantName}>{result.plant_name}</Text>
          <Text style={styles.confidence}>Confidence: {Math.round(result.confidence * 100)}%</Text>
          <Text style={styles.loreTitle}>✨  Field Guide Entry</Text>
          <Text style={styles.lore}>{result.fantasy_lore}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#F1F8E9', padding: 16 },
  title:      { fontSize: 24, fontWeight: 'bold', color: '#1B5E20', marginBottom: 8 },
  sub:        { fontSize: 15, color: '#555', marginBottom: 20 },
  preview:    { width: '100%', height: 220, borderRadius: 12, marginTop: 20 },
  result:     { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 20 },
  plantName:  { fontSize: 22, fontWeight: 'bold', color: '#1B5E20' },
  confidence: { fontSize: 14, color: '#888', marginBottom: 12 },
  loreTitle:  { fontSize: 16, fontWeight: 'bold', color: '#4A148C', marginBottom: 8 },
  lore:       { fontSize: 15, lineHeight: 24, color: '#333' },
});
