import { Router } from 'express'
import {
  getMyBookings,
  createBooking,
  cancelBooking,
  getBookedEventIds,
} from '../controllers/bookingController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/', getMyBookings)
router.get('/event-ids', getBookedEventIds)
router.post('/', createBooking)
router.delete('/:id', cancelBooking)

export default router
