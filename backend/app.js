require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { connectDB } = require('./config/database');
const routes = require('./routes');
const { setupWhatsApp } = require('./services/whatsappService');
const { setupNotifications } = require('./services/notificationService');

const app = express();

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const NGROK_URL = process.env.NGROK_URL;
const LOCAL_PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    services: {
      whatsapp: IS_PRODUCTION ? 'external (ngrok)' : 'local',
      database: 'connected'
    }
  });
});

// Database connection
connectDB();

// Routes
app.use('/api', routes);

// Inicialização condicional dos serviços
if (IS_PRODUCTION) {
  // Modo produção (Render + Ngrok)
  app.post('/whatsapp-webhook', async (req, res) => {
    try {
      const response = await axios.post(`${NGROK_URL}/whatsapp`, req.body);
      res.status(response.status).send(response.data);
    } catch (error) {
      console.error('Erro no webhook:', error);
      res.status(500).send('Webhook error');
    }
  });
  
  console.log('Modo produção: WhatsApp via Ngrok');
} else {
  setupWhatsApp();
  setupNotifications();
  console.log('Modo desenvolvimento: Serviços locais ativos');
}

// Rota raiz
app.get('/', (req, res) => {
  res.send(`
    <h1>Backend Agendado</h1>
    <p>Modo: ${IS_PRODUCTION ? 'Produção' : 'Desenvolvimento'}</p>
    <p>WhatsApp: ${IS_PRODUCTION ? `Via Ngrok (${NGROK_URL})` : 'Local'}</p>
    <a href="/health">Health Check</a>
  `);
});

app.listen(LOCAL_PORT, () => {
  console.log(`Servidor rodando na porta ${LOCAL_PORT}`);
  console.log(`Ambiente: ${IS_PRODUCTION ? 'Produção' : 'Desenvolvimento'}`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('Erro não tratado:', err);
});