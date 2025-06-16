// const { SharedCalendar, Professional } = require('../models');
const { SharedCalendar } = require('../models/SharedCalendar');
const { Professional } = require('../models/Professional');

exports.shareCalendar = async (req, res) => {
  try {
    const { ownerId, sharedWithId, permissionLevel } = req.body;
    
    // Check if both professionals exist
    const owner = await Professional.findByPk(ownerId);
    const sharedWith = await Professional.findByPk(sharedWithId);
    
    if (!owner || !sharedWith) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    // Check if sharing already exists
    const existingShare = await SharedCalendar.findOne({
      where: { ownerId, sharedWithId }
    });
    
    if (existingShare) {
      return res.status(400).json({ error: 'Calendar already shared with this professional' });
    }

    const sharedCalendar = await SharedCalendar.create({
      ownerId,
      sharedWithId,
      permissionLevel
    });

    res.status(201).json(sharedCalendar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSharedCalendars = async (req, res) => {
  try {
    const { professionalId } = req.params;
    
    // Get calendars shared with me
    const sharedWithMe = await SharedCalendar.findAll({
      where: { sharedWithId: professionalId },
      include: [{ model: Professional, as: 'owner' }]
    });
    
    // Get calendars I've shared
    const sharedByMe = await SharedCalendar.findAll({
      where: { ownerId: professionalId },
      include: [{ model: Professional, as: 'sharedWith' }]
    });

    res.json({ sharedWithMe, sharedByMe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.revokeShare = async (req, res) => {
  try {
    const { id } = req.params;
    const sharedCalendar = await SharedCalendar.findByPk(id);
    
    if (!sharedCalendar) {
      return res.status(404).json({ error: 'Shared calendar not found' });
    }

    await sharedCalendar.destroy();
    res.json({ message: 'Calendar sharing revoked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};