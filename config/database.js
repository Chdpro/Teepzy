
//Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://chris:chrismal2019@@cluster0-wczdf.mongodb.net/teepzy?retryWrites=true&w=majority';
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
module.exports = mongoose;
