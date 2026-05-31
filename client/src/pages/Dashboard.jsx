import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/authStore'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  const { user } = useAuthStore()
  const [subscription, setSubscription] = useState(undefined) // undefined = loading
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/my-subscription').then(({ data }) => {
      setSubscription(data.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const getDaysLeft = (endDate) => {
    const diff = new Date(endDate) - new Date()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const getStatusColor = (status) => {
    if (status === 'active') return 'bg-green-100 text-green-700'
    if (status === 'expired') return 'bg-red-100 text-red-700'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name}!</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">
            Loading your subscription...
          </div>
        ) : subscription ? (
          <div className="space-y-6">
            {/* Active Plan Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{subscription.plan_id.name} Plan</h2>
                  <p className="text-gray-500 text-sm mt-1">Your current subscription</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(subscription.status)}`}>
                  {subscription.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-blue-600 text-sm font-medium">Monthly Price</p>
                  <p className="text-2xl font-bold text-blue-800 mt-1">${subscription.plan_id.price}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-green-600 text-sm font-medium">Days Remaining</p>
                  <p className="text-2xl font-bold text-green-800 mt-1">{getDaysLeft(subscription.end_date)} days</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-purple-600 text-sm font-medium">Renews On</p>
                  <p className="text-lg font-bold text-purple-800 mt-1">
                    {new Date(subscription.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Plan Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {subscription.plan_id.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500 font-bold">✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link to="/plans" className="text-blue-600 hover:underline text-sm font-medium">
                Upgrade or change your plan →
              </Link>
            </div>
          </div>
        ) : (
          /* No subscription */
          <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-200 p-16 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Active Subscription</h2>
            <p className="text-gray-500 mb-6">You don't have any active plan. Choose one to get started!</p>
            <Link
              to="/plans"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors inline-block"
            >
              View Plans
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
