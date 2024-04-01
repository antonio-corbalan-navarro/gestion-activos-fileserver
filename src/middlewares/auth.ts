import jwt from 'jsonwebtoken'
import pool from '../config/pool'
import { Request, Response, NextFunction } from 'express'
import { ACCESS_TOKEN_SECRET } from '../config/server'

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies?.jwt
  if (token) {
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err: any) => {
      if (err) {
        res.status(404).json({ error: 'unauthorized user.' })
      } else {
        next()
      }
    })
  } else {
    res.status(404).json({ error: 'unauthorized user' })
  }
}

export const checkUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies?.jwt
  if (token) {
    jwt.verify(
      token,
      ACCESS_TOKEN_SECRET,
      async (err: any, decodedToken: any) => {
        if (err) {
          res.locals.user = null
          next()
        } else {
          const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [
            decodedToken.id
          ])
          res.locals.user = user
          next()
        }
      }
    )
  } else {
    res.locals.user = null
    next()
  }
}
