const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const SocialSchema = new Schema({

    icon: {
        type: String,
        trim: true,
        required: true,
    },
    nom: {
        type: String,
        trim: true,
        required: true,
    },
    url: {
        type: String,
        trim: true,
        required: true,
    },
    type: {
        type: String,
        trim: true,
        enum: ['PRO', 'AMICAL'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});


module.exports = mongoose.model('Social', SocialSchema);