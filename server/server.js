const express = require('express');
const cors = require('cors');
const connection = require('./DB/conn');
const User = require('./DB/model/userModel');
const bcrypt = require('bcrypt');
const app = express();
app.use(cors());
app.use(express.json());
connection();

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

app.post('/api/login', async(req, res) => {
    let {email, password} = req.body;
    console.log(email, password);
    try {
        const user = await User.findOne({email}).lean();
        console.log(user);

        if (!user) {
            return res.json({status: 'error', error: 'Invalid username or password'})
        }
        //comp(password, user.password);
        if (await bcrypt.compare(password, user.password)) {
            //correct password
            if (user.hasOwnProperty("isAdmin")) {
                return res.json({status: 'ok', email: email, isAdmin: true, user: user })
            } else {
                return res.json({status: 'ok', email: email, isAdmin: false, user: user})
            }
        } else {
            return  res.json({status: 'error', error: 'Invalid username or password'});
        }
    } catch (err) {
        //console.error(JSON.stringify(err));
        return  res.json({status: 'error', error: 'Invalid username or password'});
    }    
});

app.listen(8080, () => console.log('Server running on 8080'));
