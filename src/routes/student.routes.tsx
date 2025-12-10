import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa a tela Home do Aluno.
// Se sua tela estiver com 'export function Home', o import tem que ser assim:
import { Home } from '../screens/student/Home'; 

const Stack = createNativeStackNavigator();

// --- ATENÇÃO AQUI: Tem que ser 'export function' ---
export function StudentRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentHome" component={Home} />
    </Stack.Navigator>
  );
}