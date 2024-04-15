import { Router } from 'express';
import { uploadDocsConfig, uploadImageConfig } from '../config/multer';
import { uploadImage, uploadDocument,  } from '../controllers/upload.controller';

const routerV1 = Router()

routerV1
    .post('/images/station/:tableDirId', uploadImageConfig.array('image', 10), uploadImage)
    .post('/images/instrument/:tableDirId', uploadImageConfig.array('image', 10), uploadImage)
    .post('/images/calibration/:tableDirId', uploadImageConfig.array('image', 10), uploadImage)
    .post('/images/report/:tableDirId', uploadImageConfig.array('image', 10), uploadImage)
    .post('/images/response/:tableDirId', uploadImageConfig.array('image', 10), uploadImage)
    .post('/images/ticket/:tableDirId', uploadImageConfig.array('image', 10), uploadImage)

    .post('/documents/station/:tableDirId', uploadDocsConfig('station').array('document', 10), uploadDocument)
    .post('/documents/instrument/:tableDirId', uploadDocsConfig('instrument').array('document', 10), uploadDocument)
    .post('/documents/calibration/:tableDirId', uploadDocsConfig('calibration').array('document', 10), uploadDocument)
    .post('/documents/report/:tableDirId', uploadDocsConfig('report').array('document', 10), uploadDocument)
    .post('/documents/response/:tableDirId', uploadDocsConfig('response').array('document', 10), uploadDocument)
    .post('/documents/ticket/:tableDirId', uploadDocsConfig('ticket').array('document', 10), uploadDocument)

export { routerV1 } 