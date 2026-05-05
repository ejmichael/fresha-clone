import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAppointments, getTodayStats, getServices } from '../api/api';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, List, Users } from 'lucide-react';

const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('calendar');
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));

  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasServices, setHasServices] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getTodayStats();
        setStats(data);
      } catch (err) {
        console.error('Stats fetch err', err);
      }
    };

    const checkServices = async () => {
      try {
        const { data } = await getServices();
        setHasServices(data.length > 0);
      } catch (err) {
        console.error('Services fetch err', err);
      }
    };

    fetchStats();
    checkServices();
  }, [location.pathname]);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const end = new Date(currentWeekStart);
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        const { data } = await getAppointments(currentWeekStart.toISOString(), end.toISOString());
        setAppointments(data);
      } catch (err) {
        console.error('Appointments fetch err', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [currentWeekStart]);

  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentWeekStart]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const prevWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() - 7);
    setCurrentWeekStart(d);
  };

  const nextWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + 7);
    setCurrentWeekStart(d);
  };

  const goToToday = () => setCurrentWeekStart(startOfWeek(new Date()));

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {!hasServices && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-teal-800 font-medium">Your booking page isn't ready yet. Add your services and staff to start taking bookings.</p>
          <button onClick={() => navigate('/dashboard/business')} className="mt-3 sm:mt-0 text-teal-700 bg-teal-100 px-4 py-2 rounded-md text-sm font-semibold hover:bg-teal-200 transition-colors">
            Go to Business Setup →
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Today', value: stats?.totalToday || 0, color: 'text-blue-600', bg: 'bg-blue-50/50' },
          { label: 'Confirmed', value: stats?.confirmedToday || 0, color: 'text-lazie-dark', bg: 'bg-lazie-primary/10' },
          { label: 'Completed', value: stats?.completedToday || 0, color: 'text-gray-600', bg: 'bg-gray-50' },
          { label: 'Revenue (Month)', value: `R ${stats?.revenueMonth || 0}`, color: 'text-green-600', bg: 'bg-green-50/50' }
        ].map((stat, i) => (
          <div key={i} className={`rounded-2xl p-6 flex flex-col justify-center shadow-sm border border-gray-100/50 ${stat.bg}`}>
            <span className="text-xs font-bold uppercase tracking-wider opacity-60 font-heading">{stat.label}</span>
            <span className={`text-3xl font-black mt-2 font-heading ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="flex border-b border-gray-100 mb-8 items-center justify-between">
        <div className="flex">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center px-6 py-4 border-b-2 font-bold text-sm transition-all ${activeTab === 'calendar' ? 'border-lazie-primary text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <CalIcon className="w-4 h-4 mr-2" /> Calendar
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`flex items-center px-6 py-4 border-b-2 font-bold text-sm transition-all ${activeTab === 'today' ? 'border-lazie-primary text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <List className="w-4 h-4 mr-2" /> Today's List
          </button>
        </div>
        
        <button
          onClick={() => navigate('/dashboard/appointments/new')}
          className="mb-2 flex items-center gap-2 px-4 py-2 bg-lazie-primary text-gray-900 rounded-lg font-bold text-sm hover:brightness-95 transition-all shadow-lg shadow-lazie-primary/20 flex-shrink-0"
        >
          <CalIcon className="w-4 h-4" />
          <span className="hidden sm:inline">New Appointment</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        {activeTab === 'calendar' ? (
          <CalendarView
            appointments={appointments}
            weekDays={weekDays}
            today={today}
            loading={loading}
            onPrev={prevWeek}
            onNext={nextWeek}
            onToday={goToToday}
            navigate={navigate}
          />
        ) : (
          <TodayList appointments={appointments.filter(a => new Date(a.startTime).setHours(0, 0, 0, 0) === today.getTime())} navigate={navigate} />
        )}
      </div>
    </div>
  );
};

const CalendarView = ({ appointments, weekDays, today, loading, onPrev, onNext, onToday, navigate }) => {
  const hours = Array.from({ length: 14 }, (_, i) => i + 7);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-lazie-primary/10 text-gray-900 border-lazie-primary/50';
      case 'completed': return 'bg-gray-50 text-gray-600 border-gray-200 opacity-80';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-200 opacity-70';
      default: return 'bg-blue-50 text-blue-600 border-blue-200';
    }
  };

  const getIndicatorPosition = () => {
    const startHour = 7;
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    if (currentHour < startHour || currentHour >= 21) return null;
    const offset = (currentHour - startHour) + (currentMin / 60);
    return offset * 8; // rem
  };

  const indicatorTop = getIndicatorPosition();

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Calendar Header/Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900 font-heading">
            {weekDays[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button onClick={onPrev} className="p-1 hover:bg-white rounded transition-all text-gray-600"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={onNext} className="p-1 hover:bg-white rounded transition-all text-gray-600"><ChevronRight className="w-5 h-5" /></button>
          </div>
          <button onClick={onToday} className="px-4 py-1.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">Today</button>
        </div>
        <div className="text-sm font-medium text-gray-500 italic">
          {weekDays[0].toLocaleDateString('en-US', { day: 'numeric' })} – {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-50 relative">
        <div className="flex min-w-max md:min-w-full relative">
        {/* Time Labels Gutter */}
        <div className="w-24 flex-none bg-white border-r border-gray-200 sticky left-0 z-30 flex flex-col">
          <div className="h-16 border-b border-gray-200 bg-white"></div>
          {hours.map(h => (
            <div key={h} className="h-32 relative p-2 bg-white">
              <span className="text-sm font-medium text-gray-400">
                {`${h.toString().padStart(2, '0')}:00`}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="flex flex-1 min-w-[800px] relative bg-white">
          {weekDays.map((date, i) => {
            const isToday = date.toDateString() === today.toDateString();
            const dayAppts = appointments.filter(a => new Date(a.startTime).toDateString() === date.toDateString());

            return (
              <div key={i} className={`flex-1 min-w-[120px] border-r border-gray-100 relative group/col flex flex-col ${isToday ? 'bg-lazie-primary/[0.01]' : 'bg-white'}`}>
                {/* Day Header Column */}
                <div className={`h-16 border-b border-gray-200 flex flex-col items-center justify-center sticky top-0 z-20 transition-colors ${isToday ? 'bg-lazie-dark text-white' : 'bg-white'}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isToday ? 'text-lazie-primary' : 'text-gray-400'}`}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <div className={`text-xl font-black mt-0.5 w-9 h-9 flex items-center justify-center rounded-full ${isToday ? 'bg-white/10' : ''}`}>
                    {date.getDate()}
                  </div>
                </div>

                <div className="relative flex-1">
                  {/* Grid Lines */}
                  {hours.map(h => (
                    <div key={h} className="h-32 border-b border-gray-100 relative bg-white">
                      <div className="absolute top-1/2 left-0 right-0 border-t border-gray-50 border-dashed"></div>
                    </div>
                  ))}

                  {/* Red Line indicator */}
                  {isToday && indicatorTop !== null && (
                    <div className="absolute left-0 right-0 z-30 flex items-center pointer-events-none" style={{ top: `${indicatorTop}rem` }}>
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-[5px] shadow-sm ring-4 ring-red-500/20"></div>
                      <div className="flex-1 h-[2px] bg-red-500 shadow-sm opacity-80"></div>
                    </div>
                  )}

                  {/* Appointments */}
                  {dayAppts.map(appt => {
                    const start = new Date(appt.startTime);
                    const hoursOffset = start.getHours() + (start.getMinutes() / 60) - 7;
                    if (hoursOffset < 0 || hoursOffset > 14) return null;

                    const topPos = hoursOffset * 8;
                    const durationMins = appt.service?.duration || 30;
                    const heightSize = (durationMins / 60) * 8;

                    return (
                      <div
                        key={appt._id}
                        onClick={() => navigate(`/dashboard/appointments/${appt._id}`)}
                        className={`absolute left-1 right-1 rounded-lg border px-2 py-1.5 cursor-pointer shadow-sm transition-all hover:shadow-md hover:brightness-95 z-10 flex flex-col gap-0.5 overflow-hidden ${getStatusColor(appt.status)}`}
                        style={{ top: `${topPos + 0.1}rem`, height: `calc(${heightSize}rem - 0.2rem)` }}
                      >
                        <div className="flex items-start justify-between gap-1 overflow-hidden">
                          <span className="text-sm font-bold leading-tight truncate">{appt.clientName}</span>
                          <span className="text-[11px] font-medium opacity-60 flex-shrink-0">
                            {start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                          </span>
                        </div>
                        {heightSize >= 4 && (
                          <div className="text-xs font-semibold opacity-80 truncate leading-tight">
                            {appt.service?.name}
                          </div>
                        )}
                        {heightSize >= 6 && (
                          <div className="mt-auto flex items-center gap-1.5 pt-1.5 border-t border-current/10">
                            <Users className="w-3.5 h-3.5 opacity-60" />
                            <span className="text-[10px] font-bold uppercase tracking-tight opacity-60 truncate">{appt.staff?.name}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

      {loading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-4">
            <div className="w-6 h-6 border-3 border-lazie-primary/30 border-t-lazie-primary rounded-full animate-spin"></div>
            <span className="font-bold text-gray-900 font-heading">Refining Calendar...</span>
          </div>
        </div>
      )}
    </div>
  );
};

const TodayList = ({ appointments, navigate }) => {
  if (appointments.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
        <List className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-lg font-medium">No appointments today</p>
        <p className="text-sm">Enjoy your day off or check the calendar for upcoming bookings.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-4 lg:p-6">
      <div className="max-w-3xl mx-auto space-y-3">
        {appointments.map(appt => {
          const start = new Date(appt.startTime);
          const statusColors = {
            confirmed: 'bg-teal-100 text-teal-800 border-teal-200',
            completed: 'bg-gray-100 text-gray-800 border-gray-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200'
          };

          return (
            <div
              key={appt._id}
              className={`bg-white rounded-lg border p-4 flex items-center justify-between hover:shadow-md cursor-pointer transition-shadow group ${statusColors[appt.status] || 'border-gray-200'}`}
            >
              <div className="flex items-center space-x-6">
                <div className="font-bold w-16 text-right">
                  {start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </div>
                <div className="border-l border-gray-300/50 pl-6 flex flex-col">
                  <span className={`font-semibold text-lg ${appt.status === 'cancelled' ? 'line-through opacity-70' : ''}`}>{appt.clientName}</span>
                  <span className="text-sm opacity-80">{appt.service?.name} • {appt.staff?.name}</span>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/dashboard/appointments/${appt._id}`)}
                className="ml-4 inline-flex items-center px-3 py-1.5 border border-lazie-primary text-xs font-bold rounded-full text-lazie-dark bg-lazie-primary/10 hover:bg-lazie-primary/20 transition-all uppercase tracking-wider"
              >
                Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
