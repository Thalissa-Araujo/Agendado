import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../Theme/ThemeProvider';

// Telas
import CalendarScreen from '../screens/CalendarScreen';
import ServicesScreen from '../screens/ServicesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AppointmentDetailScreen from '../screens/AppointmentDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Navegação em abas para as telas principais
 */
const MainTabs = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Agenda') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Serviços') {
            iconName = focused ? 'cut' : 'cut-outline';
          } else if (route.name === 'Config') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.mediumGray,
        tabBarStyle: {
          backgroundColor: theme.white,
          borderTopWidth: 0,
          elevation: 8,
        },
      })}
    >
      <Tab.Screen name="Agenda" component={CalendarScreen} />
      <Tab.Screen name="Serviços" component={ServicesScreen} />
      <Tab.Screen name="Config" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

/**
 * Navegação principal da aplicação
 */
const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen 
        name="AppointmentDetail" 
        component={AppointmentDetailScreen}
        options={{
          headerShown: true,
          title: 'Detalhes do Agendamento',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;