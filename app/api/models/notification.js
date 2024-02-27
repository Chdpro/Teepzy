const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const NotificationSchema = new Schema({
    type: {
        type: String,
        trim: true,
        required: true,
        enum: ['SHARE', 'INVITATION', 'COMMENT', 'FAVORITE', 'LINK', 'MESSAGE', 'POST', 'MENTION'],
    },
    userConcernId: {
        type: String,
        trim: true,
        required: true
    },  
    fromId: {
        type: String,
        trim: true,
        required: true
    },
    toId: {
        type: String,
        trim: true,
        required: true
    },
    icon_name: {
        type: String,
        trim: true,
        required: true
    },
    message: {
        type: String,
        trim: true,
        required: true
    },
    
    retourLink: {
        type: Boolean,
        trim: true,
        default: false
    },
    postId: {
        type: String,
        trim: true,
    },

    roomId: {
        type: String,
        trim: true,
    },
    linkerId: {
        type: String,
        trim: true,
    },
    linkSenderId: {
        type: String,
        trim: true,
    },
    isRead: {
        type: Boolean,
        trim: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },


});


module.exports = mongoose.model('Notification', NotificationSchema);