import express from 'express';
import { createBooking, getICS, cancelBooking, getBooking, reschedulePublicBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/:id', getBooking);
router.get('/:id/ics', getICS);
router.patch('/:id/cancel', cancelBooking);
router.patch('/:id/reschedule', reschedulePublicBooking);

export default router;
