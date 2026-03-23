import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getProfile, updateProfile, updateHours, updatePassword,
  getServices, createService, updateService, toggleServiceActive, deleteService,
  getStaff, createStaff, updateStaff, deleteStaff
} from '../controllers/settingsController.js';

const router = express.Router();
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/hours', updateHours);
router.put('/password', updatePassword);

router.get('/services', getServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.patch('/services/:id/toggle', toggleServiceActive);
router.delete('/services/:id', deleteService);

router.get('/staff', getStaff);
router.post('/staff', createStaff);
router.put('/staff/:id', updateStaff);
router.delete('/staff/:id', deleteStaff);

export default router;
