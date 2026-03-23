import Business from '../models/Business.js';
import Staff from '../models/Staff.js';
import Service from '../models/Service.js';
import Appointment from '../models/Appointment.js';
import { addMinutes, format, isBefore, isSameDay } from 'date-fns';

export const getAvailability = async (req, res) => {
  try {
    const { businessId, staffId, serviceId, date } = req.query; // date should be YYYY-MM-DD
    
    if (!businessId || !staffId || !serviceId || !date) {
      return res.status(400).json({ message: 'Missing required query parameters' });
    }

    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay(); 

    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ message: 'Business not found' });

    const businessHours = business.operatingHours.find(h => h.day === dayOfWeek);
    if (!businessHours || businessHours.isClosed) {
      return res.json([]); 
    }

    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    const staffHours = staff.workingHours.find(h => h.day === dayOfWeek);
    if (!staffHours || staffHours.isOff) {
      return res.json([]); 
    }

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    const durationMinutes = service.duration;

    const bizOpenTimeArr = businessHours.open.split(':').map(Number);
    const bizCloseTimeArr = businessHours.close.split(':').map(Number);
    const staffStartTimeArr = staffHours.start.split(':').map(Number);
    const staffEndTimeArr = staffHours.end.split(':').map(Number);

    const startHour = Math.max(bizOpenTimeArr[0], staffStartTimeArr[0]);
    const startMinute = startHour === bizOpenTimeArr[0] && startHour === staffStartTimeArr[0] 
      ? Math.max(bizOpenTimeArr[1], staffStartTimeArr[1]) 
      : startHour === bizOpenTimeArr[0] ? bizOpenTimeArr[1] : staffStartTimeArr[1];

    const endHour = Math.min(bizCloseTimeArr[0], staffEndTimeArr[0]);
    const endMinute = endHour === bizCloseTimeArr[0] && endHour === staffEndTimeArr[0] 
      ? Math.min(bizCloseTimeArr[1], staffEndTimeArr[1]) 
      : endHour === bizCloseTimeArr[0] ? bizCloseTimeArr[1] : staffEndTimeArr[1];

    let currentSlot = new Date(dateObj);
    currentSlot.setHours(startHour, startMinute, 0, 0);

    const endWindow = new Date(dateObj);
    endWindow.setHours(endHour, endMinute, 0, 0);

    const startOfDay = new Date(dateObj);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateObj);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await Appointment.find({
      staff: staffId,
      status: 'confirmed',
      startTime: { $gte: startOfDay, $lte: endOfDay }
    });

    const slots = [];
    const now = new Date();

    while (isBefore(addMinutes(currentSlot, durationMinutes), endWindow) || currentSlot.getTime() + durationMinutes * 60000 === endWindow.getTime()) {
      const slotStart = currentSlot;
      const slotEnd = addMinutes(currentSlot, durationMinutes);

      const hasOverlap = existingAppointments.some(appt => {
        const apptStart = new Date(appt.startTime);
        const apptEnd = new Date(appt.endTime);
        return (isBefore(slotStart, apptEnd) && isBefore(apptStart, slotEnd));
      });

      const isPast = isSameDay(slotStart, now) && isBefore(slotStart, now);

      if (!hasOverlap && !isPast) {
        slots.push(format(slotStart, 'HH:mm'));
      }

      currentSlot = addMinutes(currentSlot, 15);
    }

    res.json(slots);
  } catch (error) {
    console.error('Availability Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
