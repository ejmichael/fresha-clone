import express from 'express';
import auth from '../middleware/auth.js';
import { uploadLogo } from '../config/upload.js';
import {
  getInvoices, getInvoiceById, createInvoice, updateInvoice,
  sendInvoice, downloadInvoicePDF, updateInvoiceStatus, deleteInvoice
} from '../controllers/invoiceController.js';
import { uploadBusinessLogo } from '../controllers/uploadController.js';

const router = express.Router();

// Logo upload
router.post('/upload/logo', auth, uploadLogo.single('logo'), uploadBusinessLogo);

// Invoice CRUD
router.get('/', auth, getInvoices);
router.get('/:id', auth, getInvoiceById);
router.post('/', auth, createInvoice);
router.put('/:id', auth, updateInvoice);
router.delete('/:id', auth, deleteInvoice);

// Invoice actions
router.post('/:id/send', auth, sendInvoice);
router.get('/:id/pdf', auth, downloadInvoicePDF);
router.patch('/:id/status', auth, updateInvoiceStatus);

export default router;
