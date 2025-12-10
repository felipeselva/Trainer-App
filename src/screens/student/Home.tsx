import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext'; // Importando o hook de auth

const { width } = Dimensions.get('window');

// --- MOCK DATA (Dados Falsos para teste) ---
interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  done: boolean;
}

const WORKOUT_MOCK = {
  title: 'Treino A - Hipertrofia Pernas',
  exercises: [
    { id: '1', name: 'Agachamento Livre', sets: '4', reps: '10-12', done: false },
    { id: '2', name: 'Leg Press 45', sets: '3', reps: '12', done: false },
    { id: '3', name: 'Cadeira Extensora', sets: '3', reps: '15', done: false },
    { id: '4', name: 'Stiff com Halteres', sets: '4', reps: '10', done: false },
    { id: '5', name: 'Panturrilha Sentado', sets: '4', reps: '20', done: false },
  ]
};

export function Home() { // Mantive o nome Home para não quebrar a rota!
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth(); // Pegando dados do usuário logado
  const [exercises, setExercises] = useState<Exercise[]>(WORKOUT_MOCK.exercises);

  // --- Lógica de Progresso ---
  const progressStats = useMemo(() => {
    const total = exercises.length;
    const completed = exercises.filter(e => e.done).length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, percentage: Math.round(percentage) };
  }, [exercises]);

  function toggleExercise(id: string) {
    const updatedList = exercises.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    );
    setExercises(updatedList);
  }

  const renderExerciseCard = ({ item }: { item: Exercise }) => {
    return (
      <TouchableOpacity 
        style={[styles.card, item.done && styles.cardDone]} 
        onPress={() => toggleExercise(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardInfo}>
          <Text style={[styles.exerciseName, item.done && styles.textDone]}>
            {item.name}
          </Text>
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Feather name="layers" size={12} color="#666" />
              <Text style={styles.badgeText}>{item.sets} séries</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="repeat" size={12} color="#666" />
              <Text style={styles.badgeText}>{item.reps} reps</Text>
            </View>
          </View>
        </View>

        <View style={styles.checkContainer}>
          {item.done ? (
            <MaterialIcons name="check-circle" size={32} color="#04D361" />
          ) : (
            <MaterialIcons name="radio-button-unchecked" size={32} color="#E1E1E6" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* 1. HEADER GRADIENTE */}
      <LinearGradient
        colors={['#FF9000', '#FF5500']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.headerTopRow}>
          <View>
             <Text style={styles.greeting}>BORA TREINAR, {user?.name?.toUpperCase() || 'ALUNO'}</Text>
             <Text style={styles.workoutTitle}>{WORKOUT_MOCK.title}</Text>
          </View>
          <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* --- CARD DE PROGRESSO --- */}
        <View style={styles.progressCard}>
            <View style={styles.progressTextRow}>
                <Text style={styles.progressLabel}>Progresso do Treino</Text>
                <Text style={styles.progressPercent}>{progressStats.percentage}%</Text>
            </View>
            
            <View style={styles.progressBarTrack}>
                <LinearGradient
                    colors={['#FF9000', '#FF5500']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressBarFill, { width: `${progressStats.percentage}%` }]}
                />
            </View>
            
            <Text style={styles.progressFooter}>
                {progressStats.completed} de {progressStats.total} exercícios concluídos
            </Text>
        </View>

      </LinearGradient>

      {/* 2. LISTA DE EXERCÍCIOS */}
      <View style={styles.listContainer}>
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={renderExerciseCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.listLabel}>Sequência</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 40, 
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    height: 280, 
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  workoutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    width: '85%',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  // --- Progress Card ---
  progressCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FF5500', 
  },
  progressBarTrack: {
    height: 12,
    backgroundColor: '#F0F2F5',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressFooter: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  // --- List ---
  listContainer: {
    flex: 1,
    marginTop: 20, 
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  listLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginLeft: 4,
  },
  // Cards
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardDone: {
    opacity: 0.6,
    backgroundColor: '#FAFAFA',
  },
  cardInfo: {
    flex: 1,
    marginRight: 16,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  textDone: {
    color: '#AAA',
    textDecorationLine: 'line-through',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  checkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});