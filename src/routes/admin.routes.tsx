import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Dashboard } from '../screens/admin/Dashboard';
import { CreateWorkout } from '../screens/admin/CreateWorkout';
import { RegisterStudent } from '../screens/admin/RegisterStudent';

const Stack = createNativeStackNavigator();

export function AdminRoutes() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        // 1. Define a animação de deslizar (muito mais suave)
        animation: 'slide_from_right', 
        // 2. Garante que o fundo seja escuro durante a transição (evita o piscar branco)
        contentStyle: { backgroundColor: '#121214' } 
      }}
    >
      <Stack.Screen name="AdminDashboard" component={Dashboard} />
      <Stack.Screen name="CreateWorkout" component={CreateWorkout} />
      <Stack.Screen name="RegisterStudent" component={RegisterStudent} />
    </Stack.Navigator>
  );
}