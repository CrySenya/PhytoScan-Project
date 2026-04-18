// This is the main screen of the app, showing a list of plant species and a search bar.
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getPlants } from '../lib/api';
import type { PlantSpecies } from '@phytoscan/shared';

export default function HomeScreen({ navigation }: any) {
  const [plants, setPlants]   = useState<PlantSpecies[]>([]);
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(true);

  const load = async (q?: string) => {
    setLoading(true);
    const data = await getPlants(q);
    setPlants(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌿  PhytoScan</Text>
      <TextInput
        style={styles.search}
        placeholder='Search plants...'
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={() => load(search)}
      />
      <FlatList
        data={plants}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PlantDetail', { id: item.id })}
          >
            {item.images[0] && <Image source={{ uri: item.images[0] }} style={styles.thumb} />}
            <View style={styles.info}>
              <Text style={styles.name}>{item.common_name}</Text>
              <Text style={styles.sci}>{item.scientific_name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F8E9', padding: 16 },
  title:     { fontSize: 28, fontWeight: 'bold', color: '#1B5E20', marginBottom: 12 },
  search:    { backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 16 },
  card:      { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
  thumb:     { width: 80, height: 80 },
  info:      { flex: 1, padding: 10, justifyContent: 'center' },
  name:      { fontSize: 16, fontWeight: 'bold', color: '#1B5E20' },
  sci:       { fontSize: 13, color: '#666', fontStyle: 'italic' },
});
