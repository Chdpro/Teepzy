const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    userId: {
        type: String,
        trim: true,
        required: true,
    },
    nom: {
        type: String,
        trim: true,
        required: true,
    },
    photo: [],
    description: {
        type: String,
        trim: true,
        required: true,
    },
    commercialAction: {
        type: String,
        trim: true,
        enum: ["VENTE", "ECHANGE", "DON"]
    },
    userPhoto_url: {
        type: String,
        trim: true,
    },
    isDelete: {
        type: Boolean,
        trim: true,
        default: false
    },
    userPseudo: {
        type: String,
        trim: true,
        required: true,
    },
    tags: [],

    price: {
        type: String,
        trim: true,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

ProductSchema.index({ '$**': 'text' });

module.exports = mongoose.model('Product', ProductSchema);