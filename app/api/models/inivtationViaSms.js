const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InviteViaSmsSchema = new Schema({
    senderId: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    invited: {
        type: Boolean,
        trim: true,
        default: false
    },
    accept: {
        type: Boolean,
        trim: true,
        default: false
    },
    typeLink: {
        type: String,
        enum: ['PRO', 'AMICAL'],
        trim: true,
        default: "AMICAL"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },



});


module.exports = mongoose.model('InvitationSms', InviteViaSmsSchema);
