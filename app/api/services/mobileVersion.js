const mobileVersionModel = require('../models/mobileVersion');

exports.AddMobileVersion = async (numeroObject) => {
    try {
        await mobileVersionModel.create(numeroObject);
    } catch (error) {
        console.log(error);
    }
}

exports.NewMobileVersion = async (numeroObject) => {
    try {
        let mV = await mobileVersionModel.find();
        await mobileVersionModel.findByIdAndUpdate(mV[0]['_id'], numeroObject)
    } catch (error) {
        console.log(error);
    }
}


exports.GetMobileVersion = async () => {
    try {
        let mV = await mobileVersionModel.find();
        return mV;
    } catch (error) {
        console.log(error);
    }
}
