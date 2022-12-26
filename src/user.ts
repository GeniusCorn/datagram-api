import express from 'express'

import db from './db/datagram'

const user = express()

user.get('/', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM User')

  res.status(200).json({
    code: 0,
    rows
  })
})

user.post('/', async (req, res) => {
  const data = req.body

  res.status(201).json({
    code: 0
  })
})

export default user
