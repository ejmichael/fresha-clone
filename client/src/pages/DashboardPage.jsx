import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAppointments, getTodayStats, getServices } from '../api/api';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, List } from 'lucide-react';

const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const DashboardPage = () => {
  const { token } = useAuth();
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
        const { data } = await getTodayStats(token);
        setStats(data);
      } catch (err) {
        console.error('Stats fetch err', err);
      }
    };

    const checkServices = async () => {
      try {
        const { data } = await getServices(token);
        setHasServices(data.length > 0);
      } catch (err) {
        console.error('Services fetch err', err);
      }
    };

    if (token) {
      fetchStats();
      checkServices();
    }
  }, [token, location.pathname]);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const end = new Date(currentWeekStart);
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        
        const { data } = await getAppointments(token, currentWeekStart.toISOString(), end.toISOString());
        setAppointments(data);
      } catch (err) {
        console.error('Appointments fetch err', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAppointments();
  }, [token, currentWeekStart]);

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
          <button onClick={() => navigate('/dashboard/settings')} className="mt-3 sm:mt-0 text-teal-700 bg-teal-100 px-4 py-2 rounded-md text-sm font-semibold hover:bg-teal-200 transition-colors">
            Go to Settings →
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Today', value: stats?.totalToday || 0, color: 'bg-blue-50 text-blue-700' },
          { label: 'Confirmed', value: stats?.confirmedToday || 0, color: 'bg-teal-50 text-teal-700' },
          { label: 'Completed', value: stats?.completedToday || 0, color: 'bg-gray-50 text-gray-700' },
          { label: 'Revenue Today', value: `R ${stats?.revenueToday || 0}`, color: 'bg-green-50 text-green-700' }
        ].map((stat, i) => (
          <div key={i} className={`rounded-xl p-4 flex flex-col justify-center shadow-sm border border-gray-100 ${stat.color}`}>
            <span className="text-sm font-medium opacity-80">{stat.label}</span>
            <span className="text-2xl font-bold mt-1">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm transition-colors ${activeTab === 'calendar' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          <CalIcon className="w-4 h-4 mr-2" /> Calendar
        </button>
        <button
          onClick={() => setActiveTab('today')}
          className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm transition-colors ${activeTab === 'today' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          <List className="w-4 h-4 mr-2" /> Today's List
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
          <TodayList appointments={appointments.filter(a => new Date(a.startTime).setHours(0,0,0,0) === today.getTime())} navigate={navigate} />
        )}
      </div>
    </div>
  );
};

const CalendarView = ({ appointments, weekDays, today, loading, onPrev, onNext, onToday, navigate }) => {
  const hours = Array.from({ length: 14 }, (_, i) => i + 7);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-800">
            {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={onToday} className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50">Today</button>
          <div className="flex border border-gray-300 rounded divide-x divide-gray-300">
            <button onClick={onPrev} className="p-1.5 bg-white hover:bg-gray-50 text-gray-600"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={onNext} className="p-1.5 bg-white hover:bg-gray-50 text-gray-600"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-auto">
        <div className="w-16 flex-none border-r border-gray-200 bg-white sticky left-0 z-10">
          <div className="h-12 border-b border-gray-200"></div>
          {hours.map(h => (
            <div key={h} className="h-24 border-b border-gray-100 relative">
              <span className="absolute -top-3 right-2 text-xs text-gray-400">{`${h.toString().padStart(2, '0')}:00`}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-1 min-w-[700px]">
          {weekDays.map((date, i) => {
            const isToday = date.getTime() === today.getTime();
            const dayAppts = appointments.filter(a => {
              const apptDate = new Date(a.startTime);
              apptDate.setHours(0,0,0,0);
              return apptDate.getTime() === date.getTime();
            });

            return (
              <div key={i} className="flex-1 flex flex-col min-w-[100px] border-r border-gray-200 relative">
                <div className={`h-12 border-b border-gray-200 flex flex-col items-center justify-center sticky top-0 bg-white z-20 ${isToday ? 'bg-indigo-50 border-b-indigo-200' : ''}`}>
                  <span className={`text-xs font-semibold uppercase ${isToday ? 'text-indigo-600' : 'text-gray-500'}`}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span className={`text-lg leading-none ${isToday ? 'text-indigo-600 font-bold' : 'text-gray-900'}`}>{date.getDate()}</span>
                </div>
                
                <div className="relative flex-1">
                  {hours.map(h => (
                    <div key={h} className="h-24 border-b border-gray-100">
                      <div className="h-12 border-b border-gray-50 border-dashed"></div>
                    </div>
                  ))}

                  {dayAppts.map(appt => {
                    const start = new Date(appt.startTime);
                    const hoursOffset = start.getHours() + (start.getMinutes() / 60) - 7;
                    if (hoursOffset < 0 || hoursOffset > 14) return null;
                    
                    const topPos = hoursOffset * 6; // rem
                    const durationMins = appt.service?.duration || 30;
                    const heightSize = (durationMins / 60) * 6; // rem

                    return (
                      <div 
                        key={appt._id}
                        onClick={() => navigate(`/dashboard/appointments/${appt._id}`)}
                        className={`absolute left-1 right-1 rounded border overflow-hidden p-1 cursor-pointer transition-shadow hover:shadow-md z-1 ${getStatusColor(appt.status)}`}
                        style={{ top: `${topPos}rem`, height: `calc(${heightSize}rem - 4px)` }}
                        title={`${appt.clientName} - ${appt.service?.name}`}
                      >
                        <div className={`text-xs font-bold truncate ${appt.status === 'cancelled' ? 'line-through opacity-70' : ''}`}>{appt.clientName}</div>
                        {heightSize >= 3 && <div className="text-[10px] truncate opacity-80">{appt.service?.name}</div>}
                        {heightSize >= 4.5 && <div className="text-[10px] truncate opacity-60 font-medium">{appt.staff?.name}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {loading && (
        <div className="absolute inset-0 bg-white/50 z-30 flex items-center justify-center">
          <div className="animate-pulse font-medium text-gray-500">Loading calendar...</div>
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
              onClick={() => navigate(`/dashboard/appointments/${appt._id}`)}
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
              <div className="flex items-center space-x-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize bg-white/50">
                  {appt.status}
                </span>
                <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
