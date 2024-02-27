const ResponseModel = require('../models/response');

exports.CreateResponse= async (Response) => {
    try {
        let cmt = await ResponseModel.create(Response);
       if (cmt) {
        let data = { status: 200, data: null, message: "Response created successfully",}
        return data;
        }
    } catch (error) {
        console.log(error);
    }
}

exports.GetAllResponsesOfComment= async (commentId) => {
    try {
        let Responses = await ResponseModel.find({commentId: commentId});
        return Responses;
    } catch (error) {
        console.log(error);
    }
}



exports.DeleteResponse= async (postId) => {
    try {
        await ResponseModel.findByIdAndDelete(postId);
        let data = { status: 200, data: null, message: "Response deleted successfully",}
        return data;
    } catch (error) {
        console.log(error);
    }
}