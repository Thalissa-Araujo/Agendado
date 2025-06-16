import React from 'react';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '../Theme/ThemeProvider';

/**
 * Componente de calendário reutilizável
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.markedDates - Datas marcadas no calendário
 * @param {Function} props.onDayPress - Função ao pressionar um dia
 * @param {string} props.currentDate - Data selecionada atualmente
 */
const CalendarView = ({ markedDates, onDayPress, currentDate }) => {
  const theme = useTheme();

  return (
    <Calendar
      current={currentDate}
      onDayPress={onDayPress}
      markedDates={markedDates}
      theme={{
        calendarBackground: theme.background,
        selectedDayBackgroundColor: theme.primary,
        todayTextColor: theme.primary,
        arrowColor: theme.primary,
        dayTextColor: theme.text,
        monthTextColor: theme.primary,
        textDisabledColor: theme.mediumGray,
        dotColor: theme.primary,
      }}
      style={{
        borderWidth: 1,
        borderColor: theme.lightGray,
        borderRadius: 10,
      }}
    />
  );
};

export default CalendarView;