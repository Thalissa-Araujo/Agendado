// const { SharedCalendar, Professional } = require('../models');
const SharedCalendar = require('../models/SharedCalendar');
const Professional = require('../models/Professional');

exports.shareCalendar = async (req, res) => {
  try {
    const ownerId = req.professional.id;

    const { sharedWithEmail, permissionLevel } = req.body;

    console.log('Tentando compartilhar agenda...');
    console.log('ownerId (do token):', ownerId);
    console.log('sharedWithEmail (do body):', sharedWithEmail);
    
      if (!sharedWithEmail) { // Validar se o email foi enviado
      return res.status(400).json({ error: 'Shared professional email is required.' });
    }

    const sharedWith = await Professional.findOne({ where: { email: sharedWithEmail } });

    const owner = await Professional.findByPk(ownerId);

    console.log('Resultado da busca por owner:', owner ? owner.id : 'Não encontrado');
    console.log('Resultado da busca por sharedWith (pelo email):', sharedWith ? sharedWith.id : 'Não encontrado');

    if (!owner) {
      return res.status(404).json({ error: 'Owner professional (from token) not found in DB.' });
    }
    
    if (!sharedWith) {
      return res.status(404).json({ error: 'Professional to share with not found. Please check the email.' });
    }

    const sharedWithId = sharedWith.id;
    
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
    console.error('Error sharing calendar:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getSharedCalendars = async (req, res) => {
  try {
    const { professionalId } = req.params;
    
    const sharedWithMe = await SharedCalendar.findAll({
      where: { sharedWithId: professionalId },
      include: [{ model: Professional, as: 'owner' }]
    });
    
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