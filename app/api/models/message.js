const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
    userId: {
        type: String,
        trim: true,
        required: true,
    },
    userFromId: {
        type: String,
        trim: true,
    },
    pseudo: {
        type: String,
        trim: true,
        required: true,
    },
    timeStamp: {
        type: Number,
        trim: true,
    },
    userPhoto_url: {
        type: String,
        trim: true,
    },
    text: {
        type: String,
        trim: true,
        required: true,
    },
    
    FromMessageText: {
        type: String,
        trim: true,
    },
    
    FromMessagePseudo: {
        type: String,
        trim: true,
    },
    isRead: {
        type: Boolean,
        trim: true,
        default: false
    },
    isReply: {
        type: Boolean,
        trim: true,
        default: false
    },
    isRoomArchiveByInitiator:{
        type: Boolean,
        trim: true,
        default: false
    },
    isRoomArchiveByConnectedUser:{
        type: Boolean,
        trim: true,
        default: false
    },
    messageRepliedId: {
        type: String,
        trim: true,
    },
    isTransfered: {
        type: Boolean,
        trim: true,
    },
    ReadByRecipients:[],
    
    roomId: {
        type: String,
        trim: true,
        required: true,
    },
    createdAt: {
        type: String,
        trim: true,
        required: true
    },

});


module.exports = mongoose.model('Message', MessageSchema);