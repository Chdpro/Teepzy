const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const CircleSchema = new Schema({
    idCreator: {
        type: String,
        trim: true,
        required: true,
    },
    typeFriend: {
        type: Boolean,
        trim: true,
        default: false
    },
    membersFriends: [

    ],
 
});


module.exports = mongoose.model('Circle', CircleSchema);