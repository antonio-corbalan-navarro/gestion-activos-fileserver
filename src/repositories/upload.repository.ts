import { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import pool from "../config/pool";
import { dropDuplicates } from "../utils/functions";
import sharp from "sharp";
import path from "node:path"
import crypto from 'crypto'

export class UploadRepository {
    private pool: Pool = pool
    private CURRENT_DIR = path.dirname(__filename)

    public async uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const imageId = crypto.randomUUID()
            const folderDir = path.join(this.CURRENT_DIR, '..', 'uploads', 'images', `${imageId}.webp`)

            sharp(req.file?.buffer)
                .resize(500)
                .webp()
                .toFile(folderDir)

            const data: any = req.file
            const result = await this.pool.query(
                'SELECT * FROM uploadImage($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                [
                    imageId,
                    data?.fieldname || null,
                    data?.originalname || null,
                    data?.encoding || null,
                    data?.mimetype || null,
                    imageId + '.webp',
                    folderDir,
                    data?.size || null,
                    res.locals.user.rows[0].user_id
                ]
            )

            res.status(200).json(result.rows[0])
            res.end()
        } catch (error) {
            next(error)
        }
    }

    public async uploadPDF(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: any = req.file

            const documentId = data.filename.split('.')[0]

            const result = await this.pool.query(
                'SELECT * FROM uploadDocument($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                [
                    documentId,
                    data?.fieldname || null,
                    data?.originalname || null,
                    data?.encoding || null,
                    data?.mimetype || null,
                    data?.filename || null,
                    data?.path || null,
                    data?.size || null,
                    res.locals.user.rows[0].user_id
                ]
            )
            res.status(200).json(result.rows[0])
        } catch (error) {
            next(error)
        }
    }

    public async putAttachments(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tableId = req.params.tableId
            const { images = [], documents = [] } = req.body

            const table = req.params.table
            const tableIdParsed = table.substring(0, table.length - 1) + '_id';

            const currentAttachments = await this.pool.query(
                `SELECT images, documents 
                FROM ${table} 
                WHERE ${tableIdParsed} = $1`,
                [tableId])

            let imagesArray: Array<string> = []
            let documentsArray: Array<string> = []

            imagesArray.push(...currentAttachments.rows[0].images)
            imagesArray.push(...images)
            imagesArray = dropDuplicates(imagesArray)

            documentsArray.push(...currentAttachments.rows[0].documents)
            documentsArray.push(...documents)
            documentsArray = dropDuplicates(documentsArray)

            const result = await this.pool.query(
                `UPDATE ${table} 
                 SET images = $1, documents = $2
                 WHERE ${tableIdParsed} = '${tableId}'::uuid
                 RETURNING *`,
                [imagesArray, documentsArray])

            res.status(200).json({
                success: {
                    images: result.rows[0].images,
                    documents: result.rows[0].documents
                }
            })
        } catch (error) {
            next(error)
        }
    }


}
