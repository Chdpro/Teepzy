const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const RePostSchema = new Schema({
    fromId: {
        type: String,
        trim: true,
        required: true,
    },
    reposterId: {
        type: String,
        trim: true,
        required: true,
    },
    postId: {
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
    image_url: {
        type: String,
        trim: true,
    },
    productId: {
        type: String,
        trim: true
    },
    isDelete: {
        type: Boolean,
        trim: true,
        default: false
    },
    comment: [

    ],
    views: [

    ],
    includedUsers: [
        String
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        trim: true
    },

});


module.exports = mongoose.model('RePost', RePostSchema);