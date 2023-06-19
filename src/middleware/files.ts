import multer from 'multer';
import createDebug from 'debug';
import path from 'path';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
const debug = createDebug('W7CH5:FileMiddleware');

export class FileMiddleware {
  constructor() {
    debug('Instantiated');
  }

  singleFileStore(fileName = 'file', fileSize = 8_000_000) {
    const upload = multer({
      storage: multer.diskStorage({
        destination: 'uploads',
        filename(req, file, callback) {
          const suffix = crypto.randomUUID();
          const extension = path.extname(file.originalname);
          const basename = path.basename(file.originalname, extension);
          const filename = `${basename}-${suffix}${extension}`;
          debug('Called Multer');
          callback(null, filename);
        },
      }),
      limits: { fileSize },
    });
    const middleware = upload.single(fileName);
    return middleware;
  }

  saveImage = (req: Request, res: Response, next: NextFunction) => {
    try {
      debug('Called saveImage');
      if (!req.file) {
        throw new HttpError(406, 'Not Acceptable', 'Invalid image file');
      }

      const userImage = req.file.filename;
      const imagePath = path.join('uploads', userImage);
      req.body[req.file.fieldname] = {
        urlOriginal: req.file.originalname,
        url: imagePath,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
}
