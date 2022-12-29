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

// get datasets
datasets.get('/', authenticateToken, async (req, res) => {
  if (Object.hasOwn(req.query, 'account')) {
    const { account } = req.query
    const [rows] = await db.execute(
      `SELECT id FROM User WHERE account='${account}'`
    )

    const { id } = (rows as any[]).at(0)
    const [rows1] = await db.execute(
      `SELECT * FROM Dataset WHERE owner='${id}'`
    )

    res.status(200).json({
      code: 0,
      data: rows1
    })
  } else {
    const [rows] = await db.execute(`SELECT * FROM Dataset`)

    res.status(200).json({
      code: 0,
      data: rows
    })
  }
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

// update dataset name
datasets.patch('/', authenticateToken, async (req, res) => {
  const { id, name } = req.body

  const [rows] = await db.execute(
    `UPDATE Dataset SET name = '${name}' WHERE id='${id}'`
  )

  res.status(200).json({
    code: 0,
    message: '更新数据集名称成功',
    data: rows
  })
})

// delete dataset by id
datasets.delete('/:id', async (req, res) => {
  const { id } = req.params

  const [rows] = await db.execute(`DELETE FROM Dataset WHERE id='${id}'`)

  res.status(200).json({
    code: 0,
    message: '数据集删除成功',
    data: rows
  })
})

export default datasets
