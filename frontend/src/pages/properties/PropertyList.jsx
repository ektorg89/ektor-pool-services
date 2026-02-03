import { useState, useEffect } from 'react';
import propertyService from '../../services/propertyService';
import customerService from '../../services/customerService';
import PropertyForm from './PropertyForm';
import DeleteModal from '../../components/DeleteModal';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  
  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [formMode, setFormMode] = useState('create');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [propertiesData, customersData] = await Promise.all([
        propertyService.getAll(),
        customerService.getAll()
      ]);
      setProperties(propertiesData);
      setCustomers(customersData);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (e) => {
    const customerId = e.target.value;
    setSelectedCustomerId(customerId);
    
    try {
      setLoading(true);
      const data = await propertyService.getAll(customerId || null);
      setProperties(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to filter properties');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setFormMode('create');
    setSelectedProperty(null);
    setShowForm(true);
  };

  const handleEditClick = (property) => {
    setFormMode('edit');
    setSelectedProperty(property);
    setShowForm(true);
  };

  const handleDeleteClick = (property) => {
    setSelectedProperty(property);
    setShowDeleteModal(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchData();
  };

  const handleDeleteConfirm = async () => {
    try {
      await propertyService.delete(selectedProperty.property_id);
      setShowDeleteModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete property');
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.customer_id === customerId);
    return customer ? `${customer.first_name} ${customer.last_name}` : 'Unknown';
  };

  if (loading && properties.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Properties</h1>
          <p className="text-gray-600 mt-1">Manage customer properties</p>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Property
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-4">
          <label htmlFor="customerFilter" className="text-sm font-medium text-gray-700">
            Filter by Customer:
          </label>
          <select
            id="customerFilter"
            value={selectedCustomerId}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Customers</option>
            {customers.map(customer => (
              <option key={customer.customer_id} value={customer.customer_id}>
                {customer.first_name} {customer.last_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Label
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No properties found. Click "Add Property" to create one.
                </td>
              </tr>
            ) : (
              properties.map((property) => (
                <tr key={property.property_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {property.property_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {property.label}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>{property.address1}</div>
                    {property.address2 && <div className="text-gray-500">{property.address2}</div>}
                    {property.city && property.state && (
                      <div className="text-gray-500">{property.city}, {property.state} {property.postal_code}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getCustomerName(property.customer_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      property.is_active === 1 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {property.is_active === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditClick(property)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(property)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Property count */}
      <div className="mt-4 text-sm text-gray-600">
        Total properties: {properties.length}
      </div>

      {/* Modals */}
      {showForm && (
        <PropertyForm
          mode={formMode}
          property={selectedProperty}
          customers={customers}
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          title="Delete Property"
          message={`Are you sure you want to delete "${selectedProperty?.label}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default PropertyList;
