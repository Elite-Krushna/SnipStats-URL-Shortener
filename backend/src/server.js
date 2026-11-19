import express from 'express'
import { config } from './config/env.js'
import urlRoutes from './routes/urlRoutes.js'

const app = express()

// Lets the server read JSON sent in request bodies
app.use(express.json())

// CORS: allow only the React app to call this API from the browser
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', config.frontendOrigin)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

app.use(urlRoutes)
  
// Any path that matched no route gets a clear JSON 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' })
})

// Catch bad JSON bodies and any other unexpected errors
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request.' })
  }
  console.error(err)
  res.status(500).json({ error: 'Something went wrong on the server.' })
})

app.listen(config.port, () => {
  console.log(`Backend running at http://localhost:${config.port}`)
})