import { Router } from 'express'

const router = Router()

// Example route – replace with real ones later
router.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

export default router
