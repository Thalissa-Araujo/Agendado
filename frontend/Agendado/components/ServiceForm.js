import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../Theme/ThemeProvider';

/**
 * Formulário para adicionar/editar serviços
 * @param {Object} props - Propriedades do componente
 * @param {Object} [props.initialData] - Dados iniciais para edição
 * @param {Function} props.onSubmit - Função ao submeter o formulário
 */
const ServiceForm = ({ initialData, onSubmit }) => {
  const theme = useTheme();
  const [service, setService] = useState({
    name: initialData?.name || '',
    duration: initialData?.duration?.toString() || '30',
    price: initialData?.price?.toString() || '',
    description: initialData?.description || '',
  });

  const handleSubmit = () => {
    onSubmit({
      ...service,
      duration: parseInt(service.duration),
      price: service.price ? parseFloat(service.price) : null,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.text }]}>Nome do Serviço</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.mediumGray }]}
        value={service.name}
        onChangeText={(text) => setService({ ...service, name: text })}
        placeholder="Ex: Corte de Cabelo"
      />

      <Text style={[styles.label, { color: theme.text }]}>Duração (minutos)</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.mediumGray }]}
        value={service.duration}
        onChangeText={(text) => setService({ ...service, duration: text })}
        keyboardType="numeric"
      />

      <Text style={[styles.label, { color: theme.text }]}>Preço (opcional)</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.mediumGray }]}
        value={service.price}
        onChangeText={(text) => setService({ ...service, price: text })}
        keyboardType="numeric"
        placeholder="R$"
      />

      <Text style={[styles.label, { color: theme.text }]}>Descrição (opcional)</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.mediumGray, height: 80 }]}
        value={service.description}
        onChangeText={(text) => setService({ ...service, description: text })}
        multiline
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Salvar Serviço</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServiceForm;