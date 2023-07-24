import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.json({ message: 'database service' })
})

const port = 3000

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`)
})