import express, { response } from 'express'
import axios from 'axios'

const api = express()

api.post('/', async (req, res) => {
  const { url } = req.body

  axios
    .get(url)
    .then(response => {
      const data = response.data

      return res.status(200).json({
        code: 0,
        message: '获取数据成功',
        data
      })
    })
    .catch(err => {
      return res.status(200).json({
        code: 1,
        message: '获取数据失败',
        data: err
      })
    })
})

export default api
