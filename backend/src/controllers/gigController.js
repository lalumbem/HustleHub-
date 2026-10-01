const mongoose = require('mongoose');
const Gig = require('../models/gigModel');

const getAllGigs = async (req, res, next) => {
    try {
        const gigs = await Gig.find().sort({ createdAt: -1 }).lean();
        return res.status(200).json({ gigs: gigs.map(formatGig) });
    } catch (error) {
        next(error);
    }
};

const getGigById = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json({ message: 'Gig not found.' });
        }
        const gig = await Gig.findById(req.params.id).lean();
        if (!gig) return res.status(404).json({ message: 'Gig not found.' });
        return res.status(200).json({ gig: formatGig(gig) });
    } catch (error) {
        next(error);
    }
};

const getMyGigs = async (req, res, next) => {
    try {
        const gigs = await Gig.find({ freelancerId: req.user.id }).sort({ createdAt: -1 }).lean();
        return res.status(200).json({ gigs: gigs.map(formatGig) });
    } catch (error) {
        next(error);
    }
};

const createGig = async (req, res, next) => {
    try {
        const { title, description, category, price } = req.body;
        const gig = await Gig.create({
            title,
            description,
            category,
            price,
            freelancerId: req.user.id
        });
        return res.status(201).json({ message: 'Gig created successfully.', gig: formatGig(gig.toObject()) });
    } catch (error) {
        next(error);
    }
};

const updateGig = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json({ message: 'Gig not found.' });
        }

        const gig = await Gig.findById(req.params.id);
        if (!gig) return res.status(404).json({ message: 'Gig not found.' });

        if (gig.freelancerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You do not have permission to modify this gig.' });
        }

        const allowed = ['title', 'description', 'category', 'price'];
        for (const field of allowed) {
            if (req.body[field] !== undefined) gig[field] = req.body[field];
        }
        await gig.save();

        return res.status(200).json({ message: 'Gig updated successfully.', gig: formatGig(gig.toObject()) });
    } catch (error) {
        next(error);
    }
};

const deleteGig = async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json({ message: 'Gig not found.' });
        }

        const gig = await Gig.findById(req.params.id);
        if (!gig) return res.status(404).json({ message: 'Gig not found.' });

        if (gig.freelancerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You do not have permission to delete this gig.' });
        }

        await Gig.deleteOne({ _id: gig._id });
        return res.status(200).json({ message: 'Gig deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

function formatGig(gig) {
    return {
        id: gig._id.toString(),
        title: gig.title,
        description: gig.description,
        category: gig.category,
        price: gig.price,
        freelancerId: gig.freelancerId.toString(),
        createdAt: gig.createdAt
    };
}

module.exports = { getAllGigs, getGigById, getMyGigs, createGig, updateGig, deleteGig };
