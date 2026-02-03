import { useState } from 'react';
import invoiceService from '../../services/invoiceService';

const InvoiceForm = ({ customers, properties, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    property_id: '',
    period_start: '',
    period_end: '',
    issued_date: new Date().toISOString().split('T')[0],
    due_date: '',
    subtotal: '',
    tax: '',
    total: '',
    status: 'sent',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customerProperties, setCustomerProperties] = useState([]);

  const handleCustomerChange = (e) => {
    const customerId = parseInt(e.target.value);
    setFormData(prev => ({
      ...prev,
      customer_id: customerId,
      property_id: ''
    }));
    
    // Filter properties by selected customer
    const filtered = properties.filter(p => p.customer_id === customerId);
    setCustomerProperties(filtered);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };
    
    // Auto-calculate total when subtotal or tax changes
    if (name === 'subtotal' || name === 'tax') {
      const subtotal = parseFloat(name === 'subtotal' ? value : formData.subtotal) || 0;
      const tax = parseFloat(name === 'tax' ? value : formData.tax) || 0;
      newFormData.total = (subtotal + tax).toFixed(2);
    }
    
    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare data for API
    const submitData = {
      customer_id: parseInt(formData.customer_id),
      property_id: parseInt(formData.property_id),
      period_start: formData.period_start,
      period_end: formData.period_end,
      issued_date: formData.issued_date,
      due_date: formData.due_date || null,
      subtotal: parseFloat(formData.subtotal),
      tax: parseFloat(formData.tax),
      total: parseFloat(formData.total),
      status: formData.status,
      notes: formData.notes || null,
    };

    try {
      await invoiceService.create(submitData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl m-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Create Invoice</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer & Property */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700 mb-1">
                Customer *
              </label>
              <select
                id="customer_id"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleCustomerChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a customer</option>
                {customers.map(customer => (
                  <option key={customer.customer_id} value={customer.customer_id}>
                    {customer.first_name} {customer.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="property_id" className="block text-sm font-medium text-gray-700 mb-1">
                Property *
              </label>
              <select
                id="property_id"
                name="property_id"
                value={formData.property_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!formData.customer_id}
              >
                <option value="">Select a property</option>
                {customerProperties.map(property => (
                  <option key={property.property_id} value={property.property_id}>
                    {property.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Period Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="period_start" className="block text-sm font-medium text-gray-700 mb-1">
                Period Start *
              </label>
              <input
                type="date"
                id="period_start"
                name="period_start"
                value={formData.period_start}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="period_end" className="block text-sm font-medium text-gray-700 mb-1">
                Period End *
              </label>
              <input
                type="date"
                id="period_end"
                name="period_end"
                value={formData.period_end}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Issue & Due Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="issued_date" className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date *
              </label>
              <input
                type="date"
                id="issued_date"
                name="issued_date"
                value={formData.issued_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Amounts */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="subtotal" className="block text-sm font-medium text-gray-700 mb-1">
                Subtotal *
              </label>
              <input
                type="number"
                step="0.01"
                id="subtotal"
                name="subtotal"
                value={formData.subtotal}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label htmlFor="tax" className="block text-sm font-medium text-gray-700 mb-1">
                Tax *
              </label>
              <input
                type="number"
                step="0.01"
                id="tax"
                name="tax"
                value={formData.tax}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-1">
                Total *
              </label>
              <input
                type="number"
                step="0.01"
                id="total"
                name="total"
                value={formData.total}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                readOnly
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="void">Void</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;
