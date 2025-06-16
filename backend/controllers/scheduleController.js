// const { Schedule, Professional } = require('../models');
const { Schedule } = require('../models/Schedule');
const { Professional } = require('../models/Professional');

exports.createSchedule = async (req, res) => {
  try {
    const { professionalId, dayOfWeek, startTime, endTime, isAvailable } = req.body;
    
    const schedule = await Schedule.create({
      professionalId,
      dayOfWeek,
      startTime,
      endTime,
      isAvailable
    });

    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfessionalSchedules = async (req, res) => {
  try {
    const { professionalId } = req.params;
    const schedules = await Schedule.findAll({
      where: { professionalId },
      order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']]
    });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findByPk(id);
    
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    const updatedSchedule = await schedule.update(req.body);
    res.json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findByPk(id);
    
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    await schedule.destroy();
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};