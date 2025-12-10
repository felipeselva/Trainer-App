import React from 'react';
import { StatusBar, View } from 'react-native'; // <--- Importe View aqui
import { Routes } from './src/routes';
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent 
      />
      
      {/* ENVOLVA AS ROTAS COM ESTA VIEW. 
         Isso cria uma "cortina" preta fixa por trás de tudo.
      */}
      <View style={{ flex: 1, backgroundColor: '#121214' }}>
        <Routes />
      </View>
      
    </AuthProvider>
  );
}