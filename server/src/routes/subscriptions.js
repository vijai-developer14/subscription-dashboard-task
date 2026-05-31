const express = require('express');
const router = express.Router();
const { getPlans, subscribe, getMySubscription, getAllSubscriptions } = require('../controllers/subscriptionController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/plans', getPlans);
router.post('/subscribe/:planId', protect, subscribe);
router.get('/my-subscription', protect, getMySubscription);
router.get('/admin/subscriptions', protect, adminOnly, getAllSubscriptions);

module.exports = router;
