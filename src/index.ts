import 'dotenv/config'

import express, { Express, Request, Response } from 'express'

import user from './user'

const app: Express = express()

const prefix = '/api'

app.get(prefix, (req: Request, res: Response) => {
  res.send('DataGram API')
})

app.use(`${prefix}/user`, user)

const port = process.env.PORT

app.listen(port, () => {
  console.log(`[server]: Server is running at ${port}`)
})
