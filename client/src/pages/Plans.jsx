import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

export default function Plans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(null)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/plans').then(({ data }) => {
      setPlans(data.data)
      setLoading(false)
    })
  }, [])

  const handleSubscribe = async (planId) => {
    setSubscribing(planId)
    setMessage('')
    try {
      await api.post(`/subscribe/${planId}`)
      setMessage('Successfully subscribed!')
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Subscription failed')
    } finally {
      setSubscribing(null)
    }
  }

  const colors = ['blue', 'purple', 'green', 'orange']
  const colorMap = {
    blue: 'bg-blue-600 hover:bg-blue-700 border-blue-600',
    purple: 'bg-purple-600 hover:bg-purple-700 border-purple-600',
    green: 'bg-green-600 hover:bg-green-700 border-green-600',
    orange: 'bg-orange-500 hover:bg-orange-600 border-orange-500',
  }
  const badgeMap = {
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700 ring-2 ring-purple-400',
    green: 'bg-green-50 text-green-700',
    orange: 'bg-orange-50 text-orange-700',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="text-gray-500 mt-3 text-lg">Pick the plan that works best for you</p>
        </div>

        {message && (
          <div className={`mb-6 text-center p-3 rounded-lg text-sm font-medium ${message.includes('Successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading plans...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, idx) => {
              const color = colors[idx % colors.length]
              return (
                <div key={plan._id} className={`bg-white rounded-2xl shadow-sm border-2 p-6 flex flex-col ${idx === 1 ? 'border-purple-400 scale-105' : 'border-gray-100'}`}>
                  {idx === 1 && (
                    <div className="text-center mb-3">
                      <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
                    </div>
                  )}
                  <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                  <div className="mt-3 mb-5">
                    <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500 text-sm">/{plan.duration === 365 ? 'year' : 'month'}</span>
                  </div>

                  <ul className="space-y-2 flex-1 mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-green-500 font-bold">✓</span> {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan._id)}
                    disabled={subscribing === plan._id}
                    className={`w-full py-2.5 rounded-lg text-white font-semibold transition-colors disabled:opacity-60 ${colorMap[color]}`}
                  >
                    {subscribing === plan._id ? 'Processing...' : 'Subscribe'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
