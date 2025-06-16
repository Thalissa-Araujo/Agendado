const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { Appointment, Professional, Service, Schedule } = require('../models');
const { sendNotification } = require('./notificationService');
const moment = require('moment');
require('moment/locale/pt-br');

moment.locale('pt-br');

let whatsappClient;
const sessions = {};

// Helper function to get available dates
const getAvailableDates = async (professionalId) => {
  const schedules = await Schedule.findAll({ 
    where: { professionalId, isAvailable: true },
    order: [['dayOfWeek', 'ASC']]
  });

  const availableDates = [];
  const today = moment().startOf('day');
  
  // Get next 14 days
  for (let i = 0; i < 14; i++) {
    const date = today.clone().add(i, 'days');
    const dayOfWeek = date.format('dddd').toLowerCase();
    
    const daySchedule = schedules.find(s => s.dayOfWeek === dayOfWeek);
    if (daySchedule) {
      availableDates.push(date.format('YYYY-MM-DD'));
    }
  }

  return availableDates;
};

// Helper function to get available times for a date
const getAvailableTimes = async (professionalId, serviceId, date) => {
  const service = await Service.findByPk(serviceId);
  if (!service) return [];

  const dayOfWeek = moment(date).format('dddd').toLowerCase();
  const schedule = await Schedule.findOne({ 
    where: { 
      professionalId, 
      dayOfWeek,
      isAvailable: true 
    }
  });

  if (!schedule) return [];

  const appointments = await Appointment.findAll({
    where: {
      professionalId,
      date,
      status: 'scheduled'
    }
  });

  const serviceDuration = service.duration;
  const startTime = moment(schedule.startTime, 'HH:mm:ss');
  const endTime = moment(schedule.endTime, 'HH:mm:ss');
  
  const availableTimes = [];
  let currentTime = startTime.clone();

  while (currentTime.add(serviceDuration, 'minutes').isBefore(endTime)) {
    const timeStr = currentTime.format('HH:mm');
    
    // Check if this time slot is available
    const isBooked = appointments.some(app => {
      const appTime = moment(app.time, 'HH:mm:ss').format('HH:mm');
      return appTime === timeStr;
    });

    if (!isBooked) {
      availableTimes.push(timeStr);
    }
  }

  return availableTimes;
};

const setupWhatsApp = () => {
  whatsappClient = new Client({
    authStrategy: new LocalAuth({ clientId: "agendado-bot" }),
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });

  whatsappClient.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
  });

  whatsappClient.on('ready', () => {
    console.log('WhatsApp client is ready!');
  });

  whatsappClient.on('message', async (message) => {
    try {
      const from = message.from;
      const body = message.body.toLowerCase();
      
      if (!sessions[from]) {
        sessions[from] = {
          step: 'welcome',
          data: {}
        };
        await sendWelcomeMessage(from);
        return;
      }

      switch (sessions[from].step) {
        case 'welcome':
          await handleWelcomeResponse(from, body);
          break;
        case 'service_interest':
          await handleServiceInterest(from, body);
          break;
        case 'service_selection':
          await handleServiceSelection(from, body);
          break;
        case 'date_selection':
          await handleDateSelection(from, body);
          break;
        case 'time_selection':
          await handleTimeSelection(from, body);
          break;
        case 'client_name':
          await handleClientName(from, body);
          break;
        case 'client_phone':
          await handleClientPhone(from, body);
          break;
        default:
          await whatsappClient.sendMessage(from, 'Desculpe, ocorreu um erro. Por favor, comece novamente.');
          delete sessions[from];
      }
    } catch (error) {
      console.error('Error handling WhatsApp message:', error);
      await whatsappClient.sendMessage(message.from, 'Ocorreu um erro. Por favor, tente novamente mais tarde.');
      delete sessions[message.from];
    }
  });

  whatsappClient.initialize();
};

