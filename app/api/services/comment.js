const CommentModel = require('../models/comment');

exports.CreateComment = async (Comment) => {
    try {
        let cmt = await CommentModel.create(Comment);
        if (cmt) {
            let data = { status: 200, data: null, message: "Comment created successfully", }
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}

exports.GetAllCommentsOfPost = async (postId) => {
    try {

        let Comments = await CommentModel.find({ postId: postId })
            .sort({ _id: -1 })
        return Comments;
    } catch (error) {
        console.log(error);
    }
}



exports.DeleteComment = async (postId) => {
    try {
        await CommentModel.findByIdAndDelete(postId);
        let data = { status: 200, data: null, message: "Comment deleted successfully", }
        return data;
    } catch (error) {
        console.log(error);
    }
}