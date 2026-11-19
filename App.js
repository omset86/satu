import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selamat Datang!</Text>
      <Text style={styles.subtitle}>Aplikasi Expo ringan pertama Anda siap digunakan.</Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Detail', { pesan: 'Halo dari Beranda!' })}
      >
        <Text style={styles.buttonText}>Buka Halaman Detail</Text>
      </TouchableOpacity>
    </View>
  );
}

function DetailScreen({ route, navigation }) {
  const { pesan } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Halaman Detail</Text>
      <Text style={styles.subtitle}>{pesan}</Text>
      <TouchableOpacity 
        style={[styles.button, styles.backButton]} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Kembali</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Beranda' }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Info Detail' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f7fa' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 24 },
  button: { backgroundColor: '#2563eb', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  backButton: { backgroundColor: '#475569' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' }
});
