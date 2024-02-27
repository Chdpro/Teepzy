const mongoose = require('mongoose');
//const Agent = require('../models/agent');

//Define a schema
const Schema = mongoose.Schema;
const uploadSchema = new Schema({
 path: {
  type: String,
  trim: true,  
  required: true,
 },
 description: {
  type: String,
  trim: true,
 },

 incident : { type: Schema.Types.ObjectId, ref: 'Incident' }

});
module.exports = mongoose.model('Upload', uploadSchema)