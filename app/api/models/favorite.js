const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const FavoriteSchema = new Schema({
    userId: {
        type: String,
        trim: true,
        required: true,
    },
    postId: {
        type: String,
        trim: true,
        required: true,
    },
    type: {
        type: String,
        trim: true,
        required: true,
        enum: ['MESSAGE', 'POST', 'COMMENT'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    
});


module.exports = mongoose.model('Favorite', FavoriteSchema);