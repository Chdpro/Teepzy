const SocialModel = require('../models/social');

exports.CreateSocial = async (Social) => {
    try {
        let social = await SocialModel.create(Social);
       if (social) {
        let data = { status: 200, data: null, message: "Social created successfully",}
        return data;
        }
    } catch (error) {
        console.log(error);
    }
}


exports.GetAllSocials= async () => {
    try {
        let socials = await SocialModel.find();
       if (socials.length > 0) {
        return socials;
        }
    } catch (error) {
        console.log(error);
    }
}

exports.GetUserSocials= async (userId) => {
    try {
        let socials = await SocialModel.find({userId: userId});
       if (socials.length > 0) {
        return socials;
        }
    } catch (error) {
        console.log(error);
    }
}

