const circleModel = require('../models/circle');

exports.CreateCircle = async (circle) => {
    try {
        let MyCircle = await circleModel.create(circle);
       if (MyCircle) {
        let data = { status: 200, data: null, message: "Circle created successfully",}
        return data;
        }
    } catch (error) {
        console.log(error);
    }
}

exports.AddMemberToCircle = async (idCircle, circle) => {
    try {
         await circleModel.findByIdAndUpdate(idCircle, circle);
        let data = { status: 200, data: null, message: "Circle updated successfully",}
        return data;
    } catch (error) {
        console.log(error);
    }
}

exports.RemoveMemberFromCircle = async (idCircle, circle) => {
    try {
         await circleModel.findByIdAndUpdate(idCircle, circle);
        let data = { status: 200, data: null, message: "Circle updated successfully",}
        return data;
    } catch (error) {
        console.log(error);
    }
}



exports.FindMyCircle = async (idCreator) => {
    try {
        let MyCircle = await circleModel.findOne({idCreator: idCreator});
        let data = MyCircle
        return data;
    } catch (error) {
        console.log(error);
    }
}

