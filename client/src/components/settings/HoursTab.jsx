import React, { useState } from 'react';
import { updateHours } from '../../api/api';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const HoursTab = ({ profile, onHoursUpdate, showToast, token }) => {
  const [hours, setHours] = useState(() => {
    if (profile?.operatingHours?.length === 7) return profile.operatingHours;
    return Array.from({ length: 7 }, (_, i) => ({ day: i, open: '09:00', close: '17:00', isClosed: i === 0 }));
  });
  const [loading, setLoading] = useState(false);

  const handleUpdate = (index, field, value) => {
    const newHours = [...hours];
    newHours[index] = { ...newHours[index], [field]: value };
    setHours(newHours);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await updateHours(token, hours);
      onHoursUpdate({ ...profile, operatingHours: data });
      showToast('Operating hours saved', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save hours', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Operating Hours</h2>
      <form onSubmit={handleSubmit}>
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Close</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hours.map((dayObj, i) => (
                <tr key={i} className={dayObj.isClosed ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {dayNames[dayObj.day]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={dayObj.isClosed} 
                        onChange={(e) => handleUpdate(i, 'isClosed', e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                      <span>Closed</span>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input 
                      type="time" 
                      value={dayObj.open} 
                      onChange={(e) => handleUpdate(i, 'open', e.target.value)}
                      disabled={dayObj.isClosed}
                      className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input 
                      type="time" 
                      value={dayObj.close} 
                      onChange={(e) => handleUpdate(i, 'close', e.target.value)}
                      disabled={dayObj.isClosed}
                      className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className={`py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70' : ''}`}>
            {loading ? 'Saving...' : 'Save hours'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HoursTab;
