import Notification from '../schemas/Notification';
import User from '../models/Users';

class NotificationController {
  async index(req, res) {
    // só pode ser acessada por um prestador de serviço
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Apenas um provider pode ver seus notificacoes.' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true }, // campo e valor a ser atualizado
      { new: true } // para retornar o registro atualizado
    );
    return res.json(notification);
  }
}

export default new NotificationController();
