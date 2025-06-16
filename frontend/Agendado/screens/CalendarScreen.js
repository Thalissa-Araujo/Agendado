import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '../Theme/ThemeProvider';
import AppointmentCard from '../components/AppointmentCard';
import api from '../services/api';

/**
 * Tela principal que exibe o calendário com os agendamentos
 */
const CalendarScreen = ({ navigation }) => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  // Busca agendamentos ao carregar a tela ou mudar data
  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  /**
   * Busca os agendamentos do backend
   */
  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments', {
        params: { date: selectedDate }
      });
      setAppointments(response.data);
      
      // Marca datas com agendamentos no calendário
      const dates = {};
      response.data.forEach(app => {
        dates[app.date] = { marked: true, dotColor: theme.primary };
      });
      setMarkedDates(dates);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
  };

  /**
   * Manipula a seleção de data no calendário
   * @param {Object} day - Objeto com dados do dia selecionado
   */
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Calendar
        current={selectedDate}
        onDayPress={handleDayPress}
        markedDates={{
          ...markedDates,
          [selectedDate]: { 
            selected: true, 
            selectedColor: theme.primary 
          }
        }}
        theme={{
          calendarBackground: theme.background,
          selectedDayBackgroundColor: theme.primary,
          todayTextColor: theme.primary,
          arrowColor: theme.primary,
        }}
      />
      
      <ScrollView style={styles.list}>
        {appointments.length > 0 ? (
          appointments.map(app => (
            <AppointmentCard
              key={app.id}
              appointment={app}
              onPress={() => navigation.navigate('AppointmentDetail', { id: app.id })}
            />
          ))
        ) : (
          <Text style={[styles.empty, { color: theme.textLight }]}>
            Nenhum agendamento para esta data
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
    paddingHorizontal: 15,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default CalendarScreen;