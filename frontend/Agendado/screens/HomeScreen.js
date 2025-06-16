import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../Theme/ThemeProvider';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import AppointmentCard from '../components/AppointmentCard';
import { Ionicons } from '@expo/vector-icons';

/**
 * Tela inicial do aplicativo (dashboard)
 */
const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca os agendamentos do dia
  useEffect(() => {
    const fetchTodayAppointments = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await api.get('/appointments', {
          params: { date: today },
        });
        setTodayAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayAppointments();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primary }]}>
          Bem-vindo, {user?.name.split(' ')[0]}!
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Agendamentos de Hoje
      </Text>

      {loading ? (
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Carregando...
        </Text>
      ) : todayAppointments.length > 0 ? (
        <ScrollView style={styles.list}>
          {todayAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onPress={() =>
                navigation.navigate('AppointmentDetail', { id: appointment.id })
              }
            />
          ))}
        </ScrollView>
      ) : (
        <Text style={[styles.emptyText, { color: theme.textLight }]}>
          Nenhum agendamento para hoje
        </Text>
      )}

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('Calendar')}
      >
        <Ionicons name="calendar" size={24} color="white" />
        <Text style={styles.addButtonText}>Ver Calendário Completo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  list: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default HomeScreen;