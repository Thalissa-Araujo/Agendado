import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../Theme/ThemeProvider';

/**
 * Modal para compartilhar agenda com outros profissionais
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.visible - Controla a visibilidade do modal
 * @param {Function} props.onClose - Função ao fechar o modal
 * @param {Function} props.onShare - Função ao compartilhar a agenda
 */
const ShareModal = ({ visible, onClose, onShare }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('view');

  const handleShare = () => {
    onShare(email, permission);
    setEmail('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.white }]}>
          <Text style={[styles.modalTitle, { color: theme.primary }]}>
            Compartilhar Agenda
          </Text>

          <Text style={[styles.label, { color: theme.text }]}>
            E-mail do Profissional
          </Text>
          <TextInput
            style={[styles.input, { borderColor: theme.mediumGray }]}
            value={email}
            onChangeText={setEmail}
            placeholder="exemplo@email.com"
            keyboardType="email-address"
          />

          <Text style={[styles.label, { color: theme.text }]}>
            Permissão
          </Text>
          <View style={styles.permissionContainer}>
            <TouchableOpacity
              style={[
                styles.permissionButton,
                permission === 'view' && {
                  backgroundColor: theme.primary,
                },
              ]}
              onPress={() => setPermission('view')}
            >
              <Text
                style={[
                  styles.permissionText,
                  permission === 'view' && { color: theme.white },
                ]}
              >
                Visualização
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.permissionButton,
                permission === 'edit' && {
                  backgroundColor: theme.primary,
                },
              ]}
              onPress={() => setPermission('edit')}
            >
              <Text
                style={[
                  styles.permissionText,
                  permission === 'edit' && { color: theme.white },
                ]}
              >
                Edição
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { borderColor: theme.primary }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: theme.primary }]}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleShare}
            >
              <Text style={[styles.buttonText, { color: theme.white }]}>
                Compartilhar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    margin: 20,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  permissionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  permissionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShareModal;