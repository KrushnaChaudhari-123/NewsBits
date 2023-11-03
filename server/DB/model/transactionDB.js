const mongoose = require('mongoose');

const transactionDB = mongoose.Schema({
    paymentId: {
        type: String, 
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    ammount: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: String,
        required: true
    }
}, { collection: 'transactionDB' });

const model = mongoose.model('transactionDB', transactionDB);



module.exports = model;