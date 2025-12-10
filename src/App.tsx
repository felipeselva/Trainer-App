import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { Routes } from './src/routes'; // Importa o index.tsx das rotas

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" backgroundColor="transparent" translucent />
        {/* SEM NavigationContainer AQUI! O Routes já tem ele. */}
        <Routes />
      </AuthProvider>
    </SafeAreaProvider>
  );
}