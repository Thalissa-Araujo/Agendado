import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../Theme/ThemeProvider';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

/**
 * Tela que exibe detalhes de um agendamento específico
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.route - Parâmetros da rota
 * @param {string} props.route.params.id - ID do agendamento
 */
const AppointmentDetailScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Busca os detalhes do agendamento
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await api.get(`/appointments/${route.params.id}`);
        setAppointment(response.data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os detalhes do agendamento');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [route.params.id]);

  // Cancela o agendamento
  const handleCancel = async () => {
    try {
      await api.patch(`/appointments/${appointment.id}/cancel`);
      Alert.alert('Sucesso', 'Agendamento cancelado com sucesso');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cancelar o agendamento');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Carregando...
        </Text>
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>
          Agendamento não encontrado
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.serviceName, { color: theme.primary }]}>
          {appointment.service.name}
        </Text>
        <Text style={[styles.status, { 
          color: appointment.status === 'cancelled' ? theme.error : theme.success 
        }]}>
          {appointment.status === 'scheduled' ? 'Agendado' : 'Cancelado'}
        </Text>
      </View>

      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Ionicons name="person" size={20} color={theme.primary} />
          <Text style={[styles.detailText, { color: theme.text }]}>
            {appointment.clientName}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={20} color={theme.primary} />
          <Text style={[styles.detailText, { color: theme.text }]}>
            {new Date(appointment.date).toLocaleDateString('pt-BR')}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time" size={20} color={theme.primary} />
          <Text style={[styles.detailText, { color: theme.text }]}>
            {appointment.time}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="cash" size={20} color={theme.primary} />
          <Text style={[styles.detailText, { color: theme.text }]}>
            R$ {appointment.service.price || 'A combinar'}
          </Text>
        </View>

        {appointment.notes && (
          <View style={styles.notesContainer}>
            <Text style={[styles.notesTitle, { color: theme.primary }]}>
              Observações:
            </Text>
            <Text style={[styles.notesText, { color: theme.text }]}>
              {appointment.notes}
            </Text>
          </View>
        )}
      </View>

      {appointment.status === 'scheduled' && (
        <TouchableOpacity
          style={[styles.cancelButton, { backgroundColor: theme.error }]}
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>Cancelar Agendamento</Text>
        </TouchableOpacity>
      )}
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
  serviceName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
  },
  notesContainer: {
    marginTop: 20,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default AppointmentDetailScreen;