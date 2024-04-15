import { Request } from "express";
import multer from 'multer';
import { extname, join } from "node:path";
import path from "node:path"
import crypto from 'crypto'

const IMAGE_MIMETYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"]

const DOCS_MIMETYPES = [
    "application/pdf",
    "application/xlsx",
    "application/excel",
    "applocation/xml",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

const CURRENT_DIR = path.dirname(__filename)

export const uploadImageConfig = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req: Request, file: any, cb: Function) => {
        if (IMAGE_MIMETYPES.includes(file.mimetype)) {
            cb(null, true)
        } 
        else {
            cb(new Error(`Only ${IMAGE_MIMETYPES.join(' ')} mimetypes are valid`))
        } 
    },
    limits: {
        fieldSize: 2000000
    }
})

export const uploadDocsConfig = (folder: string) => multer({
    storage: multer.diskStorage({
        destination: join(CURRENT_DIR, path.join('..', 'uploads', 'documents', `${folder}`)),
        filename: (req, file, cb) => {
            const fileExtension = extname(file.originalname);
            cb(null, `${file.originalname}-${crypto.randomUUID()}${fileExtension}`)
        }
    }),
    fileFilter: (req: Request, file: any, cb: Function) => {
        if (DOCS_MIMETYPES.includes(file.mimetype)) {
            cb(null, true)
        } 
        else {
            cb(new Error(`Only ${DOCS_MIMETYPES.join(' ')} mimetypes are valid`))
        } 
    },
    limits: {
        fieldSize: 2000000
    }
})

// export const uploadImageConfig = multer({
//     storage: multer.memoryStorage(),
//     fileFilter: (req: Request, file: any, cb: Function) => {
//         if (IMAGE_MIMETYPES.includes(file.mimetype)) cb(null, true)
//         else cb(new Error(`Only ${IMAGE_MIMETYPES.join(' ')} mimetypes are valid`))
//     },
//     limits: {
//         fieldSize: 300000000
//     }
// })