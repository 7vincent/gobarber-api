import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'temp', 'uploads'),
    filename: (res, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);
        // por padaro prmeiro argumento do callback (cb)
        // é o erro, por isso colocamos null. E vamos renomear o arquivos para
        // uma string aleatória.
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
