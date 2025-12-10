import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons'; // Ícones minimalistas
import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');

export function SignIn() {
  const { signIn } = useAuth();
  
  // Estados locais
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Lógica de Login
  async function handleSignIn() {
    // 1. Resetar erros e teclado
    setErrorMessage('');
    Keyboard.dismiss();

    // 2. Validação simples
    if (email.trim() === '' || password.trim() === '') {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    // 3. Início do processo
    setLoading(true);

    try {
      // Chama o contexto (que tem o delay de 1.5s)
      await signIn(email, password);
    } catch (error) {
      setErrorMessage('Ocorreu um erro ao tentar logar.');
    } finally {
      // Nota: Se o login der certo, o componente será desmontado pelo AuthContext
      // antes mesmo de rodar essa linha, o que é o comportamento desejado.
      setLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Background Gradiente Imersivo */}
        <LinearGradient
          // Roxo Profundo -> Preto (Visual moderno de academia/tech)
          colors={['#4c1d95', '#121214', '#000000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          enabled
        >
          {/* Header / Logo */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Feather name="activity" size={40} color="#FF9000" />
            </View>
            <Text style={styles.title}>TrainerApp</Text>
            <Text style={styles.subtitle}>Gerencie seus treinos e alunos</Text>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            
            {/* Input Email */}
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Input Password */}
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Mensagem de Erro (Renderização Condicional) */}
            {!!errorMessage && (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={14} color="#ff4d4d" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {/* Botão de Ação */}
            <TouchableOpacity 
              activeOpacity={0.7} 
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#121214" />
              ) : (
                <Text style={styles.buttonText}>Acessar</Text>
              )}
            </TouchableOpacity>

            {/* Esqueceu senha / Criar conta */}
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>

          {/* Rodapé com Dica de Desenvolvimento */}
          <View style={styles.devFooter}>
            <Text style={styles.devText}>
              Dev Hint: Use <Text style={styles.bold}>admin@email.com</Text> ou <Text style={styles.bold}>student@email.com</Text>
            </Text>
          </View>

        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Stylesheet Otimizada
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 144, 0, 0.1)', // Laranja translúcido
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 144, 0, 0.3)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 23, 23, 0.5)', // Efeito Glass escuro
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    height: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 77, 77, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 12,
    marginLeft: 8,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#FF9000', // Laranja vibrante para CTA
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#FF9000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#9e6b26', // Laranja apagado
    opacity: 0.7,
  },
  buttonText: {
    color: '#121214', // Contraste preto no laranja
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  forgotText: {
    color: '#ccc',
    fontSize: 14,
  },
  devFooter: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    opacity: 0.6,
  },
  devText: {
    color: '#666',
    fontSize: 10,
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
    color: '#888',
  }
});