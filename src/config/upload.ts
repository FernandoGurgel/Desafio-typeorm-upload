import path from 'path';
import crypto from 'crypto';
import Muter from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
const multer = Muter({
  storage: Muter.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
});

export default {
  tmpFolder,
  multer,
};
