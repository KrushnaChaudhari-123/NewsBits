const express = require('express');
const cors = require('cors');
const connection = require('./DB/conn');
const User = require('./DB/model/userModel');
const bcrypt = require('bcrypt');
const razorpay = require('./Routes/Subscription');
const app = express();
app.use(cors());
app.use(express.json());
connection();
const Razorpay = require('razorpay');
const shortid = require("shortid");
require('dotenv').config();
const transactionDB = require("./DB/model/transactionDB");

app.post('/api/saveOrder', async (req, res) => {
    try {
        const { paymentId, userId, ammount } = req.body;

        let expiryDate = new Date(); // Initialize with the current date

        if (ammount == 50) {
            // Add 30 days
            expiryDate.setDate(expiryDate.getDate() + 30);
        } else if (ammount == 200) {
            // Add 6 months
            expiryDate.setMonth(expiryDate.getMonth() + 6);
        } else if (ammount == 300) {
            // Add 1 year
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        } else {
            // Handle other cases as needed
            return res.json({ status: "failed", message: "Invalid ammount" });
        }

        const response = await transactionDB.create({ paymentId, userId, ammount, expiryDate });
        console.log(response);
        if (!response) {
            return res.json({ status: "failed", message: "Could not save transaction" });
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { isAdmin: true },
            { new: true }
          );
          console.log(updatedUser);
        if (updatedUser) {
            return res.json({ status: "ok", message: "success" });
        } else {
            return res.json({status: "failed", message: "Failed to change USer Status"})
        }

        
    } catch (error) {
        return res.status(500).json({ status: "failed", message: "Internal server error" });
    }
});



app.post('/api/razorpay', async (req, res) => {
    try {
        const razorpayInstance = new Razorpay({
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
            const response = await razorpayInstance.orders.create(options);
            res.status(200).json({
                id: response.id,
                currency: response.currency,
                amount: response.amount,
            });
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" });
    }
});




app.post('/api/register', async (req, res) => {
    let { username, password, firstname, lastname, dateofbirth, mothername, isAdmin } = req.body;
    console.log("helloo", req.body);
    if (!username || typeof username !== 'string') {
        return res.json({ status: 'error', error: 'Invalid Username' });
    }
    if (!password || typeof password !== 'string') {
        return res.json({ status: 'error', error: 'Invalid Password' });
    }
    if (!firstname || typeof firstname !== 'string') {
        return res.json({ status: 'error', error: 'Invalid first name' });
    }
    if (!lastname || typeof lastname !== 'string') {
        return res.json({ status: 'error', error: 'Invalid last name' });
    }
    if (password.length < 8) {
        return res.json({
            status: 'error',
            error: 'Invalid password length, should be at least 8 characters'
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const response = await User.create({
            firstname,
            lastname,
            email: username,
            password: hashedPassword,
            dateofbirth,
            mothername,
            isAdmin
        });
        console.log('User created Successfully', response);
        res.json({ status: 'ok', data: 'Success' });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.json({ status: 'error', error: error.errmsg.split(':')[0] });
        }
        throw error;
    }
});

app.post('/api/login', async (req, res) => {
    let { email, password } = req.body;
    console.log(email, password);
    try {
        const user = await User.findOne({ email }).lean();
        console.log(user);

        if (!user) {
            return res.json({ status: 'error', error: 'Invalid username or password' })
        }
        //comp(password, user.password);
        if (await bcrypt.compare(password, user.password)) {
            //correct password
            if (user.hasOwnProperty("isAdmin")) {
                return res.json({ status: 'ok', email: email, isAdmin: true, user: user })
            } else {
                return res.json({ status: 'ok', email: email, isAdmin: false, user: user })
            }
        } else {
            return res.json({ status: 'error', error: 'Invalid username or password' });
        }
    } catch (err) {
        //console.error(JSON.stringify(err));
        return res.json({ status: 'error', error: 'Invalid username or password' });
    }
});

app.post('/', razorpay);

app.listen(8080, () => console.log('Server running on 8080'));
