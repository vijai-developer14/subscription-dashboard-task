const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json({ success: true, data: plans });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const subscribe = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user._id;

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    // Cancel any existing active subscription
    await Subscription.updateMany(
      { user_id: userId, status: 'active' },
      { status: 'cancelled' }
    );

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const subscription = await Subscription.create({
      user_id: userId,
      plan_id: plan._id,
      start_date: startDate,
      end_date: endDate,
      status: 'active',
    });

    await subscription.populate('plan_id');
    res.status(201).json({ success: true, data: subscription });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

const getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user_id: req.user._id,
      status: 'active',
    }).populate('plan_id').sort({ createdAt: -1 });

    if (!subscription) {
      return res.json({ success: true, data: null, message: 'No active subscription' });
    }

    // Auto-expire if past end date
    if (new Date() > subscription.end_date) {
      subscription.status = 'expired';
      await subscription.save();
      return res.json({ success: true, data: null, message: 'Subscription expired' });
    }

    res.json({ success: true, data: subscription });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate('user_id', 'name email')
      .populate('plan_id', 'name price')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: subscriptions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getPlans, subscribe, getMySubscription, getAllSubscriptions };
