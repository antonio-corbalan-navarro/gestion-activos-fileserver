import { NextFunction, Request, Response } from "express";
import { UploadRepository } from "../../repositories/upload.repository";

const uploadRepository = new UploadRepository()

export const uploadImage = (req: Request, res: Response, next: NextFunction) => {
    uploadRepository.uploadImage(req, res, next)
}

export const uploadDoc = (req: Request, res: Response, next: NextFunction) => {
    uploadRepository.uploadPDF(req, res, next)
}

export const putAttachments = async (req: Request, res: Response, next: NextFunction) => {
    uploadRepository.putAttachments(req, res, next)
}