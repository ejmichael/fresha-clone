export const confirmationTemplate = (appointment, googleCalUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background-color: #1D9E75; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px; border: 1px solid #eee; border-top: none; }
    .details { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .details td { padding: 10px 0; border-bottom: 1px solid #f9f9f9; }
    .label { font-weight: bold; color: #666; width: 120px; }
    .value { font-weight: 500; color: #111; }
    .button { display: inline-block; padding: 12px 24px; background-color: #1D9E75; color: white !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; color: #999; font-size: 12px; }
    .cancel-link { color: #666; font-size: 13px; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${appointment.business.name}</h1>
    </div>
    <div class="content">
      <h2>Your booking is confirmed</h2>
      <p>Hi ${appointment.clientName}, your appointment has been scheduled successfully.</p>
      
      <table class="details">
        <tr><td class="label">Service</td><td class="value">${appointment.service.name}</td></tr>
        <tr><td class="label">Professional</td><td class="value">${appointment.staff.name}</td></tr>
        <tr>
          <td class="label">Time</td>
          <td class="value">${new Date(appointment.startTime).toLocaleString('en-US', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: appointment.business.timezone
})}</td>
        </tr>
        <tr><td class="label">Duration</td><td class="value">${appointment.service.duration} mins</td></tr>
        <tr><td class="label">Price</td><td class="value">${appointment.service.currency || 'ZAR'} ${appointment.service.price}</td></tr>
        <tr><td class="label">Location</td><td class="value">${appointment.business.address}</td></tr>
      </table>

      <a href="${googleCalUrl}" class="button">Add to Google Calendar</a>
      
      <p style="margin-top: 30px;">
        <a href="${process.env.CLIENT_URL}/cancel/${appointment._id}" class="cancel-link">Can't make it? Cancel your booking</a>
      </p>
    </div>
    <div class="footer">
      Powered by FreshaClone
    </div>
  </div>
</body>
</html>
`;

export const reminderTemplate = (appointment) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background-color: #1D9E75; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px; border: 1px solid #eee; border-top: none; }
    .details { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .details td { padding: 10px 0; border-bottom: 1px solid #f9f9f9; }
    .label { font-weight: bold; color: #666; width: 120px; }
    .value { font-weight: 500; color: #111; }
    .footer { padding: 20px; text-align: center; color: #999; font-size: 12px; }
    .cancel-link { color: #666; font-size: 13px; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${appointment.business.name}</h1>
    </div>
    <div class="content">
      <h2>See you tomorrow</h2>
      <p>Hi ${appointment.clientName}, this is a reminder for your upcoming appointment.</p>
      
      <table class="details">
        <tr><td class="label">Service</td><td class="value">${appointment.service.name}</td></tr>
        <tr><td class="label">Time</td><td class="value">${new Date(appointment.startTime).toLocaleString('en-US', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: appointment.business.timezone
})}</td></tr>
        <tr><td class="label">Professional</td><td class="value">${appointment.staff.name}</td></tr>
        <tr><td class="label">Location</td><td class="value">${appointment.business.address}</td></tr>
      </table>

      <p style="margin-top: 30px;">
        <a href="${process.env.CLIENT_URL}/cancel/${appointment._id}" class="cancel-link">Need to cancel?</a>
      </p>
    </div>
    <div class="footer">
      Powered by FreshaClone
    </div>
  </div>
</body>
</html>
`;

export const cancellationTemplate = (appointment) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background-color: #1D9E75; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px; border: 1px solid #eee; border-top: none; }
    .details { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .details td { padding: 10px 0; border-bottom: 1px solid #f9f9f9; }
    .label { font-weight: bold; color: #666; width: 120px; }
    .value { font-weight: 500; color: #111; }
    .footer { padding: 20px; text-align: center; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${appointment.business.name}</h1>
    </div>
    <div class="content">
      <h2>Your booking has been cancelled</h2>
      <p>Hi ${appointment.clientName}, your appointment for ${appointment.service.name} has been cancelled.</p>
      
      <table class="details">
        <tr><td class="label">Service</td><td class="value">${appointment.service.name}</td></tr>
        <tr><td class="label">Professional</td><td class="value">${appointment.staff.name}</td></tr>
        <tr><td class="label">Was scheduled for</td><td class="value">${new Date(appointment.startTime).toLocaleString('en-US', {
  weekday: 'long', day: 'numeric', month: 'long', minute: '2-digit', hour: '2-digit', timeZone: appointment.business.timezone
})}</td></tr>
      </table>

      <p style="margin-top: 30px;">
        Want to rebook? Visit our <a href="${process.env.CLIENT_URL}/book/${appointment.business.slug}">booking page</a>.
      </p>
    </div>
    <div class="footer">
      Powered by FreshaClone
    </div>
  </div>
</body>
</html>
`;
export const ownerNotificationTemplate = (appointment) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background-color: #1D9E75; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px; border: 1px solid #eee; border-top: none; }
    .details { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .details td { padding: 10px 0; border-bottom: 1px solid #f9f9f9; }
    .label { font-weight: bold; color: #666; width: 150px; }
    .value { font-weight: 500; color: #111; }
    .button { display: inline-block; padding: 12px 24px; background-color: #1D9E75; color: white !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0; font-size: 20px;">New booking received</h1>
    </div>
    <div class="content">
      <p>You have received a new booking for <strong>${appointment.business.name}</strong>.</p>
      
      <table class="details">
        <tr><td class="label">Client Name</td><td class="value">${appointment.clientName}</td></tr>
        <tr><td class="label">Client Phone</td><td class="value">${appointment.clientPhone}</td></tr>
        <tr><td class="label">Client Email</td><td class="value">${appointment.clientEmail}</td></tr>
        <tr><td class="label">Service</td><td class="value">${appointment.service.name} &middot; ${appointment.service.duration} min &middot; ${appointment.service.currency || 'ZAR'} ${appointment.service.price}</td></tr>
        <tr><td class="label">Staff Member</td><td class="value">${appointment.staff.name}</td></tr>
        <tr>
          <td class="label">Date & Time</td>
          <td class="value">${new Date(appointment.startTime).toLocaleString('en-US', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: appointment.business.timezone
})}</td>
        </tr>
      </table>

      <div style="text-align: center;">
        <a href="${process.env.CLIENT_URL}/dashboard/appointments/${appointment._id}" class="button">View in dashboard</a>
      </div>
    </div>
    <div class="footer">
      Powered by FreshaClone
    </div>
  </div>
</body>
</html>
`;
export const invoiceEmailTemplate = (invoice, business) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background-color: #1D9E75; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px; border: 1px solid #eee; border-top: none; }
    .details { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .details td { padding: 10px 0; border-bottom: 1px solid #f9f9f9; }
    .label { font-weight: bold; color: #666; }
    .value { font-weight: 500; color: #111; text-align: right; }
    .footer { padding: 20px; text-align: center; color: #999; font-size: 12px; }
    .bank-box { background: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0; font-size: 20px;">Invoice from ${business.name}</h1>
    </div>
    <div class="content">
      <p>Hi ${invoice.clientName},</p>
      <p>Thank you for choosing <strong>${business.name}</strong>. Please find your invoice details below. Your full invoice is attached as a PDF.</p>
      
      <div style="margin: 20px 0;">
        <span style="font-size: 24px; color: #1D9E75; font-weight: bold;">${invoice.invoiceNumber}</span>
        <br />
        <span style="color: #666;">Due: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'Upon Receipt'}</span>
      </div>

      <table class="details">
        ${invoice.lineItems.map(item => `
          <tr>
            <td class="label">${item.description}</td>
            <td class="value">${invoice.currency} ${item.total.toFixed(2)}</td>
          </tr>
        `).join('')}
        <tr>
          <td class="label" style="border-bottom: none; padding-top: 20px; font-size: 18px;">Total</td>
          <td class="value" style="border-bottom: none; padding-top: 20px; font-size: 18px; color: #1D9E75; font-weight: bold;">${invoice.currency} ${invoice.total.toFixed(2)}</td>
        </tr>
      </table>

      ${business.bankDetails && business.bankDetails.accountNumber ? `
        <div class="bank-box">
          <p style="margin-top: 0; font-weight: bold; color: #1D9E75;">How to Pay</p>
          <p style="margin: 5px 0;">Bank: ${business.bankDetails.bankName}</p>
          <p style="margin: 5px 0;">Account: ${business.bankDetails.accountName}</p>
          <p style="margin: 5px 0;">Account #: ${business.bankDetails.accountNumber}</p>
          <p style="margin: 5px 0;">Branch: ${business.bankDetails.branchCode}</p>
          <p style="margin: 10px 0 0 0; font-style: italic;">Please use <strong>${invoice.invoiceNumber}</strong> as your reference.</p>
        </div>
      ` : ''}

      <p style="font-size: 13px; color: #666; margin-top: 30px;">
        If you have any questions, please reply directly to this email.
      </p>
    </div>
    <div class="footer">
      Powered by FreshaClone
    </div>
  </div>
</body>
</html>
`;

export const trialExpirationTemplate = (business, daysLeft) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { background-color: #111827; color: white; padding: 30px; text-align: center; }
    .content { padding: 32px; }
    .cta { display: inline-block; padding: 14px 28px; background-color: #111827; color: white !important; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; }
    .footer { padding: 20px; text-align: center; color: #9ca3af; font-size: 13px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0; font-size: 22px;">Your Lazie trial expires in ${daysLeft} days</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${business.name}</strong>,</p>
      <p>We hope you're loving friction-free scheduling and automated client reminders!</p>
      <p>Your free trial of the <strong>Lazie Growth Plan</strong> is coming to an end in <strong>${daysLeft} days</strong>. To ensure your clients can continue booking appointments seamlessly, please subscribe to keep your account active.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.CLIENT_URL}/dashboard/settings" class="cta">Go to Billing →</a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">If you have any questions, simply reply to this email and we'll be happy to help.</p>
    </div>
    <div class="footer">
      Powered by Lazie &middot; You're receiving this because you have an active trial account.
    </div>
  </div>
</body>
</html>
`;
