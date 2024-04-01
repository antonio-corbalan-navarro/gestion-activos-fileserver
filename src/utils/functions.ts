import { Pool } from "pg";
import { Response, NextFunction } from "express";
import crypto from 'crypto'

export const dropDuplicates = (array: Array<string>): Array<string> => {
    return array
        .filter((val, index) => array.indexOf(val) === index)
        .filter(i => i !== null && i !== "")
}

// TODO: Hacer esto con SQL, melon ...
export async function isAllowedStation(res: Response, pool: Pool, next: NextFunction, stationId: string): Promise<Boolean> {
    try {
        let isAllowed: any = await pool.query('SELECT allowed_users FROM stations WHERE station_id = $1',
            [stationId])

        isAllowed = isAllowed.rows[0].allowed_users.filter((i: string) => i === res.locals.user.rows[0].user_id)

        if (isAllowed.length < 1) {
            res.status(404).json({ error: 'user not allowed' })
        }
    } catch (error) {
        next(error)
    }

    return true
}

export const createRecoveryToken = () => {
    let token =
        crypto.randomBytes(20).toString('hex') +
        crypto.randomUUID().toString() +
        crypto.randomBytes(20).toString('hex')

    return token
}