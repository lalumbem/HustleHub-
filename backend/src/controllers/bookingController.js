const mongoose = require('mongoose');
const Booking = require('../models/bookingModel');
const Transaction = require('../models/transactionModel');
const Gig = require('../models/gigModel');

const createBooking = async (req, res, next) => {
    try {
        const { gigId } = req.body;
        if (!mongoose.isValidObjectId(gigId)) {
            return res.status(404).json({ message: 'Gig not found.' });
        }

        const gig = await Gig.findById(gigId).lean();
        if (!gig) return res.status(404).json({ message: 'Gig not found.' });

        if (gig.freelancerId.toString() === req.user.id) {
            return res.status(400).json({ message: 'You cannot book your own gig.' });
        }

        const existing = await Booking.findOne({ gigId: gig._id, clientId: req.user.id }).lean();
        if (existing) {
            return res.status(409).json({ message: 'You have already booked this gig.' });
        }

        const booking = await Booking.create({
            gigId: gig._id,
            clientId: req.user.id,
            freelancerId: gig.freelancerId,
            status: 'confirmed'
        });

        const transaction = await Transaction.create({
            bookingId: booking._id,
            gigId: gig._id,
            clientId: req.user.id,
            freelancerId: gig.freelancerId,
            amount: gig.price
        });

        return res.status(201).json({
            message: 'Booking confirmed (simulated payment).',
            booking: formatBooking(booking.toObject()),
            transaction: formatTransaction(transaction.toObject())
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ message: 'You have already booked this gig.' });
        }
        next(error);
    }
};

const getMyBookings = async (req, res, next) => {
    try {
        const filter = req.user.role === 'client'
            ? { clientId: req.user.id }
            : { freelancerId: req.user.id };

        const bookings = await Booking.find(filter).sort({ createdAt: -1 }).lean();
        const response = { bookings: bookings.map(formatBooking) };

        if (req.user.role === 'freelancer') {
            const transactions = await Transaction.find({ freelancerId: req.user.id }).sort({ createdAt: -1 }).lean();
            response.transactions = transactions.map(formatTransaction);
            response.totalIncome = Number(transactions.reduce((sum, item) => sum + item.amount, 0).toFixed(2));
        }

        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

function formatBooking(booking) {
    return {
        id: booking._id.toString(),
        gigId: booking.gigId.toString(),
        clientId: booking.clientId.toString(),
        freelancerId: booking.freelancerId.toString(),
        status: booking.status,
        createdAt: booking.createdAt
    };
}

function formatTransaction(transaction) {
    return {
        id: transaction._id.toString(),
        bookingId: transaction.bookingId.toString(),
        gigId: transaction.gigId.toString(),
        clientId: transaction.clientId.toString(),
        freelancerId: transaction.freelancerId.toString(),
        amount: transaction.amount,
        createdAt: transaction.createdAt
    };
}

module.exports = { createBooking, getMyBookings };
