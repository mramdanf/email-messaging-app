const app = require('express')()

require('dotenv').config()



app.get('/', (req, res) => {
  res.json({ message: JSON.stringify(process.env) })
})

const port = 3000

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`)
})