import express from 'express'
import { decode } from 'base-64'
import db from './db/datagram'
import { authenticateToken } from './utils/jwt'

const user = express()

// get all users
user.get('/', authenticateToken, async (req, res) => {
  const [rows] = await db.execute(
    'SELECT id, account, phone, authority FROM User'
  )

  res.status(200).json({
    code: 0,
    data: {
      rows
    }
  })
})

// get user by account
user.get('/:account', async (req, res) => {
  const { account } = req.params
  const [rows] = await db.execute(
    `SELECT id, account, phone, authority FROM User WHERE account = '${account}'`
  )

  res.status(200).json({
    code: 0,
    data: {
      rows
    }
  })
})

// register a new user
user.post('/', async (req, res) => {
  const account = decode(req.body.account)
  const password = decode(req.body.password)

  const [rows1] = await db.execute(
    `SELECT account FROM User WHERE account = '${account}'`
  )

  if ((rows1 as []).length > 0) {
    res.status(409).json({
      code: 1,
      message: '注册失败，该用户名已被注册',
      data: rows1
    })
  } else {
    const [rows2] = await db.execute(
      `INSERT INTO User (id, account, password, authority) VALUES (DEFAULT, '${account}', '${password}', DEFAULT)`
    )

    res.status(201).json({
      code: 0,
      message: '注册成功，请返回登录页登录',
      data: rows2
    })
  }
})

export default user
