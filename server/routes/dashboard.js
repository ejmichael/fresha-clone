import express from 'express';
import { protect } from '../middleware/auth.js';
import { subscriptionGuard } from '../middleware/subscriptionGuard.js';
import {
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  rescheduleAppointment,
  getTodayStats
} from '../controllers/dashboardController.js';

const router = express.Router();

router.use(protect);
router.use(subscriptionGuard);

router.get('/appointments', getAppointments);
router.get('/appointments/:id', getAppointmentById);
router.patch('/appointments/:id/status', updateAppointmentStatus);
router.patch('/appointments/:id/reschedule', rescheduleAppointment);
router.get('/stats/today', getTodayStats);

export default router;
