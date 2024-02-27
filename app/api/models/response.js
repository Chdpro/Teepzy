const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const ResponseSchema = new Schema({
    userId: {
        type: String,
        trim: true,
        required: true,
    },
    commentId: {
        type: String,
        trim: true,
        required: true,
    },
    userPhoto: {
        type: String,
        trim: true,
    },
    userPseudo: {
        type: String,
        trim: true,
        required: true,
    },
    comment: {
        type: String,
        trim: true,
        required: true,
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    },


});


module.exports = mongoose.model('Response', ResponseSchema);