import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Appointment from '../models/Appointment';
import user from '../models/Users';
import file from '../models/Files';
import UserController from './UserController';
// import UserController from './UserController';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 5,
      offset: (page - 1) * 5, // vai pegar a pagina e pular os registro das paginas anteriores
      include: [
        {
          model: user,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: file,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });
    // validando chegada de dados
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    // checando se quem chega é provedor de serviço.
    const isProvider = await user.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'User não foi encontrato ou não é um provider' });
    }

    /**
     * Checando se data é inderior a data atual e se já tem agendamento para mesma hora.
     */
    // parseISO tranforma em obj js e startOfHour zera min e seg da hora, isso e para
    // garantir que dentro de uma mesma hora só uma pessoa seja atendida.
    const hourStart = startOfHour(parseISO(date));

    // garantindo que a data não é um dia anterior a hj
    if (isBefore(hourStart, new Date())) {
      return res
        .status(401)
        .json({ error: 'Data escolhida invalidade, escolha outra' });
    }

    const checkDisponibilidade = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkDisponibilidade) {
      return res.status(400).json({ error: 'Horario não esta vago.' });
    }

    /**
     * Gravando no banco depois de todas as validações
     */
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    return res.json({ appointment });
  }
}

export default new AppointmentController();
