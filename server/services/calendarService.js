import * as ics from 'ics';
import dotenv from 'dotenv';
dotenv.config();

export const generateICS = (appointment, business, service, staff) => {
  const startDate = new Date(appointment.startTime);
  const endDate = new Date(appointment.endTime);

  const startArr = [
    startDate.getUTCFullYear(),
    startDate.getUTCMonth() + 1,
    startDate.getUTCDate(),
    startDate.getUTCHours(),
    startDate.getUTCMinutes()
  ];

  const endArr = [
    endDate.getUTCFullYear(),
    endDate.getUTCMonth() + 1,
    endDate.getUTCDate(),
    endDate.getUTCHours(),
    endDate.getUTCMinutes()
  ];
  
  const cancelUrl = `${process.env.CLIENT_URL}/cancel/${appointment._id}`;

  const event = {
    start: startArr,
    end: endArr,
    title: `${service.name} at ${business.name}`,
    description: `Booked with ${staff.name}. Manage your booking at ${cancelUrl}`,
    location: business.address,
    status: 'CONFIRMED',
    organizer: { name: business.name, email: 'noreply@bookapp.com' }
  };

  const { error, value } = ics.createEvent(event);
  if (error) {
    console.error('ICS generation error:', error);
    return null;
  }
  return value;
};

export const generateGoogleCalendarLink = (appointment, business, service) => {
  // Format dates: 20250318T090000Z
  const formatGoogleDate = (dateParam) => {
    const d = new Date(dateParam);
    return d.toISOString().replace(/-|:|\.\d\d\d/g, ''); 
  };

  const startUtc = formatGoogleDate(appointment.startTime);
  const endUtc = formatGoogleDate(appointment.endTime);

  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const queryParams = new URLSearchParams({
    text: `${service.name} at ${business.name}`,
    dates: `${startUtc}/${endUtc}`,
    details: `Booked via BookingPlatform`,
    location: business.address,
    sf: 'true',
    output: 'xml'
  });

  return `${baseUrl}&${queryParams.toString()}`;
};
