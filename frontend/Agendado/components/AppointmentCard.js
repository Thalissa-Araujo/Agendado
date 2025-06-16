import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../Theme/ThemeProvider';

/**
 * Componente que exibe um card de agendamento
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.appointment - Dados do agendamento
 * @param {Function} props.onPress - Função ao clicar no card
 */
const AppointmentCard = ({ appointment, onPress }) => {
  const theme = useTheme();
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.card, { backgroundColor: theme.white }]}
    >
      <Text style={[styles.service, { color: theme.primary }]}>
        {appointment.service.name}
      </Text>
      
      <View style={styles.details}>
        <Text style={styles.text}>
          Cliente: {appointment.clientName}
        </Text>
        <Text style={styles.text}>
          Data: {new Date(appointment.date).toLocaleDateString()}
        </Text>
        <Text style={styles.text}>
          Horário: {appointment.time}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
  },
  service: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  details: {
    marginTop: 5,
  },
  text: {
    fontSize: 14,
    marginVertical: 2,
  },
});

export default AppointmentCard;