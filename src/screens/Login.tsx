import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/useAuth'; // Vamos criar esse hook rápido ou usar direto do Context
import { AuthContext } from '../contexts/AuthContext'; // Importe direto se preferir

export function Login() {
  const { signIn, loading } = React.useContext(AuthContext);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    if(!email || !password) return Alert.alert('Erro', 'Preencha todos os campos');
    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Erro no Login', error.message);
    }
  }

  return (
    <LinearGradient colors={['#1E293B', '#0F172A']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>TRAINER<Text style={{color: '#FF6B00'}}>APP</Text></Text>
        <Text style={styles.subtitle}>Gerencie seus treinos e alunos</Text>

        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="E-mail" 
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Senha" 
            placeholderTextColor="#94A3B8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>ACESSAR</Text>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  content: { alignItems: 'center', width: '100%' },
  title: { fontSize: 32, fontWeight: '900', color: '#FFF', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#94A3B8', marginBottom: 48 },
  inputContainer: { width: '100%', gap: 16, marginBottom: 32 },
  input: {
    backgroundColor: '#334155', borderRadius: 12, padding: 16,
    color: '#FFF', fontSize: 16, borderWidth: 1, borderColor: '#475569'
  },
  button: {
    width: '100%', backgroundColor: '#FF6B00', borderRadius: 12,
    padding: 16, alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});