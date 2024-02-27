const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;
const ProjectSchema = new Schema({
    userId: {
        type: String,
        trim: true,
        required: true,
    },
    nom: {
        type: String,
        trim: true,
        required: true,
    },
    photo: [],
    description: {
        type: String,
        trim: true,
        required: true,
    },

    userPhoto_url: {
        type: String,
        trim: true,
    },
    userPseudo: {
        type: String,
        trim: true,
        required: true,
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    tags: [],

    createdAt: {
        type: Date,
        default: Date.now
    },

});

ProjectSchema.index({ '$**': 'text' });


module.exports = mongoose.model('Project', ProjectSchema);