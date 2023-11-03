const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const shortid = require("shortid");
require('dotenv').config();

router.post('/api/razorpay', async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const payment_capture = 1;
        const amount = 499;
        const currency = "INR";
        const options = {
            amount: (amount * 100).toString(),
            currency,
            receipt: shortid.generate(),
            payment_capture,
        };
        try {
            const response = await razorpay.orders.create(options);
            res.status(200).json({
                id: response.id,
                currency: response.currency,
                amount: response.amount,
            });
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
        return res.json({ staus: "ok", message: "success" })
    } catch (error) {
        return res.json({ status: "failed", messsage: "Internal Server Error" })
    }
});


module.exports = router;