import express from 'express';
import { getBusinessBySlug } from '../controllers/businessController.js';

const router = express.Router();

router.get('/:slug', getBusinessBySlug);

export default router;
