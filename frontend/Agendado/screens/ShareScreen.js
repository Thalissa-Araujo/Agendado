import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../Theme/ThemeProvider';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

/**
 * Tela que lista agendas compartilhadas
 */
const ShareScreen = () => {
  const theme = useTheme();
  const [sharedCalendars, setSharedCalendars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca agendas compartilhadas
  useEffect(() => {
    const fetchSharedCalendars = async () => {
      try {
        const response = await api.get('/share');
        setSharedCalendars(response.data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar agendas compartilhadas');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedCalendars();
  }, []);

  // Revoga compartilhamento
  const handleRevoke = async (id) => {
    try {
      await api.delete(`/share/${id}`);
      setSharedCalendars(sharedCalendars.filter(item => item.id !== id));
      Alert.alert('Sucesso', 'Compartilhamento revogado');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível revogar o compartilhamento');
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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.primary }]}>
        Agendas Compartilhadas
      </Text>

      {sharedCalendars.length > 0 ? (
        <FlatList
          data={sharedCalendars}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: theme.white }]}>
              <View style={styles.cardContent}>
                <Text style={[styles.name, { color: theme.text }]}>
                  {item.sharedWith.name}
                </Text>
                <Text style={[styles.email, { color: theme.textLight }]}>
                  {item.sharedWith.email}
                </Text>
                <Text style={[styles.permission, { 
                  color: item.permissionLevel === 'edit' ? theme.primary : theme.text 
                }]}>
                  {item.permissionLevel === 'edit' ? 'Edição' : 'Visualização'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.revokeButton}
                onPress={() => handleRevoke(item.id)}
              >
                <Ionicons name="close" size={24} color={theme.error} />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={[styles.emptyText, { color: theme.textLight }]}>
          Nenhuma agenda compartilhada
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    marginTop: 2,
  },
  permission: {
    fontSize: 14,
    marginTop: 5,
  },
  revokeButton: {
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default ShareScreen;