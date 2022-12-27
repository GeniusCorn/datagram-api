import { sign, verify, Secret } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

interface Settings {
  expiresIn: string
}

const settings: Settings = {
  expiresIn: '5000s'
}

export function generateAccessToken(account: string) {
  return sign({ account }, process.env.TOKEN_SECRET as string, settings)
}

export function authenticateToken(
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
    (error: any, user: any) => {
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
