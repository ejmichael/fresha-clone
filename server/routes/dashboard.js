import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  getTodayStats
} from '../controllers/dashboardController.js';

const router = express.Router();

router.use(protect);

router.get('/appointments', getAppointments);
router.get('/appointments/:id', getAppointmentById);
router.patch('/appointments/:id/status', updateAppointmentStatus);
router.get('/stats/today', getTodayStats);

export default router;
