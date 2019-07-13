import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }
    const { email, password } = req.body;

    // ver se email existe no banco
    const user = await User.findOne({ where: { email } });

    // se user não existir, não tem user cadastrado com o email digitado
    if (!user) {
      return res.status(401).json({ error: 'User not foun' });
    }
    // verificando se a senha esta batendo, se entrar aqui a senha nao bate
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresId,
      }),
    });
  }
}

export default new SessionController();
