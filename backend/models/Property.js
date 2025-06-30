const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    listingType: { type: String, enum: ['Buy', 'Rent'], required: true },
    images: { type: [String], default: [] },
    country: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    mapLink: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    size: { type: Number, required: true },
    price: { type: Number, required: true },
    contactName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    extras: {
        parking: { type: Boolean, default: false },
        gym: { type: Boolean, default: false },
        pool: { type: Boolean, default: false },
    },
    status: { type: String, enum: ['Available', 'Sold', 'Pending'], default: 'Available' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Property', PropertySchema);