const sendWelcomeMessage = async (to) => {
  const message = `Olá! Agradecemos o seu contato. Para agilizarmos o atendimento, selecione uma das opções abaixo:
  
(1) Quero saber mais informações sobre os serviços que ofertamos.
(2) Desejo agendar um horário.`;
  
  await whatsappClient.sendMessage(to, message);
  sessions[to].step = 'welcome';
};

const handleWelcomeResponse = async (from, response) => {
  if (response === '1' || response.includes('informaç')) {
    const professional = await Professional.findOne({ where: { whatsappNumber: from.replace('@c.us', '') } });
    if (!professional) {
      await whatsappClient.sendMessage(from, 'Profissional não encontrado.');
      delete sessions[from];
      return;
    }

    const services = await Service.findAll({ where: { professionalId: professional.id } });
    let servicesMessage = 'Serviços que ofertamos:\n\n';
    services.forEach(service => {
      servicesMessage += `- ${service.name} (${service.duration} min) - R$ ${service.price || 'Consulte'}\n`;
    });

    servicesMessage += '\nVocê se interessou por algum de nossos serviços? Responda sim ou não, por favor.';
    await whatsappClient.sendMessage(from, servicesMessage);
    sessions[from].step = 'service_interest';
  } else if (response === '2' || response.includes('agendar')) {
    await sendServiceOptions(from);
  } else {
    await whatsappClient.sendMessage(from, 'Opção inválida. Por favor, responda com 1 ou 2.');
  }
};

const handleServiceInterest = async (from, response) => {
  if (response === 'sim' || response === 's') {
    await sendServiceOptions(from);
  } else if (response === 'não' || response === 'nao' || response === 'n') {
    await whatsappClient.sendMessage(from, 'Obrigado pelo contato. Caso mude de ideia, estamos à disposição!');
    delete sessions[from];
  } else {
    await whatsappClient.sendMessage(from, 'Por favor, responda com "sim" ou "não".');
  }
};

const sendServiceOptions = async (to) => {
  const professional = await Professional.findOne({ where: { whatsappNumber: to.replace('@c.us', '') } });
  if (!professional) {
    await whatsappClient.sendMessage(to, 'Profissional não encontrado.');
    delete sessions[to];
    return;
  }

  const services = await Service.findAll({ where: { professionalId: professional.id } });
  let message = 'Escolha o serviço que deseja agendar:\n\n';
  services.forEach((service, index) => {
    message += `(${index + 1}) ${service.name} (${service.duration} min) - R$ ${service.price || 'Consulte'}\n`;
  });

  await whatsappClient.sendMessage(to, message);
  sessions[to] = {
    step: 'service_selection',
    data: {
      professionalId: professional.id,
      services: services.map(s => s.get({ plain: true }))
    }
  };
};

const handleServiceSelection = async (from, response) => {
  const session = sessions[from];
  const selectedOption = parseInt(response);
  
  if (isNaN(selectedOption)) {
    await whatsappClient.sendMessage(from, 'Por favor, digite o número correspondente ao serviço desejado.');
    return;
  }

  if (selectedOption < 1 || selectedOption > session.data.services.length) {
    await whatsappClient.sendMessage(from, 'Opção inválida. Por favor, escolha um número da lista.');
    return;
  }

  const selectedService = session.data.services[selectedOption - 1];
  session.data.serviceId = selectedService.id;
  session.data.serviceName = selectedService.name;
  session.data.serviceDuration = selectedService.duration;

  const availableDates = await getAvailableDates(session.data.professionalId);
  if (availableDates.length === 0) {
    await whatsappClient.sendMessage(from, 'Não há datas disponíveis para agendamento no momento.');
    delete sessions[from];
    return;
  }

  let message = 'Selecione a data que deseja:\n\n';
  availableDates.slice(0, 5).forEach((date, index) => {
    const formattedDate = moment(date).format('dddd, DD/MM/YYYY');
    message += `(${index + 1}) ${formattedDate}\n`;
  });

  await whatsappClient.sendMessage(from, message);
  session.step = 'date_selection';
  session.data.availableDates = availableDates.slice(0, 5);
};

