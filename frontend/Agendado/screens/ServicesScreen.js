import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../Theme/ThemeProvider';
import ServiceForm from '../components/ServiceForm';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

/**
 * Tela de gerenciamento de serviços oferecidos
 */
const ServicesScreen = () => {
  const theme = useTheme();
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Busca os serviços ao carregar a tela
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os serviços');
    }
  };

  const handleSaveService = async (serviceData) => {
    try {
      if (editingService) {
        // Atualiza serviço existente
        await api.put(`/services/${editingService.id}`, serviceData);
      } else {
        // Cria novo serviço
        await api.post('/services', serviceData);
      }
      setShowForm(false);
      setEditingService(null);
      fetchServices();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o serviço');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/services/${id}`);
      fetchServices();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir o serviço');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {showForm ? (
        <ServiceForm
          initialData={editingService}
          onSubmit={handleSaveService}
          onCancel={() => {
            setShowForm(false);
            setEditingService(null);
          }}
        />
      ) : (
        <>
          <FlatList
            data={services}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.serviceCard, { backgroundColor: theme.white }]}>
                <View style={styles.serviceInfo}>
                  <Text style={[styles.serviceName, { color: theme.primary }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.serviceDetails, { color: theme.text }]}>
                    {item.duration} min • R$ {item.price || 'A combinar'}
                  </Text>
                </View>
                <View style={styles.serviceActions}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingService(item);
                      setShowForm(true);
                    }}
                  >
                    <Ionicons name="create" size={24} color={theme.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash" size={24} color={theme.error} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: theme.textLight }]}>
                Nenhum serviço cadastrado
              </Text>
            }
          />

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => setShowForm(true)}
          >
            <Ionicons name="add" size={24} color="white" />
            <Text style={styles.addButtonText}>Adicionar Serviço</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  serviceDetails: {
    fontSize: 14,
    marginTop: 5,
  },
  serviceActions: {
    flexDirection: 'row',
  },
  deleteButton: {
    marginLeft: 15,
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

export default ServicesScreen;