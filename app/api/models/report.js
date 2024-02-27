const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const ReportSchema = new Schema({
    userId: {
        type: String,
        trim: true,
        required: true,
    },
    postId: {
        type: String,
        trim: true,
    },
    reason: {
        type: String,
        trim: true,
        required: true,
    },
    isPending: {
        type: Boolean,
        trim: true,
        default: true,
    },
    isNewlyCreated: {
        type: Boolean,
        trim: true,
        default: true,
    },
    isClosed: {
        type: Boolean,
        trim: true,
        default: false,
    },
    type: {
        enum: ["BUG", "SUGGESTION", "POST"],
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});


module.exports = mongoose.model('Report', ReportSchema);