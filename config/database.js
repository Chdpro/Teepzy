
//Set up mongoose connection
// const mongoose = require('mongoose');
// const mongoDB = 'mongodb+srv://saliousambadiao:saliousamba2024@cluster0.gulns3k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// mongoose.set('useFindAndModify', false);
// mongoose.set('useUnifiedTopology', true);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useUnifiedTopology', true);
// mongoose.connect(mongoDB);
// mongoose.Promise = global.Promise;
// module.exports = mongoose;

// // mongodb+srv://saliousambadiao:saliousamba2024@cluster0.gulns3k.mongodb.net/

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://saliousambadiao:saliousamba2024@cluster0.gulns3k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);


// const mongoose = require('mongoose');

// var options = {
//     useNewUrlParser: true, useUnifiedTopology: true
//  };
//  var mongodbUri = 'mongodb+srv://saliousambadiao:saliousamba2024@cluster0.gulns3k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
//  // var mongodbUri = 'mongodb://127.0.0.1:27017/mydb'
//  mongoose.connect(mongodbUri, options);
//  var conn = mongoose.connection;
 
//  conn.on('error', console.error.bind(console, 'connection error:'));