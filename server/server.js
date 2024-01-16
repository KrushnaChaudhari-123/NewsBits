const express = require('express');
const cors = require('cors');
const connection = require('./DB/conn');
const User = require('./DB/model/userModel');
const bcrypt = require('bcrypt');
const razorpay = require('./Routes/Subscription');
const NewsItem = require('./DB/model/favItem');
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
            return res.json({ status: "failed", message: "Invalid amount" });
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
            return res.json({ status: "failed", message: "Failed to change USer Status" })
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
function compareDates(currentDate, subscriptionDateString, amount) {
    // Convert the subscription date string to a Date object
    const subscriptionDate = new Date(subscriptionDateString);

    // Calculate the duration based on the amount
    let duration;
    if (amount === 50) {
        duration = 30; // 30 days for 1 month
    } else if (amount === 200) {
        duration = 180; // 180 days for 6 months
    } else if (amount === 300) {
        duration = 365; // 365 days for 1 year
    } else {
        // Handle other amounts as needed
        return "Invalid amount";
    }

    // Calculate the expiration date
    const expirationDate = new Date(subscriptionDate);
    expirationDate.setDate(subscriptionDate.getDate() + duration);

    // Compare with the current date
    const currentDateObject = new Date(currentDate);
    if (currentDateObject < expirationDate) {
        return true;
    } else {
        return false;
    }
}

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).lean();

        if (!user) {
            return res.json({ status: 'error', error: 'Invalid username or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log(passwordMatch);

        if (passwordMatch) {
            const checkSubs = await transactionDB.find({ userId: user._id });

            if (checkSubs && checkSubs.length > 0) {
                const lastSubs = checkSubs.pop();
                const susbsAmount = lastSubs.ammount;
                const timestamp = lastSubs.timestamp;
                const currentDate = new Date();
                const result = compareDates(currentDate, timestamp, susbsAmount);

                if (!result) {
                    return res.json({ status: 'ok', email, isAdmin: true, user, result });
                } else {
                    return res.json({ status: 'ok', email, isAdmin: false, user, result });
                }
            } else {
                // Handle case where no subscriptions are found
                return res.json({ status: 'ok', email, isAdmin: false, user, result: false });
            }
        } else {
            return res.json({ status: 'error', error: 'Invalid username or password' });
        }
    } catch (err) {
        console.error(err);
        return res.json({ status: 'error', error: 'Invalid username or password' });
    }
});


app.post('/api/addToFav', async (req, res) => {
    let { title, description, imageUrl, newsUrl, author, date, source, userId } = req.body;
    console.log(req.body);
    try {
        const findItem = await NewsItem.findOne({ newsUrl: newsUrl });
        if (findItem) {
            const response = await NewsItem.deleteOne({ userId: userId });

            if (response) {
                return res.json({ status: "ok", message: "sucess" });
            }
        }
        const response = await NewsItem.create({ title, description, imageUrl, newsUrl, author, date, source, userId });

        if (response) {
            return res.json({ status: "ok", message: "sucess" });
        }
    } catch (error) {
        return res.status(500).json({ status: "failed", message: "internal Server Error" })
    }
})

app.post('/api/checkFav', async (req, res) => {
    const { newsUrl } = req.body;
    try {
        const findItem = await NewsItem.findOne({ newsUrl: newsUrl });
        if (findItem) {
            return res.json({ status: "ok", message: "sucess" });
        }
        return res.json({ status: "failed" });
    } catch (err) {
        return res.status(500).json({ status: "failed", message: "internal Server Error" })
    }
})

app.post('/api/getFav', async (req, res) => {
    const { userId } = req.body;
    try {
        let response = await NewsItem.find({}).lean();
        //console.log(response);
        if (response == []) {
            return res.json({ status: "ok", data: "No favourites Yet" });
        }
        response = response.filter(item => {
            console.log(userId, item.userId);
            return item.userId == userId
        });
        // console.log(response);
        if (response) {
            return res.json({ status: "ok", message: "sucess", data: response });
        }
        return res.json({ status: "failed", message: "couldn't fetch data" })
    } catch (error) {
        return res.json({ status: "failed", message: "Internal server error" })
    }
})
app.post('/', razorpay);

app.listen(8080, () => console.log('Server running on 8080'));
