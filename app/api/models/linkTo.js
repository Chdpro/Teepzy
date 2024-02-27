const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const LinkSchema = new Schema({
    idSender: {
        type: String,
        trim: true,
        required: true,
    },
    idReceiver: {
        type: String,
        trim: true,
        required: true,
    },
    senderPseudo: {
        type: String,
        trim: true,
        required: true,
    },
    typeLink: {
        type: String,
        enum: ['PRO', 'AMICAL'],
        trim: true,
        required: true,
        default: "AMICAL"
    },
    accept: {
        type: Boolean,
        trim: true,
        default: false
    },
    isLinked: {
        type: Boolean,
        trim: true,
        default: false
    },
    isDeleted: {
        type: Boolean,
        trim: true,
        default: false
    },
    message: {
        type: String,
        trim: true,
    },
    linkerId: {
        type: String,
        trim: true,
    },
    postId: {
        type: String,
        trim: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    
});


module.exports = mongoose.model('Link', LinkSchema);