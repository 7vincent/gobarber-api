import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  // se existe token, vamos separa-lo do Bearer
  const [, token] = authHeader.split(' ');

  try {
    // vamos decodificar o token, e pegar o id que esta dentro dele.
    // vamos usar a lib promisify para manipular o jwt nessa decodificação.
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // inserir o idUser no req
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token Invalid' });
  }
};
