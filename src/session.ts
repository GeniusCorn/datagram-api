import express from 'express'
import db from './db/datagram'
import { decode } from 'base-64'
import { generateAccessToken } from './utils/jwt'

const session = express()

// login
session.post('/', async (req, res) => {
  const account = decode(req.body.account)
  const password = decode(req.body.password)

  const [rows] = await db.execute(
    `SELECT account, password FROM User WHERE account = '${account}' AND password = '${password}'`
  )

  if ((rows as []).length === 0) {
    res.status(401).json({
      code: 1,
      message: '用户名或密码错误',
      data: rows
    })
  } else {
    res.status(200).json({
      code: 0,
      message: '登录成功',
      data: {
        rows,
        token: generateAccessToken(account)
      }
    })
  }
})

export default session
