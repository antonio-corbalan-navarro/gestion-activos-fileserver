import { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import pool from "../config/pool";
import fs from 'fs';


export class ResourceRepository {
    private pool: Pool = pool;

    public async shareable(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const type = req.params.type;
            const table = req.params.table;
            const resourceId = req.params.resourceId;
            const { shareable } = req.body;

            const result = await this.pool.query(`
                UPDATE 
                    ${table}_${type}s
                SET 
                    shareable = $1
                WHERE
                    ${type}_id = $2::uuid
                RETURNING shareable;
            `, [shareable, resourceId]);

            if (result.rowCount === 0) {
                res.status(404).json({ error: 'Can\'t make this resource shareable.' });
                return;
            }

            if (result.rows[0].shareable == true) {
                res.status(200).json({ success: 'This file can now be shared.' });
            }
            else {
                res.status(200).json({ success: 'This file has been blocked for unauthorized users.' });
            }
            return
        } catch (error) {
            next(error);
        }
    }

    public async getResource(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const type = req.params.type;
            const table = req.params.table;
            const resourceId = req.params.resourceId;

            const result = await this.pool.query(`
                SELECT 
                    ${type}_id,
                    original_name,
                    filename,
                    size,
                    shareable,
                    created_at
                FROM
                    ${table}_${type}s
                WHERE
                    ${table}_id = $1::uuid`,
                [resourceId]);

            if (result.rowCount === 0) {
                res.status(404).json({ error: 'No files yet' });
                return;
            }

            res.status(200).json(result.rows);
            return;
        } catch (error) {
            next(error);
        }
    }

    public async deleteResource(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const type = req.params.type;
            const table = req.params.table;
            const resourceId = req.params.resourceId;

            const result = await this.pool.query(`
                DELETE FROM
                    ${table}_${type}s
                WHERE
                    ${type}_id = $1::uuid
                RETURNING path`,
                [resourceId]);

            if (result.rowCount === 0) {
                res.status(404).json({ error: 'No resoruce with this id' });
                return;
            }
            const filePath = result.rows[0].path;
            fs.unlinkSync(filePath);
            res.status(200).json({ success: 'Resource deleted' });
            return;
        } catch (error) {
            next(error);
        }
    }
}
