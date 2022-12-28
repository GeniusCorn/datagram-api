import express from 'express'
import { decode } from 'base-64'
import db from './db/datagram'
import { authenticateAdmin, authenticateToken } from './utils/jwt'

const users = express()

// get user by account
users.get('/:account', authenticateToken, async (req, res) => {
  const { account } = req.params

  const [rows] = await db.execute(
    `SELECT id, account, phone, authority FROM User WHERE account = '${account}'`
  )

  res.status(200).json({
    code: 0,
    data: rows
  })
})

// get all users
users.get('/', authenticateToken, authenticateAdmin, async (req, res) => {
  const [rows] = await db.execute(
    'SELECT id, account, phone, authority FROM User'
  )

  res.status(200).json({
    code: 0,
    data: rows
  })
})

// register a new user
users.post('/', async (req, res) => {
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

// update user file
users.put('/', authenticateToken, async (req, res) => {
  const account = req.body.account
  const phone = req.body.phone

  const [rows] = await db.execute(
    `UPDATE User SET phone='${phone}' WHERE account='${account}'`
  )

  res.status(200).json({
    code: 0,
    message: '个人信息更新成功',
    data: rows
  })
})

// update password
users.patch('/', authenticateToken, async (req, res) => {
  const account = req.body.account
  const password = req.body.password
  const newPassword = req.body.newPassword

  const [rows1] = await db.execute(
    `SELECT password FROM User WHERE account = '${account}'`
  )

  if ((rows1 as any[]).at(0).password !== password) {
    return res.status(400).json({
      code: 1,
      message: '密码修改失败，原始密码不正确'
    })
  } else {
    const [rows2] = await db.execute(
      `UPDATE User SET password='${newPassword}' WHERE account = '${account}'`
    )

    return res.status(200).json({
      code: 0,
      message: '密码修改成功，请重新登录',
      data: rows2
    })
  }
})

export default users
