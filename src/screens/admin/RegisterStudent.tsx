import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// --- IMPORTS DO FIREBASE (Lógica Senior) ---
import { getApps, initializeApp, deleteApp } from 'firebase/app';
import { createUserWithEmailAndPassword, signOut, initializeAuth, inMemoryPersistence, getAuth } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
// Importamos 'auth' para pegar o ID do Admin e 'firebaseConfig' para o truque do login
import { db, auth, firebaseConfig } from '../../services/firebaseConfig';
type RootStackParamList = {
  Dashboard: undefined;
  RegisterStudent: undefined;
};

type RegisterScreenProp = NativeStackNavigationProp<RootStackParamList, 'RegisterStudent'>;

export function RegisterStudent() {
  const navigation = useNavigation<RegisterScreenProp>();

  // Estados do Formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Adicionado: Firebase exige senha
  const [phone, setPhone] = useState('');
  const [goal, setGoal] = useState('hypertrophy');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    // 1. Validação
    if (!name.trim() || !email.trim() || !password.trim() || !phone.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (password.length < 6) {
        Alert.alert('Senha Fraca', 'A senha deve ter no mínimo 6 caracteres.');
        return;
    }

    setLoading(true);

    const SECONDARY_APP_NAME = 'SecondaryApp';
    let secondaryApp;

    try {
        // --- INÍCIO DA ESTRATÉGIA "SECONDARY APP" ---
        
        // 1. Instância temporária para não deslogar o Admin
        secondaryApp = getApps().find(app => app.name === SECONDARY_APP_NAME);
        if (!secondaryApp) {
            secondaryApp = initializeApp(firebaseConfig, SECONDARY_APP_NAME);
        }

        // 2. Configura Auth em Memória (não salva no celular)
        let secondaryAuth;
        try {
            secondaryAuth = initializeAuth(secondaryApp, {
                persistence: inMemoryPersistence
            });
        } catch (e: any) {
            if (e.code === 'auth/already-initialized') {
                secondaryAuth = getAuth(secondaryApp);
            } else {
                throw e;
            }
        }

        // 3. Cria o usuário na Authentication
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
        const newStudentUid = userCredential.user.uid;

        // 4. Salva os dados completos no Firestore
        await setDoc(doc(db, "students", newStudentUid), {
            uid: newStudentUid,
            name,
            email,
            phone,
            goal,
            personalTrainerId: auth.currentUser?.uid, // Vincula ao Admin logado
            createdAt: serverTimestamp(),
            active: true,
            role: 'student'
        });

        // 5. Logout da sessão temporária
        await signOut(secondaryAuth);

        console.log('--- NOVO ALUNO CADASTRADO NO FIREBASE ---');

        Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);

    } catch (error: any) {
        console.error("Erro ao cadastrar:", error);
        
        let msg = "Não foi possível cadastrar o aluno.";
        if (error.code === 'auth/email-already-in-use') msg = "Este e-mail já está sendo usado.";
        if (error.code === 'auth/invalid-email') msg = "Formato de e-mail inválido.";
        
        Alert.alert("Erro", msg);
    } finally {
        // 6. Limpeza de memória
        if (secondaryApp) {
            try { await deleteApp(secondaryApp); } catch (e) {}
        }
        setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#E1E1E6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Aluno</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>Dados Pessoais</Text>

          {/* INPUT: NOME */}
          <View style={styles.inputContainer}>
            <Feather name="user" size={20} color="#999" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nome Completo"
              placeholderTextColor="#7C7C8A"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* INPUT: EMAIL */}
          <View style={styles.inputContainer}>
            <Feather name="mail" size={20} color="#999" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#7C7C8A"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

           {/* INPUT: SENHA (ADICIONADO) */}
           <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#999" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Senha Inicial"
              placeholderTextColor="#7C7C8A"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              secureTextEntry
            />
          </View>

          {/* INPUT: TELEFONE */}
          <View style={styles.inputContainer}>
            <Feather name="smartphone" size={20} color="#999" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Telefone / WhatsApp"
              placeholderTextColor="#7C7C8A"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <Text style={styles.sectionLabel}>Objetivo do Treino</Text>

          {/* PICKER */}
          <View style={styles.pickerContainer}>
            <MaterialIcons name="fitness-center" size={20} color="#999" style={styles.icon} />
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={goal}
                onValueChange={(itemValue) => setGoal(itemValue)}
                style={styles.picker}
                dropdownIconColor="#E1E1E6"
                mode="dropdown" 
              >
                <Picker.Item label="Hipertrofia" value="hypertrophy" color={Platform.OS === 'ios' ? '#E1E1E6' : '#000'} />
                <Picker.Item label="Emagrecimento" value="weight_loss" color={Platform.OS === 'ios' ? '#E1E1E6' : '#000'} />
                <Picker.Item label="Condicionamento" value="conditioning" color={Platform.OS === 'ios' ? '#E1E1E6' : '#000'} />
                <Picker.Item label="Força Pura (Powerlifting)" value="strength" color={Platform.OS === 'ios' ? '#E1E1E6' : '#000'} />
              </Picker>
            </View>
          </View>

          {/* BOTÃO */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="#121214" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar Aluno</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121214',
    paddingTop: 40, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#29292E',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E1E1E6',
  },
  scrollContent: {
    padding: 24,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#7C7C8A',
    marginBottom: 12,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202024',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#29292E',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202024',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 56, 
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#29292E',
    overflow: 'hidden',
  },
  pickerWrapper: {
    flex: 1,
    marginLeft: -8, 
  },
  picker: {
    color: '#E1E1E6',
    width: '100%',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#E1E1E6',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF9000',
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#121214',
    fontSize: 16,
    fontWeight: 'bold',
  },
});