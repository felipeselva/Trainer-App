import React from 'react';
import { View, ActivityIndicator } from 'react-native';
// 1. Importe o DefaultTheme aqui
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'; 
import { useAuth } from '../contexts/AuthContext';

import { AdminRoutes } from './admin.routes';
import { StudentRoutes } from './student.routes';
import { AuthRoutes } from './AuthRoutes';

export function Routes() {
  const { signed, loading, user } = useAuth();

  // 2. Crie esse tema personalizado escuro
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#121214', // <--- A MÁGICA: O fundo global agora é a cor do seu app
    },
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121214' }}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    // 3. Adicione a prop 'theme' aqui no NavigationContainer
    <NavigationContainer theme={MyTheme}>
      {signed && user ? (
        user.role === 'admin' ? <AdminRoutes /> : <StudentRoutes />
      ) : (
        <AuthRoutes />
      )}
    </NavigationContainer>
  );
}