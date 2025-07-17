import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './Theme/ThemeProvider';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import NotificationService from './services/notificationService';
import { AuthProvider, useAuth } from './hooks/useAuth';

/**
 * Componente principal da aplicação
 */
const AppContent = () => {
  const { user, checkAuth } = useAuth();

  // Verifica autenticação ao iniciar
  useEffect(() => {
    checkAuth();
    NotificationService.setup();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

/**
 * Wrapper da aplicação com provedores de contexto
 */
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}