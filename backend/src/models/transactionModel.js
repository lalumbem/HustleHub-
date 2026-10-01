const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
        gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true, index: true },
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        amount: { type: Number, required: true, min: 0.01, max: 999999.99 }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
