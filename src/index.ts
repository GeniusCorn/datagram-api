import 'dotenv/config'
import cors from 'cors'
import express, { Express, Request, Response } from 'express'

import user from './user'

const app: Express = express()

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use(
  cors({
    origin: '*',
    methods: ['*']
  })
)

const prefix = '/api'

app.get(prefix, (req: Request, res: Response) => {
  res.send('DataGram API')
})

app.use(`${prefix}/user`, user)

const port = process.env.PORT

app.listen(port, () => {
  console.log(`[server]: Server is running at ${port}`)
})
