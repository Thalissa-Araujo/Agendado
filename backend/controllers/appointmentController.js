//const { Appointment, Professional, Service } = require('../models');
const Professional = require('../models/Professional');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const sendNotification = require('../services/notificationService');

exports.createAppointment = async (req, res) => {
  try {
    const { professionalId, serviceId, clientName, clientPhone, date, time } = req.body;
    
    const appointment = await Appointment.create({
      professionalId,
      serviceId,
      clientName,
      clientPhone,
      date,
      time,
      status: 'scheduled'
    });

    const professional = await Professional.findByPk(professionalId);
    //await sendNotification({
    //  to: professional.deviceToken,
    //  title: 'Novo agendamento',
    //  body: `${clientName} agendou um serviço para ${date} às ${time}`
    //});

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfessionalAppointments = async (req, res) => {
  try {
    const { professionalId } = req.params;
    const appointments = await Appointment.findAll({
      where: { professionalId },
      include: [Service],
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};