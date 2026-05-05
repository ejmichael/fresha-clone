import Business from '../models/Business.js';
import Staff from '../models/Staff.js';
import Service from '../models/Service.js';
import Appointment from '../models/Appointment.js';
import { addMinutes, isBefore } from 'date-fns';

// Same timezone helper as bookingController — produces a UTC Date whose timestamp
// represents the given wall-clock time in the target timezone.
const getZonedDate = (isoString, timeZone) => {
  const d = new Date(isoString);
  const invDate = new Date(d.toLocaleString('en-US', { timeZone }));
  const diff = d.getTime() - invDate.getTime();
  return new Date(d.getTime() + diff);
};

export const getAvailability = async (req, res) => {
  try {
    const { businessId, staffId, serviceId, date } = req.query; // date should be YYYY-MM-DD

    if (!businessId || !staffId || !serviceId || !date) {
      return res.status(400).json({ message: 'Missing required query parameters' });
    }

    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ message: 'Business not found' });

    const tz = business.timezone || 'Africa/Johannesburg';

    // Use UTC noon so getDay() returns the correct calendar day regardless of server timezone
    const dayOfWeek = new Date(`${date}T12:00:00Z`).getDay();

    const businessHours = business.operatingHours.find(h => h.day === dayOfWeek);
    if (!businessHours || businessHours.isClosed) return res.json([]);

    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    const staffHours = staff.workingHours.find(h => h.day === dayOfWeek);
    if (!staffHours || staffHours.isOff) return res.json([]);

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    const durationMinutes = service.duration;

    const bizOpenArr = businessHours.open.split(':').map(Number);
    const bizCloseArr = businessHours.close.split(':').map(Number);
    const staffStartArr = staffHours.start.split(':').map(Number);
    const staffEndArr = staffHours.end.split(':').map(Number);

    const startHour = Math.max(bizOpenArr[0], staffStartArr[0]);
    const startMinute = startHour === bizOpenArr[0] && startHour === staffStartArr[0]
      ? Math.max(bizOpenArr[1], staffStartArr[1])
      : startHour === bizOpenArr[0] ? bizOpenArr[1] : staffStartArr[1];

    const endHour = Math.min(bizCloseArr[0], staffEndArr[0]);
    const endMinute = endHour === bizCloseArr[0] && endHour === staffEndArr[0]
      ? Math.min(bizCloseArr[1], staffEndArr[1])
      : endHour === bizCloseArr[0] ? bizCloseArr[1] : staffEndArr[1];

    const pad = n => n.toString().padStart(2, '0');

    // Build slot window using the same timezone conversion as bookingController so that
    // the UTC timestamps here align with the stored appointment startTime/endTime values.
    let currentSlot = getZonedDate(`${date}T${pad(startHour)}:${pad(startMinute)}:00`, tz);
    const endWindow = getZonedDate(`${date}T${pad(endHour)}:${pad(endMinute)}:00`, tz);

    // Query using timezone-aware day boundaries
    const dayStart = getZonedDate(`${date}T00:00:00`, tz);
    const dayEnd = getZonedDate(`${date}T23:59:59`, tz);

    const existingAppointments = await Appointment.find({
      staff: staffId,
      status: 'confirmed',
      startTime: { $gte: dayStart, $lte: dayEnd }
    });

    console.log(`[availability] date=${date} tz=${tz} staffId=${staffId}`);
    console.log(`[availability] window: ${currentSlot.toISOString()} → ${endWindow.toISOString()}`);
    console.log(`[availability] found ${existingAppointments.length} existing appointment(s):`);
    existingAppointments.forEach(a => {
      console.log(`  appt ${a._id}: startTime=${new Date(a.startTime).toISOString()} endTime=${new Date(a.endTime).toISOString()}`);
    });

    const slots = [];
    const now = new Date();

    while (
      isBefore(addMinutes(currentSlot, durationMinutes), endWindow) ||
      currentSlot.getTime() + durationMinutes * 60000 === endWindow.getTime()
    ) {
      const slotStart = new Date(currentSlot);
      const slotEnd = addMinutes(slotStart, durationMinutes);

      const hasOverlap = existingAppointments.some(appt => {
        const apptStart = new Date(appt.startTime);
        const apptEnd = new Date(appt.endTime);
        return isBefore(slotStart, apptEnd) && isBefore(apptStart, slotEnd);
      });

      if (!hasOverlap && !isBefore(slotStart, now)) {
        slots.push(slotStart.toLocaleTimeString('en-GB', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }));
      }

      currentSlot = addMinutes(currentSlot, 15);
    }

    res.json(slots);
  } catch (error) {
    console.error('Availability Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
