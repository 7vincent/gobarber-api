import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import user from '../models/Users';
import appointment from '../models/Appointment';

class ScheduleController {
  async index(req, res) {
    // teste para saber se é provider
    const checkProvider = await user.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkProvider) {
      return res.status.json({ error: 'User não é um provider.' });
    }

    // pegando a data vindo no req.query
    const { date } = req.query;
    const parsedDate = parseISO(date);

    // selecionando apenas agendamento do dia atual
    const appointments = await appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });
    return res.json(appointments);
  }
}

export default new ScheduleController();
