const express = require('express');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const _ = require('lodash');
const users = require('./routes/users');
const stat = require('./routes/stats');
const socials = require('./routes/social');
const chat = require('./routes/chat');
const bodyParser = require('body-parser');
// const mongoose = require('./config/database'); //database configuration
const mongoose = require('./config/db'); //database configuration

const app = express();
var path = require('path');     //used for file path
const server = require('http').createServer(app);
const fs = require('fs');
const multer = require('multer');
// const mime = require('mime');
const mime = require('mime-types');
// const mongoose = require('mongoose');
const redis = require('redis')
const jwt = require('jsonwebtoken');
// const translate = require("translate"); // Old school
const translate = require("translate-google");


redis.createClient()

const { io } = require("./utils/socket");
io.attach(server, {
  serveClient: false,
  // below are engine.IO options
  origins: 'http://localhost:8100', // <== CORS
  transports: ['polling'],
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
  allowEIO3: true 
});


app.set('secretKey', 'nodeRestApi'); // jwt secret token

// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));

// enable files upload
app.use(fileUpload({
  createParentPath: true,
  limits: {
    fileSize: 900 * 1024 * 1024 //900MB max file(s) size
  },
}));
//add other middleware
app.use(cors());



// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8100');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.use(bodyParser.json({
  limit: '50mb',
  parameterLimit: 100000
}));
app.use(bodyParser.urlencoded({
  extended: true, limit: '50mb',
  parameterLimit: 100000
}))
app.use(morgan('dev'));




app.get('/', function (req, res) {
  res.json({ "Teepzy": " TEEPZY node.js API" });
});
// public route
app.use('/users', users);
app.use('/socials', socials);
app.use('/chat', chat);



require("./routes/upload")(app);

// private route
app.use('/stats', stat);

//app.use('/movies', validateUser, movies);
app.get('/favicon.ico', function (req, res) {
  res.sendStatus(204);
});


app.use(express.static('uploads'));
app.use(express.static('/home/ciao/Documents/project/Teepzy/uploads'))
app.use(express.static(path.join(__dirname, 'uploads')));

app.post('/translate', async (req, res) => {

  try {
    const bar = await translate("Hello world", { to: "es" });
    console.log(bar)
    return res.send({ status: 200, translated: bar });
  } catch (error) {
    return res.send({ status: 500, e: error });
  }

})
app.post('/upload-avatar', async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let avatar = req.files.avatar;

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      avatar.mv('./uploads/' + avatar.name);

      //send response
      res.send({
        status: true,
        message: 'File is uploaded',
        data: {
          name: avatar.name,
          mimetype: avatar.mimetype,
          size: avatar.size
        }
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

/** 
 * upload base64 image to nodejs
*/

app.post('/upload-avatar-base64', (req, res) => {
  // to declare some path to store your converted image

  if (req.body.base64image) {
    var matches = req.body.base64image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};

    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;
    // let extension = mime.getExtension(type);
    let extension = mime.extension(type);
    let fileName = req.body.imageName + "." + extension;
    try {
      fs.writeFileSync("./uploads/" + fileName, imageBuffer, { encoding: 'base64' });
      return res.send({ status: 200, fileName: fileName });
    } catch (e) {
      //next(e);
      //send response
      console.log(e)
      res.status(500).send({
        status: false,
        message: e,
        data: null
      });
    }
  } else if (req.body.base64video) {
    req.body.base64 = req.body.base64video.replace(/^data:(.*?);base64,/, ""); // <--- make it any type
    req.body.base64 = req.body.base64video.replace(/ /g, '+'); // <--- this is important
    let fileName = req.body.videoName + ".mp4";

    try {
      fs.writeFileSync("./uploads/" + fileName, req.body.base64, 'base64');
      return res.send({ status: 200, fileName: fileName });
    } catch (e) {
      //next(e);
      //send response
      res.status(500).send({
        status: false,
        message: e,
        data: null
      });
    }
  }

});


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var upload = multer({ storage: fileStorage })


app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req
  console.log("file ooop" + file)
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file)

})


app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);


function validateUser(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
    if (err) {
      res.json({ status: "error", message: err.message, data: req });
    } else {
      // add user id to request

      req.userId = decoded.id;
      // console.log("req", req.userId)
      next();
    }
  });

}


// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// handle errors
app.use(function (err, req, res, next) {
  console.log(err);

  if (err.status === 404)
    res.status(404).json({ message: "Not found" });
  else
    res.status(500).json({ message: "Something looks wrong :( !!!" });
});


var listen = app.listen(5001, function () {
  console.log('Node server listening on port 5001');
  console.log('Your application is running at http://localhost:5001/');
});


io.listen(listen);

module.exports = app;



