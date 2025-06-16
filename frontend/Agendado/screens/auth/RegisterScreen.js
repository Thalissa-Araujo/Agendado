import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { useTheme } from '../../Theme/ThemeProvider';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

/**
 * Tela de registro de novos profissionais
 */
const RegisterScreen = ({ navigation }) => {
  const theme = useTheme();
  const { login } = useAuth();
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    whatsappNumber: '',
    businessName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Validação básica
      if (!form.email.includes('@') || form.password.length < 6) {
        throw new Error('Dados inválidos');
      }

      // Chamada à API
      const response = await api.post('/auth/register', form);
      
      // Login automático após registro
      await login(form.email, form.password);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.form}>
        <Text style={[styles.title, { color: theme.primary }]}>Criar Conta</Text>
        
        {error ? (
          <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
        ) : null}

        <TextInput
          style={[styles.input, { borderColor: theme.mediumGray }]}
          placeholder="Nome Completo"
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
        />

        <TextInput
          style={[styles.input, { borderColor: theme.mediumGray }]}
          placeholder="Email"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={[styles.input, { borderColor: theme.mediumGray }]}
          placeholder="Senha (mínimo 6 caracteres)"
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
          secureTextEntry
        />

        <TextInput
          style={[styles.input, { borderColor: theme.mediumGray }]}
          placeholder="Telefone"
          value={form.phone}
          onChangeText={(text) => setForm({ ...form, phone: text })}
          keyboardType="phone-pad"
        />

        <TextInput
          style={[styles.input, { borderColor: theme.mediumGray }]}
          placeholder="WhatsApp (com DDD)"
          value={form.whatsappNumber}
          onChangeText={(text) => setForm({ ...form, whatsappNumber: text })}
          keyboardType="phone-pad"
        />

        <TextInput
          style={[styles.input, { borderColor: theme.mediumGray }]}
          placeholder="Nome do Estabelecimento (opcional)"
          value={form.businessName}
          onChangeText={(text) => setForm({ ...form, businessName: text })}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={[styles.link, { color: theme.primary }]}>
            Já tem conta? Faça login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  error: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 16,
  },
});

export default RegisterScreen;