const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const ContactSchema = new Schema({
    idContactHolder: {
        type: String,
        trim: true,
        required: true,
    },
    fullname: {
        type: String,
        trim: true,
        default: false
    },
    phone: {
        type: String,
        trim: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },


});


module.exports = mongoose.model('Contact', ContactSchema);