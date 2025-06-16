import React, { createContext, useContext } from 'react';
import colors from './Colors';

// Cria o contexto de tema
const ThemeContext = createContext();

/**
 * Provedor de tema que envolve a aplicação
 * Permite o uso do tema em qualquer componente
 */
export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={colors}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook personalizado para usar o tema
 * @returns {Object} Objeto com todas as cores definidas
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};