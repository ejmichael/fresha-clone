import React, { useState } from 'react';
import { createStaff, updateStaff, deleteStaff } from '../../api/api';
import { Edit2, Trash2, Plus } from 'lucide-react';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const StaffTab = ({ staff, profile, onStaffChange, showToast }) => {
  const [view, setView] = useState('list');
  const [editingId, setEditingId] = useState(null);

  const getDefaultHours = () => {
    if (profile?.operatingHours?.length === 7) {
      return profile.operatingHours.map(d => ({ day: d.day, start: d.open || '09:00', end: d.close || '17:00', isOff: d.isClosed }));
    }
    return Array.from({ length: 7 }, (_, i) => ({ day: i, start: '09:00', end: '17:00', isOff: i === 0 }));
  };

  const [formData, setFormData] = useState({ name: '', bio: '', workingHours: getDefaultHours() });
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ name: '', bio: '', workingHours: getDefaultHours() });
    setView('form');
  };

  const handleEdit = (s) => {
    setEditingId(s._id);
    setFormData({
      name: s.name,
      bio: s.bio || '',
      workingHours: s.workingHours?.length === 7 ? s.workingHours : getDefaultHours()
    });
    setView('form');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;
    try {
      await deleteStaff(id);
      onStaffChange(staff.filter(s => s._id !== id));
      showToast('Staff member deleted', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete staff member', 'error');
    }
  };

  const handleHourUpdate = (index, field, value) => {
    const newHours = [...formData.workingHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setFormData({ ...formData, workingHours: newHours });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        const { data } = await updateStaff(editingId, formData);
        onStaffChange(staff.map(s => s._id === editingId ? data : s));
        showToast('Staff member updated', 'success');
      } else {
        const { data } = await createStaff(formData);
        onStaffChange([...staff, data]);
        showToast('Staff member added', 'success');
      }
      setView('list');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save staff', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (view === 'form') {
    return (
      <div className="bg-white max-w-2xl">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{editingId ? 'Edit Staff Member' : 'Add Staff Member'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input name="name" type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio <span className="text-gray-400 font-normal">(Optional)</span></label>
              <textarea name="bio" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} rows="2" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">Working Hours</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.workingHours.map((hq, i) => (
                    <tr key={i} className={hq.isOff ? 'bg-gray-50' : ''}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 w-28">
                        {dayNames[hq.day]}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 w-24">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" checked={hq.isOff} onChange={(e) => handleHourUpdate(i, 'isOff', e.target.checked)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                          <span>Day off</span>
                        </label>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <input type="time" value={hq.start} onChange={(e) => handleHourUpdate(i, 'start', e.target.value)} disabled={hq.isOff} className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 w-full max-w-[120px]" />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <input type="time" value={hq.end} onChange={(e) => handleHourUpdate(i, 'end', e.target.value)} disabled={hq.isOff} className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 w-full max-w-[120px]" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setView('list')} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 ${loading ? 'opacity-70' : ''}`}>{loading ? 'Saving...' : 'Save Staff Member'}</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">Staff Members</h2>
        <button onClick={handleAdd} className="flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" /> Add Staff Member
        </button>
      </div>

      {staff.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-sm text-gray-500 mb-4">No staff members yet. Add your first team member.</p>
          <button onClick={handleAdd} className="inline-flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
            Add team member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map(s => {
            const workingDays = s.workingHours?.filter(hq => !hq.isOff).map(hq => dayNames[hq.day].substring(0, 3)).join(', ') || 'No active days';

            return (
              <div key={s._id} className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{s.name}</h3>
                  {s.bio && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{s.bio}</p>}
                  <p className="text-xs font-semibold text-indigo-600 mt-3">{workingDays}</p>
                </div>
                <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                  <button onClick={() => handleEdit(s)} className="p-1.5 text-gray-400 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 rounded" title="Edit"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(s._id)} className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default StaffTab;
