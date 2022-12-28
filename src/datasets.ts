import express from 'express'
import db from './db/datagram'
import { authenticateAdmin, authenticateToken } from './utils/jwt'

const datasets = express()

// get dataset by id
datasets.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params

  const [rows] = await db.execute(`SELECT * FROM Dataset WHERE id='${id}'`)

  res.status(200).json({
    code: 0,
    data: rows
  })
})

// get all datasets
datasets.get('/', authenticateToken, async (req, res) => {
  const [rows] = await db.execute(`SELECT * FROM Dataset`)

  res.status(200).json({
    code: 0,
    data: rows
  })
})

// create a new dataset
datasets.post('/', authenticateToken, async (req, res) => {
  const data = JSON.stringify(req.body.data)
  const { account, datasetName } = req.body

  const [rows1] = await db.execute(
    `SELECT id FROM User WHERE account='${account}'`
  )

  const id = (rows1 as any[]).at(0).id

  const [rows2] = await db.execute(
    `INSERT INTO Dataset (id, name, data, owner) VALUES (DEFAULT, '${datasetName}', '${data}', '${id}')`
  )

  res.status(201).json({
    code: 0,
    message: '上传数据集成功',
    data: rows2
  })
})

export default datasets
