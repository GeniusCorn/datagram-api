import express from 'express'
import db from './db/datagram'
import { authenticateToken } from './utils/jwt'

const dashboards = express()

// get dashboards
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
  } else if (Object.hasOwn(req.query, 'ID')) {
    const { ID } = req.query
    const [rows] = await db.execute(`SELECT * FROM Dashboard WHERE id='${ID}'`)

    return res.status(200).json({
      code: 0,
      data: rows
    })
  } else {
    const [rows] = await db.execute(`SELECT * FROM Dashboard`)

    return res.status(200).json({
      code: 0,
      data: rows
    })
  }
})

// create a new dashboard
dashboards.post('/', authenticateToken, async (req, res) => {
  const { account, dashboardName } = req.body

  const [rows1] = await db.execute(
    `SELECT id FROM User WHERE account='${account}'`
  )

  const id = (rows1 as any[]).at(0).id

  const [rows3] = await db.execute(
    `SELECT id, name FROM Dashboard WHERE name=${dashboardName} AND owner=${id}`
  )

  if ((rows3 as any[]).length > 0) {
    return res.status(400).json({
      code: 1,
      message: '当前仪表盘名称已经存在',
      data: rows3
    })
  }

  const [rows2] = await db.execute(
    `INSERT INTO Dashboard (id, name, owner) VALUES (DEFAULT, '${dashboardName}', '${id}')`
  )

  return res.status(201).json({
    code: 0,
    message: '仪表盘创建成功',
    data: rows2
  })
})

// update dashboard
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
