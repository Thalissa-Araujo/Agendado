import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../Theme/ThemeProvider';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import ShareModal from '../components/ShareModal';
import { Ionicons } from '@expo/vector-icons';

/**
 * Tela de configurações do aplicativo
 */
const SettingsScreen = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const handleShare = async (email, permission) => {
    try {
      await api.post('/share', {
        sharedWithEmail: email,
        permissionLevel: permission,
      });
      Alert.alert('Sucesso', 'Agenda compartilhada com sucesso');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar a agenda');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: logout },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.profileSection}>
        <View style={[styles.profileIcon, { backgroundColor: theme.primary }]}>
          <Ionicons name="person" size={24} color="white" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: theme.text }]}>
            {user?.name}
          </Text>
          <Text style={[styles.profileEmail, { color: theme.textLight }]}>
            {user?.email}
          </Text>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>
          Configurações
        </Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications" size={20} color={theme.text} />
            <Text style={[styles.settingText, { color: theme.text }]}>
              Notificações
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: theme.mediumGray, true: theme.primary }}
          />
        </View>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setShareModalVisible(true)}
        >
          <View style={styles.settingInfo}>
            <Ionicons name="share-social" size={20} color={theme.text} />
            <Text style={[styles.settingText, { color: theme.text }]}>
              Compartilhar Agenda
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.mediumGray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="time" size={20} color={theme.text} />
            <Text style={[styles.settingText, { color: theme.text }]}>
              Horários de Atendimento
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.mediumGray} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { borderColor: theme.error }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out" size={20} color={theme.error} />
        <Text style={[styles.logoutText, { color: theme.error }]}>
          Sair da Conta
        </Text>
      </TouchableOpacity>

      <ShareModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        onShare={handleShare}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
  },
  settingsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 'auto',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default SettingsScreen;