import express from 'express'
import db from './db/datagram'
import { authenticateToken } from './utils/jwt'

const dashboards = express()

// get dataset by id
dashboards.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params

  const [rows] = await db.execute(`SELECT * FROM Dashboard WHERE id='${id}'`)

  res.status(200).json({
    code: 0,
    data: rows
  })
})

// get datasets
dashboards.get('/', authenticateToken, async (req, res) => {
  if (Object.hasOwn(req.query, 'account')) {
    const { account } = req.query
    const [rows] = await db.execute(
      `SELECT id FROM User WHERE account='${account}'`
    )

    const { id } = (rows as any[]).at(0)
    const [rows1] = await db.execute(
      `SELECT * FROM Dashboard WHERE owner='${id}'`
    )

    res.status(200).json({
      code: 0,
      data: rows1
    })
  } else {
    const [rows] = await db.execute(`SELECT * FROM Dashboard`)

    res.status(200).json({
      code: 0,
      data: rows
    })
  }
})

// create a new dataset
dashboards.post('/', authenticateToken, async (req, res) => {
  const data = JSON.stringify(req.body.data)
  const { account, dashboardName } = req.body

  const [rows1] = await db.execute(
    `SELECT id FROM User WHERE account='${account}'`
  )

  const id = (rows1 as any[]).at(0).id

  const [rows2] = await db.execute(
    `INSERT INTO Dataset (id, name, data, owner) VALUES (DEFAULT, '${dashboardName}', '${data}', '${id}')`
  )

  res.status(201).json({
    code: 0,
    message: '上传仪表盘成功',
    data: rows2
  })
})

// update dataset name
dashboards.patch('/', authenticateToken, async (req, res) => {
  const { id, name } = req.body

  const [rows] = await db.execute(
    `UPDATE Dashboard SET name = '${name}' WHERE id='${id}'`
  )

  res.status(200).json({
    code: 0,
    message: '更新仪表盘名称成功',
    data: rows
  })
})

// delete dataset by id
dashboards.delete('/:id', async (req, res) => {
  const { id } = req.params

  const [rows] = await db.execute(`DELETE FROM Dashboard WHERE id='${id}'`)

  res.status(200).json({
    code: 0,
    message: '仪表盘删除成功',
    data: rows
  })
})

export default dashboards
