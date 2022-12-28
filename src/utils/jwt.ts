import { sign, verify, Secret, SignOptions } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

const options: SignOptions = {
  algorithm: 'HS512',
  expiresIn: '3000s'
}

export function generateAccessToken(account: string, authority: string) {
  return sign(
    { account, authority },
    process.env.TOKEN_SECRET as string,
    options
  )
}

export function authenticateUserToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.token

  if (token === null || token === undefined) {
    return res.status(401).json({
      code: 1,
      message: '请登录后再进行操作',
      data: token
    })
  }

  verify(
    token as string,
    process.env.TOKEN_SECRET as Secret,
    (error: any, payload: any) => {
      if (error) {
        return res.status(403).json({
          code: 1,
          message: '登录状态已过期，请重新登录',
          data: error
        })
      }

      next()
    }
  )
}

export function authenticateAdminToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.token

  if (token === null || token === undefined) {
    return res.status(401).json({
      code: 1,
      message: '请登录后再进行操作',
      data: token
    })
  }

  verify(
    token as string,
    process.env.TOKEN_SECRET as Secret,
    (error: any, payload: any) => {
      if (error) {
        return res.status(403).json({
          code: 1,
          message: '登录状态已过期，请重新登录',
          data: error
        })
      }

      if (payload.authority !== 'admin') {
        return res.status(403).json({
          code: 1,
          message: '用户权限不足，无法访问'
        })
      } else {
        next()
      }
    }
  )
}
