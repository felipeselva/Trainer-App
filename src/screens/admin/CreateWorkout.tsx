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
  Image
} from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

// --- INTERFACES & MOCK DATA ---
interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  load?: string; // Carga opcional
}

const MOCK_STUDENTS = [
  { id: '1', name: 'Ana Silva' },
  { id: '2', name: 'Carlos Mendes' },
  { id: '3', name: 'Mariana Costa' },
];

export function CreateWorkout() {
  const navigation = useNavigation();

  // --- STATES DO TREINO ---
  const [workoutName, setWorkoutName] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(MOCK_STUDENTS[0].id);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // --- STATES DO INPUT TEMPORÁRIO (Adicionar Exercício) ---
  const [tempName, setTempName] = useState('');
  const [tempSets, setTempSets] = useState('');
  const [tempReps, setTempReps] = useState('');
  const [tempLoad, setTempLoad] = useState('');

  // 1. ADICIONAR EXERCÍCIO À LISTA
  function handleAddExercise() {
    if (!tempName.trim() || !tempSets.trim() || !tempReps.trim()) {
      Alert.alert('Atenção', 'Preencha Nome, Séries e Repetições para adicionar.');
      return;
    }

    const newExercise: Exercise = {
      id: Math.random().toString(), // ID temporário único
      name: tempName,
      sets: tempSets,
      reps: tempReps,
      load: tempLoad
    };

    setExercises((prevState) => [...prevState, newExercise]);

    // Limpar inputs
    setTempName('');
    setTempSets('');
    setTempReps('');
    setTempLoad('');
  }

  // 2. REMOVER EXERCÍCIO DA LISTA
  function handleRemoveExercise(id: string) {
    setExercises((prevState) => prevState.filter(item => item.id !== id));
  }

  // 3. SALVAR TREINO FINAL
  function handleSaveWorkout() {
    if (!workoutName.trim()) {
      Alert.alert('Erro', 'Dê um nome para o treino.');
      return;
    }

    if (exercises.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um exercício ao treino.');
      return;
    }

    // Objeto Final
    const finalWorkoutObject = {
      workoutName,
      studentId: selectedStudent,
      exercises: exercises,
      createdAt: new Date().toISOString()
    };

    console.log('=== TREINO SALVO ===');
    console.log(JSON.stringify(finalWorkoutObject, null, 2));

    Alert.alert('Sucesso', 'Treino criado e enviado para o aluno!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#E1E1E6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Treino</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* --- BLOCO 1: DADOS GERAIS --- */}
          <Text style={styles.sectionLabel}>Informações do Treino</Text>
          
          <View style={styles.inputContainer}>
            <Feather name="type" size={20} color="#999" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nome do Treino (Ex: Treino A)"
              placeholderTextColor="#7C7C8A"
              value={workoutName}
              onChangeText={setWorkoutName}
            />
          </View>

          <View style={styles.pickerContainer}>
            <Feather name="user" size={20} color="#999" style={styles.icon} />
            <View style={{ flex: 1 }}>
              <Picker
                selectedValue={selectedStudent}
                onValueChange={(itemValue) => setSelectedStudent(itemValue)}
                style={styles.picker}
                dropdownIconColor="#E1E1E6"
              >
                {MOCK_STUDENTS.map(student => (
                  <Picker.Item 
                    key={student.id} 
                    label={student.name} 
                    value={student.id} 
                    color={Platform.OS === 'ios' ? '#E1E1E6' : '#000'}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* --- BLOCO 2: ÁREA DE ADIÇÃO (CARD DIFERENCIADO) --- */}
          <Text style={styles.sectionLabel}>Adicionar Exercício</Text>
          
          <View style={styles.addCard}>
            {/* Input Nome Exercício */}
            <TextInput
              style={styles.cardInput}
              placeholder="Nome do Exercício (Ex: Supino Reto)"
              placeholderTextColor="#7C7C8A"
              value={tempName}
              onChangeText={setTempName}
            />

            {/* Inputs Menores em Linha */}
            <View style={styles.row}>
              <View style={[styles.cardInputSmall, { marginRight: 8 }]}>
                <Text style={styles.smallLabel}>Séries</Text>
                <TextInput
                  style={styles.smallInputText}
                  placeholder="3"
                  placeholderTextColor="#555"
                  keyboardType="numeric"
                  value={tempSets}
                  onChangeText={setTempSets}
                />
              </View>

              <View style={[styles.cardInputSmall, { marginRight: 8 }]}>
                <Text style={styles.smallLabel}>Reps</Text>
                <TextInput
                  style={styles.smallInputText}
                  placeholder="12"
                  placeholderTextColor="#555"
                  keyboardType="numeric"
                  value={tempReps}
                  onChangeText={setTempReps}
                />
              </View>

              <View style={styles.cardInputSmall}>
                <Text style={styles.smallLabel}>Carga (kg)</Text>
                <TextInput
                  style={styles.smallInputText}
                  placeholder="-"
                  placeholderTextColor="#555"
                  keyboardType="numeric"
                  value={tempLoad}
                  onChangeText={setTempLoad}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.addButton} 
              activeOpacity={0.7}
              onPress={handleAddExercise}
            >
              <Feather name="plus-circle" size={20} color="#FFF" />
              <Text style={styles.addButtonText}>Adicionar à Lista</Text>
            </TouchableOpacity>
          </View>

          {/* --- BLOCO 3: LISTA DE ITENS ADICIONADOS --- */}
          {exercises.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { marginTop: 24 }]}>
                Exercícios ({exercises.length})
              </Text>
              
              {exercises.map((item, index) => (
                <View key={item.id} style={styles.exerciseItem}>
                  <View style={styles.exerciseNumber}>
                    <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                  </View>
                  
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{item.name}</Text>
                    <Text style={styles.exerciseDetails}>
                      {item.sets} séries x {item.reps} reps 
                      {item.load ? ` • ${item.load}kg` : ''}
                    </Text>
                  </View>

                  <TouchableOpacity 
                    onPress={() => handleRemoveExercise(item.id)}
                    style={styles.deleteButton}
                  >
                    <Feather name="trash-2" size={20} color="#FF4D4D" />
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}

          {/* ESPAÇO FINAL */}
          <View style={{ height: 100 }} />

        </ScrollView>

        {/* --- RODAPÉ FLUTUANTE --- */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSaveWorkout}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Salvar Treino</Text>
          </TouchableOpacity>
        </View>

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
    paddingBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#7C7C8A',
    marginBottom: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
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
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#E1E1E6',
    fontSize: 16,
  },
  picker: {
    color: '#E1E1E6',
    width: '100%',
  },
  // ADD CARD STYLES
  addCard: {
    backgroundColor: '#29292E',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#323238',
  },
  cardInput: {
    backgroundColor: '#121214',
    borderRadius: 6,
    height: 50,
    paddingHorizontal: 12,
    color: '#E1E1E6',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#202024',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  cardInputSmall: {
    flex: 1,
    backgroundColor: '#121214',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#202024',
  },
  smallLabel: {
    fontSize: 10,
    color: '#7C7C8A',
    marginBottom: 4,
  },
  smallInputText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: 'rgba(4, 211, 97, 0.1)', // Verde transparente
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(4, 211, 97, 0.3)',
  },
  addButtonText: {
    color: '#04D361',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // EXERCISE LIST STYLES
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202024',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9000',
  },
  exerciseNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#29292E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  exerciseNumberText: {
    color: '#7C7C8A',
    fontSize: 12,
    fontWeight: 'bold',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: '#E1E1E6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseDetails: {
    color: '#7C7C8A',
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
  // FOOTER
  footer: {
    padding: 24,
    backgroundColor: '#121214',
    borderTopWidth: 1,
    borderTopColor: '#29292E',
  },
  saveButton: {
    backgroundColor: '#FF9000',
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#121214',
    fontSize: 16,
    fontWeight: 'bold',
  },
});