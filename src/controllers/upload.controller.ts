import { NextFunction, Request, Response } from "express";
import { UploadRepository } from "../repositories/upload.repository";

const uploadRepository = new UploadRepository()

export const uploadImage = (req: Request, res: Response, next: NextFunction) => {
    uploadRepository.uploadImage(req, res, next)
}

export const uploadDocument = (req: Request, res: Response, next: NextFunction) => {
    uploadRepository.uploadDocument(req, res, next)
}
