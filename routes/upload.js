
module.exports = (app) => {
    // const  verifySignUp  = require("../middlewares/auth.middleware");
    const controller = require("../app/api/controllers/upload");
    const multer = require('multer');

    var storage = multer.diskStorage({
        // destination
        destination: function (req, file, cb) {
            cb(null, 'public/images/datas')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now().toString() + '_' + file.fieldname + '.png');

        }
    });
    var upload = multer({ storage: storage });

    app.route("/api/upload")
        .post(upload.single("avatar"), (req, res) => {
            console.log(req.files)
            if (req.files) {
               res.status(200).json({ status: 200, data: null, message: "Succesfully uploaded" });
                
            } else {
               res.status(500).json({ status: 200, data: null, message: "file not uploaded" });
            }
            //removed the rest of the code to keep it simple. req.file here is always undefined.
        });


}