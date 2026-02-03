import { useState } from 'react';
import invoiceService from '../../services/invoiceService';

const InvoiceDetails = ({ invoice, customerName, propertyLabel, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      void: 'bg-red-100 text-red-800',
    };
    return badges[status] || badges.draft;
  };

  const handleStatusChange = async (newStatus) => {
    if (window.confirm(`Change invoice status to "${newStatus}"?`)) {
      try {
        setLoading(true);
        await invoiceService.updateStatus(invoice.invoice_id, newStatus);
        onUpdate();
        onClose();
      } catch (err) {
        alert(err.response?.data?.detail || 'Failed to update status');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl m-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Invoice #{invoice.invoice_id}</h2>
            <span className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(invoice.status)}`}>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Customer Information</h3>
            <p className="text-lg font-medium text-gray-900">{customerName}</p>
            <p className="text-sm text-gray-600 mt-1">Property: {propertyLabel}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Dates</h3>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-gray-600">Issue Date:</span>{' '}
                <span className="font-medium">{formatDate(invoice.issued_date)}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Due Date:</span>{' '}
                <span className="font-medium">{formatDate(invoice.due_date)}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Period:</span>{' '}
                <span className="font-medium">
                  {formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Amount Breakdown */}
        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">{formatCurrency(invoice.tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total:</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Notes</h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{invoice.notes}</p>
          </div>
        )}

        {/* Status Actions */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Change Status</h3>
          <div className="flex gap-2">
            {invoice.status !== 'sent' && (
              <button
                onClick={() => handleStatusChange('sent')}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                Mark as Sent
              </button>
            )}
            {invoice.status !== 'paid' && (
              <button
                onClick={() => handleStatusChange('paid')}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
              >
                Mark as Paid
              </button>
            )}
            {invoice.status !== 'void' && (
              <button
                onClick={() => handleStatusChange('void')}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
              >
                Void Invoice
              </button>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
