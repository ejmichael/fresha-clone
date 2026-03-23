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
