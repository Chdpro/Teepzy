const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
//Define a schema
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    nom: {
        type: String,
        trim: true,
        required: true,
    },
    prenom: {
        type: String,
        trim: true,
        required: true,
    },
    wasOnlineDate: {
        type: Date,
        trim: true,
    },
    gender: {
        enum: ['HOMME', 'FEMME', 'PERSONNALISE'],
        type: String,
        trim: true,
    },
    accountType: {
        enum: ['PUBLIC', 'ADMIN'],
        type: String,
        trim: true,
        required: true,
        default: 'PUBLIC'
    },
    isOnline: {
        type: Boolean,
        trim: true,
        default: false
    },
    isCompleted: {
        type: Boolean,
        trim: true,
        default: false
    },
    isAllProfileCompleted: {
        type: Boolean,
        trim: true,
        default: false
    },
    isActivated: {
        type: Boolean,
        trim: true,
        default: true
    },
    isContactAuthorized: {
        type: Boolean,
        trim: true,
        default: true
    },

    isPhotoAuthorized: {
        type: Boolean,
        trim: true,
        default: true
    },
    isInvitationNotificationAuthorized: {
        type: Boolean,
        trim: true,
        default: true
    },

    isConversationNotificationAuthorized: {
        type: Boolean,
        trim: true,
        default: true
    },

    typeCircle: {
        enum: ['AMICAL', 'PRO'],
        type: String,
        trim: true,
    },

    pseudoIntime: {
        type: String,
        trim: true,
    },

    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    photo: {
        type: String,
        trim: true,
    },
    cover: {
        type: String,
        trim: true,
    },
    birthday: {
        type: String,
        trim: true,
    },
    // playerId: {
    //     type: String,
    //     trim: true,
    //     required: true
    // },
    localisation: {
        type: String,
        trim: true,
    },
    metier: {
        type: String,
        trim: true,
    },
    bio: {
        type: String,
        trim: true,
    },
    tagsLabel: {
        type: String,
        trim: true,
        default: "Hobbies"
    },
    bioLabel: {
        type: String,
        trim: true,
        default: "Bio"
    },
    siteweb: {
        type: String,
        trim: true,
    },
    isBlocked: {
        type: Boolean,
        trim: true,
        default: false
    },

    isDeleted: {
        type: Boolean,
        trim: true,
        default: false
    },
    socialsAmical: [],

    socialsPro: [],

    projects: [],

    products: [],

    messages: [],

    joinedRooms: [],

    tags: [],

    hobbies: [],
    language: {
        type: String,
        trim: true,
        default: "fr"
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    circlesBelongTo: [String],
});

//UserSchema.index({ '$**': 'text' });
UserSchema.index({ name: 'text' });

// hash user password before saving into database
UserSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});
module.exports = mongoose.model('User', UserSchema);