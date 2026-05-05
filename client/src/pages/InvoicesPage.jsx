import React, { useState, useEffect } from 'react';
import { getInvoices, createInvoice, updateInvoice, sendInvoice, downloadInvoicePDF, updateInvoiceStatus, deleteInvoice, getAppointments } from '../api/api';
import { useToast } from '../hooks/useToast';
import { format } from 'date-fns';
import { Download, Mail, CheckCircle, Trash2, X } from 'lucide-react';

const InvoicesPage = () => {
  const { showToast } = useToast();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // list, create, edit
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, sent: 0, paid: 0, outstanding: 0 });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    appointmentId: '',
    lineItems: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
    taxRate: 0,
    dueDate: '',
    notes: '',
    currency: 'ZAR'
  });

  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    fetchInvoices();
    fetchRecentAppointments();
  }, [filter]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const params = filter === 'all' ? {} : { status: filter };
      const { data } = await getInvoices(params);
      setInvoices(data.invoices);
      
      // Calculate stats (in a real app, this might come from backend)
      const allRes = await getInvoices({});
      const allInvoices = allRes.data.invoices;
      const newStats = allInvoices.reduce((acc, inv) => {
        acc.total++;
        if (inv.status === 'sent') acc.sent++;
        if (inv.status === 'paid') acc.paid++;
        if (inv.status === 'sent' || inv.status === 'overdue') acc.outstanding += inv.total;
        return acc;
      }, { total: 0, sent: 0, paid: 0, outstanding: 0 });
      setStats(newStats);

    } catch (err) {
      showToast('Failed to load invoices', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentAppointments = async () => {
    try {
      const startDate = format(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
      const endDate = format(new Date(), 'yyyy-MM-dd');
      const { data } = await getAppointments(startDate, endDate);
      // Show completed and confirmed so you can pre-invoice upcoming appointments too
      setRecentAppointments(data.filter(a => a.status === 'completed' || a.status === 'confirmed'));
    } catch (err) {}
  };

  const handleCreateNew = () => {
    setFormData({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      appointmentId: '',
      lineItems: [{ description: '', quantity: 1, unitPrice: 0, total: 0 }],
      taxRate: 0,
      dueDate: '',
      notes: '',
      currency: 'ZAR'
    });
    setView('create');
  };

  const handleLineItemChange = (index, field, value) => {
    const newList = [...formData.lineItems];
    newList[index][field] = field === 'description' ? value : Number(value);
    if (field !== 'description') {
      newList[index].total = newList[index].quantity * newList[index].unitPrice;
    }
    setFormData({ ...formData, lineItems: newList });
  };

  const addLineItem = () => {
    setFormData({
      ...formData,
      lineItems: [...formData.lineItems, { description: '', quantity: 1, unitPrice: 0, total: 0 }]
    });
  };

  const removeLineItem = (index) => {
    if (formData.lineItems.length === 1) return;
    setFormData({
      ...formData,
      lineItems: formData.lineItems.filter((_, i) => i !== index)
    });
  };

  const calculateTotals = () => {
    const subtotal = formData.lineItems.reduce((acc, item) => acc + item.total, 0);
    const taxAmount = (subtotal * formData.taxRate) / 100;
    return { subtotal, taxAmount, total: subtotal + taxAmount };
  };

  const handleSubmit = async (e, shouldSend = false) => {
    e.preventDefault();
    try {
      const { subtotal, taxAmount, total } = calculateTotals();
      const payload = { ...formData, subtotal, taxAmount, total };
      
      let res;
      if (view === 'create') {
        res = await createInvoice(payload);
      } else {
        res = await updateInvoice(selectedInvoice._id, payload);
      }

      if (shouldSend) {
        await sendInvoice(res.data._id);
        showToast('Invoice saved and sent', 'success');
      } else {
        showToast('Invoice saved as draft', 'success');
      }
      
      setView('list');
      fetchInvoices();
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  const handleDownload = async (invoice) => {
    try {
      const { data } = await downloadInvoicePDF(invoice._id);
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoice.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      showToast('Download failed', 'error');
    }
  };

  const handleSend = async (invoice) => {
    try {
      await sendInvoice(invoice._id);
      showToast('Invoice sent to client', 'success');
      fetchInvoices();
    } catch (err) {
      showToast('Failed to send invoice', 'error');
    }
  };

  const handleUpdateStatus = async (invoice, status) => {
    try {
      await updateInvoiceStatus(invoice._id, status);
      showToast(`Invoice marked as ${status}`, 'success');
      fetchInvoices();
      if (isPanelOpen) setIsPanelOpen(false);
    } catch (err) {
      showToast('Status update failed', 'error');
    }
  };

  const handleDelete = async (invoice) => {
    if (!window.confirm('Are you sure you want to delete this draft?')) return;
    try {
      await deleteInvoice(invoice._id);
      showToast('Invoice deleted', 'success');
      fetchInvoices();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const openInvoicePanel = (invoice) => {
    setSelectedInvoice(invoice);
    setIsPanelOpen(true);
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  if (view !== 'list') {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{view === 'create' ? 'Create New Invoice' : 'Edit Invoice'}</h1>
          <button onClick={() => setView('list')} className="text-gray-500 hover:text-gray-700">Cancel</button>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Appointment Link */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Link to Appointment</h2>
              <div className="relative">
                <select 
                  value={formData.appointmentId} 
                  onChange={(e) => {
                    const apptId = e.target.value;
                    if (!apptId) {
                      setFormData({ ...formData, appointmentId: '' });
                      return;
                    }
                    const appt = recentAppointments.find(a => a._id === apptId);
                    if (appt) {
                      setFormData({
                        ...formData,
                        appointmentId: apptId,
                        clientName: appt.clientName,
                        clientEmail: appt.clientEmail,
                        clientPhone: appt.clientPhone || '',
                        lineItems: [{
                          description: appt.service?.name || 'Service',
                          quantity: 1,
                          unitPrice: appt.service?.price || 0,
                          total: appt.service?.price || 0
                        }]
                      });
                    }
                  }}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 appearance-none outline-none text-gray-700"
                >
                  <option value="">Select a recent completed appointment...</option>
                  {recentAppointments.map(appt => (
                    <option key={appt._id} value={appt._id}>
                      {appt.clientName} - {appt.service?.name} ({format(new Date(appt.startTime), 'MMM d, h:mm a')})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-400">Selecting an appointment will automatically fill in client and service details.</p>
            </div>

            {/* Client Details */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Client Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Client Name</label>
                  <input required value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Client Email</label>
                  <input required type="email" value={formData.clientEmail} onChange={e => setFormData({...formData, clientEmail: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Line Items</h2>
                <button type="button" onClick={addLineItem} className="text-teal-600 text-sm font-medium">+ Add Item</button>
              </div>
              <div className="space-y-3">
                {formData.lineItems.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                      <input required value={item.description} onChange={e => handleLineItemChange(idx, 'description', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <div className="w-20">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Qty</label>
                      <input required type="number" min="1" value={item.quantity} onChange={e => handleLineItemChange(idx, 'quantity', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <div className="w-32">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
                      <input required type="number" value={item.unitPrice} onChange={e => handleLineItemChange(idx, 'unitPrice', e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <div className="w-32">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Total</label>
                      <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-700 font-medium">{formData.currency} {item.total.toFixed(2)}</div>
                    </div>
                    <button type="button" onClick={() => removeLineItem(idx)} className="p-2 text-gray-400 hover:text-red-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Invoice Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Due Date</label>
                  <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tax Rate (%)</label>
                  <input type="number" value={formData.taxRate} onChange={e => setFormData({...formData, taxRate: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
                  <textarea rows="3" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formData.currency} {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax ({formData.taxRate}%)</span>
                <span>{formData.currency} {taxAmount.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>{formData.currency} {total.toFixed(2)}</span>
              </div>
              
              <div className="pt-4 flex flex-col gap-2">
                <button type="submit" className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50">Save as Draft</button>
                <button type="button" onClick={(e) => handleSubmit(e, true)} className="w-full py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-100">Save and Send</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <button onClick={handleCreateNew} className="px-4 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 shadow-lg shadow-teal-100">
          Create Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Total Invoices</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Sent</p>
          <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Paid</p>
          <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Outstanding</p>
          <p className="text-2xl font-bold text-teal-600">ZAR {stats.outstanding.toFixed(2)}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {['all', 'draft', 'sent', 'paid', 'overdue'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${filter === s ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400">Loading invoices...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-200">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No invoices found</h3>
            <p className="text-sm text-gray-500 max-w-xs">When you complete an appointment, a draft invoice is created automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Invoice #</th>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map(inv => (
                  <tr key={inv._id} onClick={() => openInvoicePanel(inv)} className="hover:bg-gray-50 cursor-pointer transition-colors group">
                    <td className="px-6 py-4 font-bold text-teal-600">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{inv.clientName}</p>
                      <p className="text-xs text-gray-500">{inv.clientEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {inv.dueDate ? format(new Date(inv.dueDate), 'MMM d, yyyy') : 'Upon Receipt'}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {inv.currency} {inv.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        inv.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                        inv.status === 'sent' ? 'bg-blue-100 text-blue-600' :
                        inv.status === 'paid' ? 'bg-green-100 text-green-600' :
                        inv.status === 'overdue' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-400 line-through'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex justify-end gap-2 flex-wrap">
                        <button
                          onClick={() => handleDownload(inv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF
                        </button>
                        {inv.status === 'draft' && (
                          <button
                            onClick={() => handleSend(inv)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" /> Send
                          </button>
                        )}
                        {(inv.status === 'draft' || inv.status === 'sent') && (
                          <button
                            onClick={() => handleUpdateStatus(inv, 'paid')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md text-green-600 bg-green-50 hover:bg-green-100 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Mark Paid
                          </button>
                        )}
                        {inv.status === 'draft' && (
                          <button
                            onClick={() => handleDelete(inv)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Panel */}
      {isPanelOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" onClick={() => setIsPanelOpen(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedInvoice.invoiceNumber}</h2>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                  selectedInvoice.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                  selectedInvoice.status === 'sent' ? 'bg-blue-100 text-blue-600' :
                  selectedInvoice.status === 'paid' ? 'bg-green-100 text-green-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {selectedInvoice.status}
                </span>
              </div>
              <button onClick={() => setIsPanelOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Client</h3>
                <p className="font-bold text-gray-900">{selectedInvoice.clientName}</p>
                <p className="text-sm text-gray-600">{selectedInvoice.clientEmail}</p>
                <p className="text-sm text-gray-600">{selectedInvoice.clientPhone || 'No phone'}</p>
              </section>

              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Items</h3>
                <div className="space-y-2">
                  {selectedInvoice.lineItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.description} (x{item.quantity})</span>
                      <span className="font-medium text-gray-900">{selectedInvoice.currency} {item.total.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Subtotal</span>
                      <span>{selectedInvoice.currency} {selectedInvoice.subtotal.toFixed(2)}</span>
                    </div>
                    {selectedInvoice.taxRate > 0 && (
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Tax ({selectedInvoice.taxRate}%)</span>
                        <span>{selectedInvoice.currency} {selectedInvoice.taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-gray-900 pt-2">
                      <span>Total</span>
                      <span>{selectedInvoice.currency} {selectedInvoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </section>

              {selectedInvoice.notes && (
                <section>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Notes</h3>
                  <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg">"{selectedInvoice.notes}"</p>
                </section>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex flex-col gap-3">
              <button
                onClick={() => handleDownload(selectedInvoice)}
                className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
              {selectedInvoice.status === 'draft' && (
                <button
                  onClick={() => handleSend(selectedInvoice)}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Email Invoice to Client
                </button>
              )}
              {(selectedInvoice.status === 'draft' || selectedInvoice.status === 'sent') && (
                <button
                  onClick={() => handleUpdateStatus(selectedInvoice, 'paid')}
                  className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Mark as Paid
                </button>
              )}
              {(selectedInvoice.status === 'sent' || selectedInvoice.status === 'overdue') && (
                <button
                  onClick={() => handleUpdateStatus(selectedInvoice, 'cancelled')}
                  className="w-full py-3 bg-white border border-red-200 text-red-500 font-medium rounded-xl hover:bg-red-50 flex items-center justify-center gap-2 text-sm"
                >
                  Void Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;
