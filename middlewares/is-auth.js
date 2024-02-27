var jwt = require('jsonwebtoken');

module.exports = function validateUser (req, res, next){
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
      if (err) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    
      } else {
        // add user id to request
        req.body.userId = decoded.id;
        next();
      }
    });
  

};
