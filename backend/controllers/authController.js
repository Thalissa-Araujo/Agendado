const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Professional } = require('../models/Professional');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, whatsappNumber } = req.body;
    
    const existingProfessional = await Professional.findOne({ where: { email } });
    if (existingProfessional) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const professional = await Professional.create({
      name,
      email,
      password: hashedPassword,
      phone,
      whatsappNumber
    });

    const token = jwt.sign(
      { id: professional.id, email: professional.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ professional, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const professional = await Professional.findOne({ where: { email } });
    
    if (!professional) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, professional.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: professional.id, email: professional.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ professional, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDeviceToken = async (req, res) => {
  try {
    const { professionalId } = req.params;
    const { deviceToken } = req.body;
    
    const professional = await Professional.findByPk(professionalId);
    if (!professional) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    professional.deviceToken = deviceToken;
    await professional.save();

    res.json(professional);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};