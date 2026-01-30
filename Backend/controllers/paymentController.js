const Razorpay = require('razorpay');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Ticket = require('../models/Ticket');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Fallback for dev if not set
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret'
});

exports.createOrder = catchAsync(async (req, res, next) => {
    // Phase 2 registration fee
    const amount = 1000;
    const currency = 'INR';

    const options = {
        amount: amount * 100,
        currency,
        receipt: `receipt_phase2_${req.user.id}_${Date.now()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.status(200).json({
            status: 'success',
            order
        });
    } catch (error) {
        console.error("Razorpay Order Error:", error);

        // If it's an auth error or we are in dev, return a mock order to allow the flow to continue
        if (process.env.NODE_ENV !== 'production') {
            console.log("Creating Mock Order for Development...");
            res.status(200).json({
                status: 'success',
                order: {
                    id: `order_mock_${Date.now()}`,
                    entity: "order",
                    amount: options.amount,
                    amount_paid: 0,
                    amount_due: options.amount,
                    currency: "INR",
                    receipt: options.receipt,
                    status: "created",
                    attempts: 0,
                    notes: [],
                    created_at: Math.floor(Date.now() / 1000),
                    is_mock: true // Flag for frontend to know this is fake
                }
            });
            return;
        }

        return next(new AppError('Could not create payment order. Check server logs.', 500));
    }
});

exports.verifyPayment = catchAsync(async (req, res, next) => {
    // Used for webhook or manual verification if needed
    // The main flow will use client-side success handler to call updatePhase2
    const crypto = require('crypto');
    const secret = process.env.RAZORPAY_KEY_SECRET;

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
        // Payment valid
        // Update ticket logic here if using webhooks
        res.status(200).json({ status: 'ok' });
    } else {
        res.status(400).json({ status: 'invalid_signature' });
    }
});
