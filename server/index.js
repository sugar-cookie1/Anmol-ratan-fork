import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import apiRouter from './routes/api.js'
import { connectDB } from "./config/db-config.js"

const app = express()
const PORT = process.env.BACKEND_PORT || 8000


app.use(cors())
app.use(express.json())
connectDB()

app.use('/api', apiRouter)


app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
