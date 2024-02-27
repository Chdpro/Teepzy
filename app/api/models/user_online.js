const mongoose = require('mongoose');
//Define a schema
const Schema = mongoose.Schema;
const OnlineSchema = new Schema({
    userId: {
        type: String,
        trim: true,
        required: true,
    },
    isOnline: {
        type: String,
        trim: true,
        default: true
    },
    onlineDate: {
        type: Date,
        trim: true,
        required: true
    },
    adress: {},
  
    


});
module.exports = mongoose.model('Online', OnlineSchema)