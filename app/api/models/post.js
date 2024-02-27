const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const PostSchema = new Schema({
    userId: {
        type: String,
        trim: true,
        required: true,
    },

    userPhoto_url: {
        type: String,
        trim: true,
    },
    userPseudo: {
        type: String,
        trim: true,
        required: true,
    },
    content: {
        type: String,
        trim: true,
        required: true,
    },
    backgroundColor: {
        type: String,
        trim: true,
    },
    isDelete: {
        type: Boolean,
        trim: true,
        default: false
    },
    image_url: {
        type: String,
        trim: true,
    },
    commercialAction: {
        type: String,
        trim: true,
        enum: ["VENTE", "ECHANGE", "DON"]
    },
    productId: {
        type: String,
        trim: true,
    },
    price: {
        type: String,
        trim: true,
    },
    video_url: {
        type: String,
        trim: true,
    },
    comment: [

    ],
    includedUsers: [
        String
    ],
    views: [

    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        trim: true
    },
    matches: [

    ]

});

PostSchema.index({ '$**': 'text' });


module.exports = mongoose.model('Post', PostSchema);