const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
        description: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
        category: { type: String, required: true, trim: true, maxlength: 60 },
        price: { type: Number, required: true, min: 0.01, max: 999999.99 },
        freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Gig', gigSchema);
