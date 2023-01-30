import express, { response } from 'express'
import { authenticateToken } from './utils/jwt'
import db from './db/datagram'

const records = express()

// get all records
records.get('/', authenticateToken, async (req, res) => {
  const [rows] = await db.execute(`SELECT * FROM Record`)

  return res.status(200).json({
    code: 0,
    data: rows
  })
})

export default records