const handleDateSelection = async (from, response) => {
  const session = sessions[from];
  const selectedOption = parseInt(response);
  
  if (isNaN(selectedOption)) {
    await whatsappClient.sendMessage(from, 'Por favor, digite o número correspondente à data desejada.');
    return;
  }

  if (selectedOption < 1 || selectedOption > session.data.availableDates.length) {
    await whatsappClient.sendMessage(from, 'Opção inválida. Por favor, escolha um número da lista.');
    return;
  }

  const selectedDate = session.data.availableDates[selectedOption - 1];
  session.data.date = selectedDate;

  const availableTimes = await getAvailableTimes(
    session.data.professionalId,
    session.data.serviceId,
    selectedDate
  );

  if (availableTimes.length === 0) {
    await whatsappClient.sendMessage(from, 'Não há horários disponíveis para esta data. Por favor, escolha outra data.');
    session.step = 'date_selection';
    return;
  }

  let message = 'Selecione o horário desejado:\n\n';
  availableTimes.forEach((time, index) => {
    message += `(${index + 1}) ${time}\n`;
  });

  await whatsappClient.sendMessage(from, message);
  session.step = 'time_selection';
  session.data.availableTimes = availableTimes;
};

const handleTimeSelection = async (from, response) => {
  const session = sessions[from];
  const selectedOption = parseInt(response);
  
  if (isNaN(selectedOption)) {
    await whatsappClient.sendMessage(from, 'Por favor, digite o número correspondente ao horário desejado.');
    return;
  }

  if (selectedOption < 1 || selectedOption > session.data.availableTimes.length) {
    await whatsappClient.sendMessage(from, 'Opção inválida. Por favor, escolha um número da lista.');
    return;
  }

  const selectedTime = session.data.availableTimes[selectedOption - 1];
  session.data.time = selectedTime;

  await whatsappClient.sendMessage(from, 'Por favor, informe seu nome:');
  session.step = 'client_name';
};

const handleClientName = async (from, response) => {
  sessions[from].data.clientName = response;
  await whatsappClient.sendMessage(from, 'Agora, por favor, informe seu telefone (com DDD):');
  sessions[from].step = 'client_phone';
};

const handleClientPhone = async (from, response) => {
  const session = sessions[from];
  const phone = response.replace(/\D/g, ''); // Remove non-digit characters
  
  if (phone.length < 10 || phone.length > 11) {
    await whatsappClient.sendMessage(from, 'Telefone inválido. Por favor, informe um número com DDD (ex: 11987654321).');
    return;
  }

  session.data.clientPhone = phone;

  try {
    // Create the appointment
    const appointment = await Appointment.create({
      professionalId: session.data.professionalId,
      serviceId: session.data.serviceId,
      clientName: session.data.clientName,
      clientPhone: session.data.clientPhone,
      date: session.data.date,
      time: session.data.time,
      status: 'scheduled'
    });

    // Send confirmation to client
    const formattedDate = moment(session.data.date).format('dddd, DD/MM/YYYY');
    const confirmationMessage = `✅ Agendamento confirmado!\n\nServiço: ${session.data.serviceName}\nData: ${formattedDate}\nHorário: ${session.data.time}\n\nObrigado por agendar conosco!`;
    await whatsappClient.sendMessage(from, confirmationMessage);

    // Send notification to professional
    const professional = await Professional.findByPk(session.data.professionalId);
    if (professional && professional.deviceToken) {
      await sendNotification({
        to: professional.deviceToken,
        title: 'Novo agendamento',
        body: `${session.data.clientName} agendou ${session.data.serviceName} para ${formattedDate} às ${session.data.time}`
      });
    }

    delete sessions[from];
  } catch (error) {
    console.error('Error creating appointment:', error);
    await whatsappClient.sendMessage(from, 'Ocorreu um erro ao registrar seu agendamento. Por favor, tente novamente mais tarde.');
    delete sessions[from];
  }
};

module.exports = { setupWhatsApp };