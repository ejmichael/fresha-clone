import PDFDocument from 'pdfkit';
import axios from 'axios';

export const generateInvoicePDF = async (invoice) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        let pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      const { business, clientName, clientEmail, clientPhone, invoiceNumber, createdAt, dueDate, lineItems, subtotal, taxRate, taxAmount, total, currency, notes } = invoice;

      // Header Section
      if (business.logo) {
        try {
          const response = await axios.get(business.logo, { responseType: 'arraybuffer' });
          const logoBuffer = Buffer.from(response.data, 'base64');
          doc.image(logoBuffer, 50, 45, { width: 60 });
        } catch (err) {
          console.warn('Failed to load logo for PDF:', err.message);
        }
      }

      doc
        .fillColor('#444444')
        .fontSize(20)
        .text(business.name, 120, 50)
        .fontSize(10)
        .text(business.address || '', 120, 75)
        .moveDown();

      // Invoice Label
      doc
        .fillColor('#1D9E75')
        .fontSize(30)
        .text('INVOICE', 0, 50, { align: 'right' })
        .fillColor('#444444')
        .fontSize(10)
        .text(invoiceNumber, 0, 85, { align: 'right' })
        .text(`Date: ${new Date(createdAt).toLocaleDateString()}`, 0, 100, { align: 'right' })
        .text(`Due Date: ${dueDate ? new Date(dueDate).toLocaleDateString() : 'Upon Receipt'}`, 0, 115, { align: 'right' })
        .moveDown();

      doc.moveTo(50, 150).lineTo(550, 150).stroke('#eeeeee');

      // Client Section
      doc
        .fontSize(10)
        .fillColor('#999999')
        .text('Billed to:', 50, 170)
        .fillColor('#444444')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text(clientName, 50, 185)
        .font('Helvetica')
        .fontSize(10)
        .text(clientEmail, 50, 200)
        .text(clientPhone || '', 50, 215)
        .moveDown();

      // Table Header
      const tableTop = 270;
      doc
        .rect(50, tableTop, 500, 20)
        .fill('#1D9E75')
        .fontSize(10)
        .fillColor('#ffffff')
        .font('Helvetica-Bold')
        .text('Description', 60, tableTop + 5)
        .text('Qty', 300, tableTop + 5, { width: 50, align: 'center' })
        .text('Unit Price', 350, tableTop + 5, { width: 100, align: 'right' })
        .text('Total', 450, tableTop + 5, { width: 90, align: 'right' });

      // Line Items
      let i = 0;
      doc.font('Helvetica').fillColor('#444444');
      lineItems.forEach((item, index) => {
        const y = tableTop + 20 + (index * 25);
        
        // Alternating background
        if (index % 2 === 1) {
          doc.rect(50, y, 500, 25).fill('#f9f9f9');
        }

        doc
          .fillColor('#444444')
          .text(item.description, 60, y + 7)
          .text(item.quantity.toString(), 300, y + 7, { width: 50, align: 'center' })
          .text(`${currency} ${item.unitPrice.toFixed(2)}`, 350, y + 7, { width: 100, align: 'right' })
          .text(`${currency} ${item.total.toFixed(2)}`, 450, y + 7, { width: 90, align: 'right' });
        
        i = index;
      });

      const subtotalY = tableTop + 20 + ((i + 1) * 25) + 20;

      // Totals
      doc
        .fontSize(10)
        .text('Subtotal:', 350, subtotalY, { width: 100, align: 'right' })
        .text(`${currency} ${subtotal.toFixed(2)}`, 450, subtotalY, { width: 90, align: 'right' });

      if (taxRate > 0) {
        doc
          .text(`Tax (${taxRate}%):`, 350, subtotalY + 20, { width: 100, align: 'right' })
          .text(`${currency} ${taxAmount.toFixed(2)}`, 450, subtotalY + 20, { width: 90, align: 'right' });
      }

      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#1D9E75')
        .text('Total:', 350, subtotalY + 45, { width: 100, align: 'right' })
        .text(`${currency} ${total.toFixed(2)}`, 450, subtotalY + 45, { width: 90, align: 'right' });

      // Bank Details
      if (business.bankDetails && business.bankDetails.accountNumber) {
        const bankY = subtotalY + 100;
        doc
          .rect(50, bankY, 500, 70)
          .fill('#f5f5f5')
          .fillColor('#444444')
          .font('Helvetica-Bold')
          .fontSize(10)
          .text('Payment Details', 60, bankY + 10)
          .font('Helvetica')
          .fontSize(9)
          .text(`Bank: ${business.bankDetails.bankName}`, 60, bankY + 25)
          .text(`Account Name: ${business.bankDetails.accountName}`, 60, bankY + 35)
          .text(`Account Number: ${business.bankDetails.accountNumber}`, 60, bankY + 45)
          .text(`Branch Code: ${business.bankDetails.branchCode}`, 60, bankY + 55);
      }

      // Notes
      if (notes) {
        const notesY = subtotalY + 200;
        doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .text('Notes', 50, notesY)
          .font('Helvetica')
          .fontSize(9)
          .text(notes, 50, notesY + 15);
      }

      // Footer
      const footerY = 750;
      doc
        .fontSize(10)
        .fillColor('#999999')
        .text('Thank you for your business', 0, footerY, { align: 'center' })
        .text(business.name, 0, footerY + 15, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
