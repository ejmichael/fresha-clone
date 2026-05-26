import React, { useState } from 'react';
import { createService, updateService, toggleServiceActive, deleteService } from '../../api/api';
import { Edit2, Eye, EyeOff, Trash2, Plus, Tag } from 'lucide-react';

const ServicesTab = ({ services, staff, onServicesChange, showToast }) => {
  const [view, setView] = useState('list');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: '', duration: 30, price: '', assignedStaff: [] });
  const [loading, setLoading] = useState(false);

  const existingCategories = [...new Set(services.map(s => s.category).filter(Boolean))];

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ name: '', category: '', duration: 30, price: '', assignedStaff: [] });
    setView('form');
  };

  const handleEdit = (service) => {
    setEditingId(service._id);
    setFormData({
      name: service.name,
      category: service.category || '',
      duration: service.duration,
      price: service.price,
      assignedStaff: service.assignedStaff || []
    });
    setView('form');
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await toggleServiceActive(id);
      onServicesChange(services.map(s => s._id === id ? data : s));
      showToast('Service status updated', 'success');
    } catch (err) {
      showToast('Failed to toggle status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;
    try {
      await deleteService(id);
      onServicesChange(services.filter(s => s._id !== id));
      showToast('Service deleted', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete service', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        const { data } = await updateService(editingId, formData);
        onServicesChange(services.map(s => s._id === editingId ? data : s));
        showToast('Service updated', 'success');
      } else {
        const { data } = await createService(formData);
        onServicesChange([...services, data]);
        showToast('Service created', 'success');
      }
      setView('list');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save service', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStaffToggle = (staffId) => {
    setFormData(prev => ({
      ...prev,
      assignedStaff: prev.assignedStaff.includes(staffId)
        ? prev.assignedStaff.filter(id => id !== staffId)
        : [...prev.assignedStaff, staffId]
    }));
  };

  if (view === 'form') {
    return (
      <div className="max-w-2xl bg-white">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{editingId ? 'Edit Service' : 'Add Service'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Name</label>
            <input
              name="name" type="text" value={formData.name} required
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:ring-lazie-primary focus:border-lazie-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category <span className="text-gray-400 font-normal">(optional — e.g. Hair, Nails, Massage)</span>
            </label>
            <input
              name="category" type="text" value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              list="category-suggestions"
              placeholder="e.g. Hair Treatments"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:ring-lazie-primary focus:border-lazie-primary"
            />
            {existingCategories.length > 0 && (
              <datalist id="category-suggestions">
                {existingCategories.map(cat => <option key={cat} value={cat} />)}
              </datalist>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              <select
                name="duration" value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:ring-lazie-primary focus:border-lazie-primary"
              >
                {[15, 30, 45, 60, 75, 90, 105, 120, 150, 180].map(mins => (
                  <option key={mins} value={mins}>{mins} minutes</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (ZAR)</label>
              <input
                name="price" type="number" min="0" value={formData.price} required
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:ring-lazie-primary focus:border-lazie-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign Staff</label>
            <div className="space-y-2 border border-gray-200 rounded-md p-3 max-h-48 overflow-y-auto">
              {staff.length === 0
                ? <p className="text-sm text-gray-500">No staff available.</p>
                : staff.map(s => (
                  <label key={s._id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.assignedStaff.includes(s._id)}
                      onChange={() => handleStaffToggle(s._id)}
                      className="rounded border-gray-300 text-lazie-primary focus:ring-lazie-primary"
                    />
                    <span className="text-sm text-gray-700">{s.name}</span>
                  </label>
                ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setView('list')} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading} className={`py-2.5 px-6 border border-transparent rounded-full shadow-sm text-sm font-bold text-gray-950 bg-lazie-primary hover:brightness-90 ${loading ? 'opacity-70' : ''} transition-all uppercase tracking-wide`}>
              {loading ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Group services by category for the list view
  const categories = [...new Set(services.map(s => s.category).filter(Boolean))].sort();
  const uncategorized = services.filter(s => !s.category);

  const ServiceRow = ({ service }) => (
    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-sm transition-shadow bg-white">
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900">{service.name}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{service.duration} min • {service.currency} {service.price}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {service.assignedStaff?.map(staffId => {
            const st = staff.find(s => s._id === staffId);
            return st ? <span key={staffId} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{st.name}</span> : null;
          })}
        </div>
      </div>
      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {service.isActive ? 'Active' : 'Inactive'}
        </span>
        <div className="flex gap-1 border-l border-gray-200 pl-3">
          <button onClick={() => handleEdit(service)} className="p-1.5 text-gray-400 hover:text-indigo-600" title="Edit"><Edit2 className="w-4 h-4" /></button>
          <button onClick={() => handleToggle(service._id)} className="p-1.5 text-gray-400 hover:text-gray-900" title="Toggle Active">
            {service.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button onClick={() => handleDelete(service._id)} className="p-1.5 text-gray-400 hover:text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">Services</h2>
        <button onClick={handleAdd} className="flex items-center py-2.5 px-6 border border-transparent rounded-full shadow-sm text-sm font-bold text-gray-950 bg-lazie-primary hover:brightness-90 transition-all uppercase tracking-wide">
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-sm text-gray-500 mb-4">No services yet.</p>
          <button onClick={handleAdd} className="inline-flex items-center py-2.5 px-6 border border-transparent rounded-full shadow-sm text-sm font-bold text-lazie-dark bg-lazie-primary/10 hover:bg-lazie-primary/20 transition-all uppercase tracking-wide">
            Add your first service
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map(cat => (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-lazie-dark" />
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{cat}</h3>
                <span className="text-xs text-gray-400">({services.filter(s => s.category === cat).length})</span>
              </div>
              <div className="space-y-2">
                {services.filter(s => s.category === cat).map(service => (
                  <ServiceRow key={service._id} service={service} />
                ))}
              </div>
            </div>
          ))}

          {uncategorized.length > 0 && (
            <div>
              {categories.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Uncategorized</h3>
                  <span className="text-xs text-gray-400">({uncategorized.length})</span>
                </div>
              )}
              <div className="space-y-2">
                {uncategorized.map(service => (
                  <ServiceRow key={service._id} service={service} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServicesTab;
