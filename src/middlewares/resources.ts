import pool from '../config/pool'
import { Request, Response, NextFunction } from 'express'

export const isAllowedResource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const CASE_1 = ['station', 'instrument', 'report', 'ticket', 'service', 'event']
  
      const tableName = `${req.url.split('/')[2]}`
      const tableId = `${req.url.split('/')[1]}_id`
      const sourceType = `${req.url.split('/')[1]}s`
      const sourceTypeId = `${req.url.split('/')[1]}`

      const resourceId = req.url
                            .split('-')
                            .toString()
                            .split('/')
                            .at(-1)
                            ?.toString()
                            .replaceAll(',', '-')

      const myUserId = res.locals.user.rows[0].user_id

    //   res.json({
    //     tableName,
    //     tableId,
    //     sourceType,
    //     sourceTypeId,
    //     resourceId,
    //     myUserId
    //   })
      // Capturo el id del documento que esta pidiendo y si es compartible:
    //   res.send(`SELECT ${tableId}, shareable FROM ${tableName}_${sourceType} WHERE ${tableName}_id = '${resourceId}'`)
      const resourceIdRequest = await pool.query(`
      SELECT ${tableId}, shareable FROM ${tableName}_${sourceType} WHERE ${tableName}_id = '${resourceId}'`)
  
      if(resourceIdRequest.rowCount === 0) {
        res.status(404).json({error: `No ${sourceTypeId} found 1`})
        return
      }
      
    //   const resourceId = resourceIdRequest?.rows[0][`${tableId}`]
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
          SELECT station_id FROM ${tableName}s WHERE ${tableName}_id = '${resourceId}'::uuid`)
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
          res.status(404).json({error: `No ${sourceTypeId} found 2`})
          return
        }
  
        // Una vez que tengo el ticket, recupero el id de la estacion a la que esta asociado el ticket:
        const stationIdRequest = await pool.query('SELECT station_id FROM tickets WHERE ticket_id = $1;',
          [ticketIdRequest.rows[0].ticket_id]
        )
        
        if(stationIdRequest.rowCount === 0) {
            res.status(404).json({error: `No ${sourceTypeId} found 3`})
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
