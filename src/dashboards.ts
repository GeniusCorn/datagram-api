import express from 'express'
import db from './db/datagram'
import { authenticateToken } from './utils/jwt'
import { v4 as uuidv4 } from 'uuid'

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
    `SELECT id, authority FROM User WHERE account='${account}'`
  )

  const id = (rows1 as any[]).at(0).id

  const [rows3] = await db.execute(
    `SELECT owner FROM Dashboard WHERE owner='${id}'`
  )

  if (
    (rows1 as any[]).at(0).authority === 'user' &&
    (rows3 as any[]).length >= 2
  ) {
    return res.status(200).json({
      code: 1,
      message: '未付费用户只允许创建至多两个仪表盘'
    })
  } else {
    const shareToken = uuidv4()

    const [rows2] = await db.execute(
      `INSERT INTO Dashboard (id, name, owner, share, share_token) VALUES (DEFAULT, '${dashboardName}', '${id}', 0, '${shareToken}')`
    )

    return res.status(201).json({
      code: 0,
      message: '创建仪表盘成功',
      data: rows2
    })
  }
})

// rename dashboard
dashboards.patch('/', authenticateToken, async (req, res) => {
  const { id, name } = req.body

  const [rows] = await db.execute(
    `UPDATE Dashboard SET name = '${name}' WHERE id='${id}'`
  )

  return res.status(200).json({
    code: 0,
    message: '重命名仪表盘成功',
    data: rows
  })
})

dashboards.put('/', authenticateToken, async (req, res) => {
  const { id, data } = req.body

  const [rows] = await db.execute(
    `UPDATE Dashboard SET data='${data}' WHERE id='${id}'`
  )

  return res.status(200).json({
    code: 0,
    message: '保存成功',
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

// share link
dashboards.get('/share', async (req, res) => {
  const { owner, dashboardName } = req.query

  const [rows] = await db.execute(
    `SELECT * FROM Dashboard WHERE owner='${owner}' AND name='${dashboardName}'`
  )

  const share = (rows as any[]).at(0).share
  console.log(share)

  if (share === 1) {
    return res.status(200).json({
      code: 0,
      data: rows
    })
  } else {
    return res.status(200).json({
      code: 1,
      message: '该图表暂未公开'
    })
  }
})

dashboards.post('/share', async (req, res) => {
  const { id, value } = req.body

  if (value) {
    const [rows] = await db.execute(
      `UPDATE Dashboard SET share='${1}' WHERE id='${id}'`
    )

    return res.status(201).json({
      code: 0,
      data: rows
    })
  } else {
    const [rows] = await db.execute(
      `UPDATE Dashboard SET share='${0}' WHERE id='${id}'`
    )

    return res.status(201).json({
      code: 0,
      data: rows
    })
  }
})

export default dashboards
