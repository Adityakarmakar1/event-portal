import { Router } from 'express'
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.get('/', getEvents)
router.get('/:id', getEvent)
router.post('/', protect, adminOnly, createEvent)
router.put('/:id', protect, adminOnly, updateEvent)
router.delete('/:id', protect, adminOnly, deleteEvent)

export default router
