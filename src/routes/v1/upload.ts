import { Router } from 'express';
import { uploadDocsConfig, uploadImageConfig } from '../../config/multer';
import { uploadImage, uploadDoc, putAttachments } from '../../controllers/v1/upload.controller';

const routerV1 = Router()

routerV1
    .post('/images', uploadImageConfig.single('image'), uploadImage)
    .post('/docs', uploadDocsConfig.single('document'), uploadDoc)
    .put('/:table/:tableId', putAttachments)

export { routerV1 } 