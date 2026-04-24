import express from 'express';
import auth from '../middleware/auth.js';
import { subscriptionGuard } from '../middleware/subscriptionGuard.js';
import { uploadLogo } from '../config/upload.js';
import {
  getInvoices, getInvoiceById, createInvoice, updateInvoice,
  sendInvoice, downloadInvoicePDF, updateInvoiceStatus, deleteInvoice
} from '../controllers/invoiceController.js';
import { uploadBusinessLogo } from '../controllers/uploadController.js';

const router = express.Router();

// Logo upload (not guarded — needed for profile setup even if expired)
router.post('/upload/logo', auth, uploadLogo.single('logo'), uploadBusinessLogo);

// Invoice CRUD (guarded by subscription)
router.get('/', auth, subscriptionGuard, getInvoices);
router.get('/:id', auth, subscriptionGuard, getInvoiceById);
router.post('/', auth, subscriptionGuard, createInvoice);
router.put('/:id', auth, subscriptionGuard, updateInvoice);
router.delete('/:id', auth, subscriptionGuard, deleteInvoice);

// Invoice actions
router.post('/:id/send', auth, subscriptionGuard, sendInvoice);
router.get('/:id/pdf', auth, subscriptionGuard, downloadInvoicePDF);
router.patch('/:id/status', auth, subscriptionGuard, updateInvoiceStatus);

export default router;
