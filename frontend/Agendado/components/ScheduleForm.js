import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../Theme/ThemeProvider';

/**
 * Formulário para configurar horários de atendimento
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onSave - Função ao salvar os horários
 */
const ScheduleForm = ({ onSave }) => {
  const theme = useTheme();
  const days = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo',
  ];

  const [schedules, setSchedules] = useState(
    days.map((day) => ({
      day,
      enabled: false,
      startTime: '08:00',
      endTime: '18:00',
    }))
  );

  const handleSave = () => {
    const formattedSchedules = schedules
      .filter((s) => s.enabled)
      .map((s) => ({
        dayOfWeek: s.day.toLowerCase().replace('-feira', '').trim(),
        startTime: s.startTime + ':00',
        endTime: s.endTime + ':00',
        isAvailable: true,
      }));
    onSave(formattedSchedules);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {schedules.map((schedule, index) => (
        <View key={schedule.day} style={styles.dayContainer}>
          <View style={styles.dayHeader}>
            <Switch
              value={schedule.enabled}
              onValueChange={(value) => {
                const newSchedules = [...schedules];
                newSchedules[index].enabled = value;
                setSchedules(newSchedules);
              }}
              trackColor={{ false: theme.mediumGray, true: theme.primary }}
            />
            <Text style={[styles.dayText, { color: theme.text }]}>
              {schedule.day}
            </Text>
          </View>

          {schedule.enabled && (
            <View style={styles.timeContainer}>
              <Text style={[styles.timeLabel, { color: theme.text }]}>Das</Text>
              <Picker
                selectedValue={schedule.startTime}
                onValueChange={(value) => {
                  const newSchedules = [...schedules];
                  newSchedules[index].startTime = value;
                  setSchedules(newSchedules);
                }}
                style={[styles.picker, { color: theme.text }]}
                dropdownIconColor={theme.text}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <Picker.Item
                    key={`start-${i}`}
                    label={`${i.toString().padStart(2, '0')}:00`}
                    value={`${i.toString().padStart(2, '0')}:00`}
                  />
                ))}
              </Picker>

              <Text style={[styles.timeLabel, { color: theme.text }]}>às</Text>
              <Picker
                selectedValue={schedule.endTime}
                onValueChange={(value) => {
                  const newSchedules = [...schedules];
                  newSchedules[index].endTime = value;
                  setSchedules(newSchedules);
                }}
                style={[styles.picker, { color: theme.text }]}
                dropdownIconColor={theme.text}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <Picker.Item
                    key={`end-${i}`}
                    label={`${i.toString().padStart(2, '0')}:00`}
                    value={`${i.toString().padStart(2, '0')}:00`}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>
      ))}

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.primary }]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Salvar Horários</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  dayContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayText: {
    marginLeft: 10,
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: 16,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  saveButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScheduleForm;