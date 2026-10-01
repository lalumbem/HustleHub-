const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true, index: true },
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        status: { type: String, enum: ['confirmed'], default: 'confirmed', required: true }
    },
    { timestamps: true }
);

bookingSchema.index({ gigId: 1, clientId: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
