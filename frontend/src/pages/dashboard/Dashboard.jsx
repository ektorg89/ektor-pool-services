import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import customerService from '../../services/customerService';
import propertyService from '../../services/propertyService';
import api from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeProperties: 0,
    pendingInvoices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [customers, properties, invoices] = await Promise.all([
        customerService.getAll(),
        propertyService.getAll(),
        api.get('/api/v1/invoices').then(res => res.data),
      ]);

      const activeProps = properties.filter(p => p.is_active === 1).length;
      const pendingInvs = invoices.filter(inv => 
        inv.status === 'sent' || inv.status === 'draft'
      ).length;

      setStats({
        totalCustomers: customers.length,
        activeProperties: activeProps,
        pendingInvoices: pendingInvs,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome, {user?.username}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Customers</p>
              {loading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-2"></div>
              ) : (
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.totalCustomers}
                </p>
              )}
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Properties</p>
              {loading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-2"></div>
              ) : (
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.activeProperties}
                </p>
              )}
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Invoices</p>
              {loading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-2"></div>
              ) : (
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.pendingInvoices}
                </p>
              )}
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Status</h2>
        <ul className="space-y-2 text-gray-600">
          <li> Authentication & Authorization</li>
          <li> Backend API (FastAPI + MySQL + Docker)</li>
          <li> Customers Module (Full CRUD)</li>
          <li> Properties Module (Full CRUD)</li>
          <li> Dashboard with Real Stats</li>
          <li>→ Invoices Module (Next)</li>
          <li>→ Payments Module</li>
          <li>→ Production Deployment</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;