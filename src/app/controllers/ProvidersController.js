import User from '../models/Users';
import File from '../models/Files';

class ProvidersController {
  async index(req, res) {
    const provider = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          // a url aqui foi criada como virtual no model de file
          attributes: ['name', 'path', 'url'],
          // só podemos ter acesso externo a url da imagem modificando o middleware usando express static
        },
      ],
    });

    return res.json(provider);
  }
}

export default new ProvidersController();
