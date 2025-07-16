const Service = require('../models/Service');
const Professional = require('../models/Professional');

exports.createService = async (req, res) => {
  try {

    const professionalId = req.professional.id;

    const { name, duration, price, description } = req.body;
    
    const service = await Service.create({
      professionalId,
      name,
      duration,
      price,
      description
    });

    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error)
    res.status(500).json({ error: error.message });
  }
};

exports.getProfessionalServices = async (req, res) => {
  try {
    const { professionalId } = req.params;
    const services = await Service.findAll({
      where: { professionalId },
      order: [['name', 'ASC']]
    });
    res.json(services);
  } catch (error) {
    console.error('Error getting professional services by param:', error)
    res.status(500).json({ error: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const updatedService = await service.update(req.body);
    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    await service.destroy();
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  exports.getProfessionalServicesForAuthUser = async (req, res) => {
  try {
    const professionalId = req.professional.id;
    const services = await Service.findAll({
      where: { professionalId },
      order: [['name', 'ASC']]
    });
    res.json(services);
  } catch (error) {
    console.error('Error getting authenticated professional services:', error);
    res.status(500).json({ error: error.message });
  }
  };