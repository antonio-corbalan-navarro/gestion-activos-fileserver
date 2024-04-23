import { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import pool from "../config/pool";
import sharp from "sharp";
import path from "node:path";
import crypto from 'crypto';

type UploadFile = {
    fieldname: String,
    originalname: String,
    encoding:  String,
    mimetype:  String,
    destination: String,
    filename:  String,
    path:  String,
    size: Number,
    buffer: Array<Number>
}

export class UploadRepository {
    private pool: Pool = pool;
    private CURRENT_DIR = path.dirname(__filename);

    public async uploadImage(req: any, res: Response, next: NextFunction): Promise<void> {
        try {
            const images: any = req.files;
        const tableDirId = req.params.tableDirId;
        const tableDir = req.url.split('/')[2];

        if (images.length < 1) {
            res.status(404).json({ error: 'No images uploaded' });
            return;
        }

        for await (const i of images) {
            try {
                console.log({ trying: `Subiendo imagen: ${i.originalname}` });
                const imageId = crypto.randomUUID();
                const folderDir = path.join(this.CURRENT_DIR, '..', 'uploads', 'images', tableDir, `${i.originalname}-${imageId}.webp`);

                const resourceExists = await this.pool.query(`
                    SELECT ${tableDir}_id FROM ${tableDir}s WHERE ${tableDir}_id = '${tableDirId}'::uuid;
                `);

                if (resourceExists.rowCount === 0) {
                    res.status(200).json({ error: `${tableDir}_id ${tableDirId} not found` });
                    return;
                }
                const result = await this.pool.query(`
                    INSERT INTO 
                        ${tableDir}_images(
                            image_id,
                            field_name, 
                            original_name,
                            encoding, 
                            mimetype, 
                            filename, 
                            path,
                            size,
                            ${tableDir}_id,
                            created_by,
                            shareable
                        )
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                    RETURNING image_id, original_name, filename
                `,
                    [
                        imageId,
                        i.fieldname,
                        i.originalname,
                        i.encoding,
                        i.mimetype,
                        `${i.originalname}-${imageId}.webp`,
                        folderDir,
                        i.size,
                        tableDirId,
                        res.locals.user.rows[0].user_id,
                        false
                    ]
                );

                if (result.rowCount === 0) {
                    res.status(404).json({ error: 'Something went wrong' });
                    return;
                }

                sharp(i.buffer)
                    .resize(500)
                    .webp()
                    .toFile(folderDir);

                console.log({ success: `Imagen su vida ${(i.originalname)}` });
            } catch (error) {
                console.log({ errorBackend: error });
                next(error);
            }
        }
        res.status(200).json({ success: 'Su vida de imagenes terminada' });
        return;
        } catch (error) {
            next(error)
        }
    }

    public async uploadDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const documents: any = req.files;
            const tableDirId = req.params.tableDirId;
            const tableDir = req.url.split('/')[2];
    
            if (!documents) {
                res.status(404).json({ error: 'No documents uploaded' });
                return;
            }
    
            for await (const i of documents) {
                try {
                    console.log({ trying: `Subiendo documento: ${i.originalname}` });
                    const urlSplit = i.filename.split('-');
                    const documentId = `${urlSplit.at(-5)}-${urlSplit.at(-4)}-${urlSplit.at(-3)}-${urlSplit.at(-2)}-${urlSplit.at(-1)?.split('.')[0]}`;
    
                    const resourceExists = await this.pool.query(`
                        SELECT ${tableDir}_id FROM ${tableDir}s WHERE ${tableDir}_id = '${tableDirId}'::uuid;
                    `);
    
                    if (resourceExists.rowCount === 0) {
                        res.status(200).json({ error: `${tableDir}_id ${tableDirId} not found` });
                        return;
                    }
    
                    const result = await this.pool.query(`
                        INSERT INTO 
                            ${tableDir}_documents(
                                document_id,
                                field_name, 
                                original_name,
                                encoding, 
                                mimetype, 
                                filename, 
                                path,
                                size,
                                ${tableDir}_id,
                                created_by,
                                shareable
                            )
                        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                        RETURNING document_id, original_name, filename
                    `,
                        [
                            documentId,
                            i.fieldname,
                            i.originalname,
                            i.encoding,
                            i.mimetype,
                            i.filename,
                            i.path,
                            i.size,
                            tableDirId,
                            res.locals.user.rows[0].user_id,
                            false
                        ]
                    );
    
                    if (result.rowCount === 0) {
                        res.status(404).json({ error: 'Something went wrong' });
                        return;
                    }
    
                    console.log({ success: `Documento su vido ${(i.originalname)}` });
                } catch (error) {
                    return next(error);
                }
            }
            res.status(200).json({ success: 'Su vida de documentos terminada' });
            return;
        } catch (error) {
            next(error)
        }
    }
}
