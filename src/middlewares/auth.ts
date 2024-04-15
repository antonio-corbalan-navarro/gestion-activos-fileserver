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
    res.status(404).json({ error: 'unauthorized user', ACCESS_TOKEN_SECRET, token, cookies : req.cookies  })
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
          return
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
    return
  }
}

export const isAllowedDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const CASE_1 = ['station', 'instrument', 'report', 'ticket', 'service', 'event']

    const tableName = `${req.url.split('/')[1]}`
    const tableId = `${req.url.split('/')[1]}_id`
    const urlSplit = req.url.split('-')

    const documentId = `${urlSplit.at(-5)}-${urlSplit.at(-4)}-${urlSplit.at(-3)}-${urlSplit.at(-2)}-${urlSplit.at(-1)?.split('.')[0]}`
    const myUserId = res.locals.user.rows[0].user_id

    // Capturo el id del documento que esta pidiendo y si es compartible:
    const resourceIdRequest = await pool.query(`
      SELECT ${tableId}, shareable FROM ${tableName}_documents WHERE document_id = '${documentId}'`)

    if(resourceIdRequest.rowCount === 0) {
      res.status(404).json({error: 'No document found'})
      return
    }
    
    const resourceId = resourceIdRequest?.rows[0][`${tableId}`]
    const resourceShareable = resourceIdRequest?.rows[0].shareable
  
    // Si es compartible devuelvo el recurso:
    if(resourceShareable){
      next()
      return
    }
      // Selecciono las estaciones permitidas por el usuario:
      const allowedStationsRequest = await pool.query(`
      SELECT 
        array_agg(station_id) 
      AS 
        allowedStations 
      FROM 
        maintenance_allowed_stations 
      WHERE 
        user_id = $1`,
    [myUserId])
    const allowedStations = allowedStationsRequest.rows[0].allowedstations
  
    if(CASE_1.includes(tableName)) {
      // Selecciono el elemento en la base de datos relacionado con ese documento 
      // y compruebo el campo station_id:
      const isAllowedResource = await pool.query(`
        SELECT station_id FROM ${tableName}s WHERE ${tableId} = '${resourceId}'::uuid`)
      const stationId = isAllowedResource.rows[0].station_id

      // Compruebo si el elemento tiene un station_id permitido para el usuario:
      if(allowedStations.includes(stationId)) {
        next()
      } else {
        res.status(404).json({error: 'Access denied'})
        // res.json({error: 'NO tienes acceso a este documento', tableName, tableId, stationId, documentId,allowedStations, resourceId, query: `SELECT ${tableId} FROM ${tableName}_documents WHERE ${tableId} = '${documentId}'`})
        return
      }
      return
    }

    if(tableName === 'response') {
      // Recupero el id del ticket al que esta asociada la respuesta:
      const ticketIdRequest = await pool.query('SELECT ticket_id FROM responses WHERE response_id = $1;', 
      [resourceId])

      if(ticketIdRequest.rowCount === 0) {
        res.status(404).json({error: 'No document found'})
        return
      }

      // Una vez que tengo el ticket, recupero el id de la estacion a la que esta asociado el ticket:
      const stationIdRequest = await pool.query('SELECT station_id FROM tickets WHERE ticket_id = $1;',
        [ticketIdRequest.rows[0].ticket_id]
      )
      
      if(stationIdRequest.rowCount === 0) {
        res.status(404).json({error: 'No document found'})
        return
      }

      // Compruebo que tengas acceso a esa estacion:
      const stationId = stationIdRequest.rows[0].station_id

      if(allowedStations.includes(stationId)) {
        next()
        return
      }
      res.status(404).json({error: 'Access denied'})
      return
    }
    res.end()
    return
  } catch (error) {
    next(error)
  }
}

export const isAllowedImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const CASE_1 = ['station', 'instrument', 'report', 'ticket', 'service', 'event']

    const tableName = `${req.url.split('/')[1]}`
    const tableId = `${req.url.split('/')[1]}_id`
    const urlSplit = req.url.split('-')

    const imageId = `${urlSplit.at(-5)}-${urlSplit.at(-4)}-${urlSplit.at(-3)}-${urlSplit.at(-2)}-${urlSplit.at(-1)?.split('.')[0]}`
    const myUserId = res.locals.user.rows[0].user_id

    // Capturo el id del documento que esta pidiendo y si es compartible:
    const resourceIdRequest = await pool.query(`
      SELECT ${tableId}, shareable FROM ${tableName}_images WHERE image_id = '${imageId}'`)

    if(resourceIdRequest.rowCount === 0) {
      res.status(404).json({error: 'No image found'})
      return
    }
    
    const resourceId = resourceIdRequest?.rows[0][`${tableId}`]
    const resourceShareable = resourceIdRequest?.rows[0].shareable
  
    // Si es compartible devuelvo el recurso:
    if(resourceShareable){
      next()
      return
    }
      // Selecciono las estaciones permitidas por el usuario:
      const allowedStationsRequest = await pool.query(`
      SELECT 
        array_agg(station_id) 
      AS 
        allowedStations 
      FROM 
        maintenance_allowed_stations 
      WHERE 
        user_id = $1`,
    [myUserId])
    const allowedStations = allowedStationsRequest.rows[0].allowedstations
  
    if(CASE_1.includes(tableName)) {
      // Selecciono el elemento en la base de datos relacionado con ese documento 
      // y compruebo el campo station_id:
      const isAllowedResource = await pool.query(`
        SELECT station_id FROM ${tableName}s WHERE ${tableId} = '${resourceId}'::uuid`)
      const stationId = isAllowedResource.rows[0].station_id

      // Compruebo si el elemento tiene un station_id permitido para el usuario:
      if(allowedStations.includes(stationId)) {
        next()
      } else {
        res.status(404).json({error: 'Access denied'})
        // res.json({error: 'NO tienes acceso a este documento', tableName, tableId, stationId, imageId,allowedStations, resourceId, query: `SELECT ${tableId} FROM ${tableName}_documents WHERE ${tableId} = '${imageId}'`})
        return
      }
      return
    }

    if(tableName === 'response') {
      // Recupero el id del ticket al que esta asociada la respuesta:
      const ticketIdRequest = await pool.query('SELECT ticket_id FROM responses WHERE response_id = $1;', 
      [resourceId])

      if(ticketIdRequest.rowCount === 0) {
        res.status(404).json({error: 'No document found'})
        return
      }

      // Una vez que tengo el ticket, recupero el id de la estacion a la que esta asociado el ticket:
      const stationIdRequest = await pool.query('SELECT station_id FROM tickets WHERE ticket_id = $1;',
        [ticketIdRequest.rows[0].ticket_id]
      )
      
      if(stationIdRequest.rowCount === 0) {
        res.status(404).json({error: 'No document found'})
        return
      }

      // Compruebo que tengas acceso a esa estacion:
      const stationId = stationIdRequest.rows[0].station_id

      if(allowedStations.includes(stationId)) {
        next()
        return
      }
      res.status(404).json({error: 'No tienes acceso a este documento.'})
      return
    }
    res.end()
    return
  } catch (error) {
    next(error)
  }
}
