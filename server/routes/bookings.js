import express from 'express';
import { createBooking, getICS, cancelBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/:id/ics', getICS);
router.patch('/:id/cancel', cancelBooking);

export default router;
