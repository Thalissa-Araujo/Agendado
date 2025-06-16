require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const routes = require('./routes');
const { setupWhatsApp } = require('./services/whatsappService');
const { setupNotifications } = require('./services/notificationService');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api', routes);

// Setup services
setupWhatsApp();
setupNotifications();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});