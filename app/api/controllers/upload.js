//const User = require('../models/user');

exports.updateUser = (req, res) => {
  console.log(req.file);

  var avatar;
  if (req.file) {
    avatar = req.file;
    console.log(req.file);

  } else {

    avatar.path = ''

  }
  /*const user = new User({
      avatar: avatar.path 
  })
 user.save().then(num => {
  console.log(num);   
         res.send({
             message: "User was updated successfully."
         });
  
 })
     .catch(err => {
         res.status(500).send({
             message: "Error updating User with id="
         });
     });*/
  console.log(req.file);
};