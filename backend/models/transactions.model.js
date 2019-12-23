const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    clientID: { type: String, required: true },
    name: { type: String, required: true},
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    category: { type: Array, required: true },
}, {
    timestamps: true,
});

const Transactions = mongoose.model('Transactions', transactionSchema);

module.exports = Transactions;