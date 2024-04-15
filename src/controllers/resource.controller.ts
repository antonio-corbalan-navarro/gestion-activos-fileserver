import { NextFunction, Request, Response } from "express";
import { ResourceRepository } from "../repositories/ResourceRepository";

const resourceRepository = new ResourceRepository()

export const shareable = (req: Request, res: Response, next: NextFunction) => {
    resourceRepository.shareable(req, res, next)
}

export const getResource = (req: Request, res: Response, next: NextFunction) => {
    resourceRepository.getResource(req, res, next)
}

export const deleteResource = (req: Request, res: Response, next: NextFunction) => {
    resourceRepository.deleteResource(req, res, next)
}