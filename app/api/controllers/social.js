const socialService = require('../services/social');
// const { validationResult } = require('express-validator/check');
const { validationResult } = require('express-validator');


exports.CreateSocial = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    let { icon, url, type, nom } = req.body
    let social = {
        icon: icon,
        url: url,
        type: type,
        nom: nom
    }
    try {
        let socials = await socialService.CreateSocial(social)
        return res.status(200).json(socials);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


exports.listSocials = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    try {
        let socials = await socialService.GetAllSocials()
        return res.status(200).json(socials);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


