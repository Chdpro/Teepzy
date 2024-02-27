const onlineModel = require('../models/user_online');
const getArrayWithUniquesElements = require('../functions/uniqueArray');

exports.Createonline = async (online) => {
    try {
        await onlineModel.create(online);
    } catch (error) {
        console.log(error);
    }
}


exports.GetAllonlines = async () => {
    try {
        let onlines = await onlineModel.find();
        return onlines;
    } catch (error) {
        console.log(error);
    }
}


exports.GetAllonlinesInLastMinutes = async () => {
    //0,05
    let uniques = []
    try {
        let onlines = await onlineModel.find({ "onlineDate": { $gt: new Date(Date.now() - 0.05 * 60 * 60 * 1000) } });
        uniques = [...new Map(onlines.map(o=>[o.userId,o])).values()];
        return uniques
    } catch (error) {
        console.log(error);
    }
}



exports.GetUserOnlines = async (userId) => {
    try {
        let onlines = await onlineModel.find({ userId: userId });
        return onlines;
    } catch (error) {
        console.log(error);
    }
}



