const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const RoomSchema = new Schema({

    userId: {
        type: String,
        trim: true,
        required: true,
    },
    name: {
        type: String,
        trim: true,
        required: true,
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

    messages: [],

    connectedUsers: [],
    
    createdAt: {
        type: Date,
        default: Date.now
    },

});


module.exports = mongoose.model('Room', RoomSchema);