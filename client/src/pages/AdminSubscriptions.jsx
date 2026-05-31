import { useState, useEffect } from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/subscriptions').then(({ data }) => {
      setSubscriptions(data.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const getStatusBadge = (status) => {
    const map = {
      active: 'bg-green-100 text-green-700',
      expired: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-600',
    }
    return map[status] || 'bg-gray-100 text-gray-600'
  }

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    expired: subscriptions.filter(s => s.status === 'expired').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">All user subscriptions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <p className="text-gray-500 text-sm">Total Subscriptions</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <p className="text-green-600 text-sm">Active</p>
            <p className="text-3xl font-bold text-green-700 mt-1">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <p className="text-red-600 text-sm">Expired / Cancelled</p>
            <p className="text-3xl font-bold text-red-700 mt-1">{stats.expired}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading subscriptions...</div>
          ) : subscriptions.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No subscriptions found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-gray-600 font-semibold">User</th>
                    <th className="text-left px-6 py-3 text-gray-600 font-semibold">Plan</th>
                    <th className="text-left px-6 py-3 text-gray-600 font-semibold">Price</th>
                    <th className="text-left px-6 py-3 text-gray-600 font-semibold">Start Date</th>
                    <th className="text-left px-6 py-3 text-gray-600 font-semibold">End Date</th>
                    <th className="text-left px-6 py-3 text-gray-600 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subscriptions.map((sub) => (
                    <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{sub.user_id?.name}</p>
                        <p className="text-gray-400 text-xs">{sub.user_id?.email}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">{sub.plan_id?.name}</td>
                      <td className="px-6 py-4 text-gray-700">${sub.plan_id?.price}</td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(sub.start_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(sub.end_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(sub.status)}`}>
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
