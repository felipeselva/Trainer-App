import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  StatusBar 
} from 'react-native';
import { Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext'; // <--- Importando o Auth

// --- MOCK DATA (Dados Fictícios) ---
interface StatsData {
  activeStudents: number;
  pendingWorkouts: number;
  revenue: string;
}

interface StudentData {
  id: string;
  name: string;
  status: 'done' | 'pending' | 'missed';
  photo_url: string;
  lastWorkout: string;
}

const DASHBOARD_STATS: StatsData = {
  activeStudents: 12,
  pendingWorkouts: 5,
  revenue: '€ 1.200',
};

const RECENT_STUDENTS: StudentData[] = [
  {
    id: '1',
    name: 'Ana Silva',
    status: 'done',
    photo_url: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    lastWorkout: 'Treino A - Inferiores',
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    status: 'pending',
    photo_url: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    lastWorkout: 'Treino B - Superiores',
  },
  {
    id: '3',
    name: 'Mariana Costa',
    status: 'missed',
    photo_url: 'https://i.pravatar.cc/150?u=a04258114e29026302d',
    lastWorkout: 'Cardio Intenso',
  },
];

// --- COMPONENTE PRINCIPAL ---
export function Dashboard() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { signOut, user } = useAuth(); // <--- Pegando a função de sair

  // Função auxiliar para pegar saudação e data
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return '#04D361'; // Verde
      case 'pending': return '#FF9000'; // Laranja
      case 'missed': return '#FF4D4D'; // Vermelho
      default: return '#999';
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* 1. CABEÇALHO */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.name || 'Treinador'}</Text>
            <Text style={styles.dateText}>{getCurrentDate()}</Text>
          </View>

          {/* ÁREA DO PERFIL + BOTÃO SAIR */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            {/* Botão de Sair Adicionado Aqui */}
            <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
               <Feather name="log-out" size={24} color="#FF9000" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileButton}>
              <Image 
                source={{ uri: 'https://github.com/github.png' }} 
                style={styles.profileImage} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. CARDS DE RESUMO (Stats) */}
        <View style={styles.statsContainer}>
          {/* Card Alunos */}
          <View style={styles.statCard}>
            <View style={[styles.iconBg, { backgroundColor: 'rgba(4, 211, 97, 0.1)' }]}>
              <Feather name="users" size={24} color="#04D361" />
            </View>
            <Text style={styles.statNumber}>{DASHBOARD_STATS.activeStudents}</Text>
            <Text style={styles.statLabel}>Alunos Ativos</Text>
          </View>

          {/* Card Pendências */}
          <View style={styles.statCard}>
            <View style={[styles.iconBg, { backgroundColor: 'rgba(255, 144, 0, 0.1)' }]}>
              <Feather name="activity" size={24} color="#FF9000" />
            </View>
            <Text style={styles.statNumber}>{DASHBOARD_STATS.pendingWorkouts}</Text>
            <Text style={styles.statLabel}>Treinos Pendentes</Text>
          </View>

          {/* Card Receita */}
          <View style={styles.statCard}>
            <View style={[styles.iconBg, { backgroundColor: 'rgba(130, 87, 229, 0.1)' }]}>
              <MaterialIcons name="attach-money" size={24} color="#8257E5" />
            </View>
            <Text style={styles.statNumber} numberOfLines={1} adjustsFontSizeToFit>
              {DASHBOARD_STATS.revenue}
            </Text>
            <Text style={styles.statLabel}>Faturamento</Text>
          </View>
        </View>

        {/* 3. BOTÕES DE AÇÃO RÁPIDA */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Acesso Rápido</Text>
          
          <View style={styles.buttonsRow}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#FF9000' }]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('RegisterStudent')}
            >
              <Feather name="user-plus" size={24} color="#121214" />
              <Text style={[styles.actionText, { color: '#121214' }]}>Novo Aluno</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#29292E' }]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('CreateWorkout')}
            >
              <FontAwesome5 name="dumbbell" size={20} color="#FFF" />
              <Text style={styles.actionText}>Novo Treino</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. LISTA DE ALUNOS RECENTES */}
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Atividades Recentes</Text>
            <TouchableOpacity onPress={() => console.log('Ver todos')}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {RECENT_STUDENTS.map((student) => (
            <View key={student.id} style={styles.studentCard}>
              <Image source={{ uri: student.photo_url }} style={styles.studentAvatar} />
              
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentWorkout}>{student.lastWorkout}</Text>
              </View>

              <View style={styles.statusContainer}>
                <View 
                  style={[
                    styles.statusDot, 
                    { backgroundColor: getStatusColor(student.status) }
                  ]} 
                />
                <Text style={[styles.statusText, { color: getStatusColor(student.status) }]}>
                  {student.status === 'done' ? 'Feito' : student.status === 'pending' ? 'Pendente' : 'Perdeu'}
                </Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121214' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#E1E1E6' },
  dateText: { fontSize: 14, color: '#7C7C8A', textTransform: 'capitalize' },
  
  // Estilo novo para o botão de logout
  logoutButton: { padding: 8 },
  
  profileButton: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#FF9000', justifyContent: 'center', alignItems: 'center' },
  profileImage: { width: 42, height: 42, borderRadius: 21 },
  
  // ... (O restante dos estilos continua igual ao seu arquivo original)
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  statCard: { width: '31%', backgroundColor: '#202024', borderRadius: 8, padding: 12, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  iconBg: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#E1E1E6', marginBottom: 4 },
  statLabel: { fontSize: 10, color: '#7C7C8A', textAlign: 'center' },
  actionsContainer: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#E1E1E6', marginBottom: 16 },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { width: '48%', height: 56, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  actionText: { fontSize: 16, fontWeight: 'bold', color: '#E1E1E6' },
  listContainer: { width: '100%' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  seeAllText: { color: '#FF9000', fontSize: 14, fontWeight: '600' },
  studentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#202024', borderRadius: 12, padding: 16, marginBottom: 12 },
  studentAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 16, backgroundColor: '#333' },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 16, fontWeight: 'bold', color: '#E1E1E6' },
  studentWorkout: { fontSize: 12, color: '#7C7C8A', marginTop: 2 },
  statusContainer: { alignItems: 'flex-end' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 4 },
  statusText: { fontSize: 10, fontWeight: 'bold' }
});