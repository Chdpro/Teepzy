const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const MobileVersionSchema = new Schema({
    numero: {
        type: String,
        trim: true,
        required: true,
    },
    platform: {
        type: String,
        trim: true,
        default: "android"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },


});


module.exports = mongoose.model('MobileVersion', MobileVersionSchema);