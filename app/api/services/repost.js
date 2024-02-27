const repostModel = require('../models/repost');

exports.CreateRePost = async (post) => {
    try {
        let pst = await repostModel.create(post);
        if (pst) {
            let data = { status: 200, data: null, message: "rePost created successfully", }
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}

exports.GetAllRePosts = async (userId, skipQuery) => {
    let query = {
        includedUsers: userId,
        isDelete: false
    }
    try {
        let Posts = await repostModel.find(query).sort({ "createdAt": 1 })
            .limit(skipQuery.limit)
            .skip(skipQuery.skipIndex)
            .exec();
        let MyRePosts = await repostModel.find({ reposterId: userId, isDelete: false })
            .limit(skipQuery.limit)
            .skip(skipQuery.skipIndex)
            .exec();
        return { posts: Posts, myRePosts: MyRePosts };
    } catch (error) {
        console.log(error);
    }
}

exports.GetAll = async () => {
    try {
        let Posts = await repostModel.find().sort({ "createdAt": 1 });
        return Posts;
    } catch (error) {
        console.log(error);
    }
}


exports.GetMyRePosts = async (userId) => {
    try {
        let MyRePosts = await repostModel.find({ reposterId: userId, isDelete: false });
        return MyRePosts;
    } catch (error) {
        console.log(error);
    }
}

exports.RepostCount = async (postId) => {
    try {
        let reposts = await repostModel.find({ postId: postId, isDelete: false });
        return reposts.length;
    } catch (error) {
        console.log(error);
    }
}


exports.ARePost = async (postId) => {
    try {
        let repost = await repostModel.findById(postId);
        //  { status: 200, data: repost, message: "rePost got successfully", }
        return repost;
    } catch (error) {
        console.log(error);
    }

}

exports.getRePostsByPostId = async (postId) => {
    try {
        let reposts = await repostModel.find({ postId: postId });
        //  { status: 200, data: repost, message: "rePost got successfully", }
        return reposts;
    } catch (error) {
        console.log(error);
    }

}


exports.updateRePost = async (postId, post) => {
    try {
        let reposte = await repostModel.findByIdAndUpdate(postId, post);
        return reposte;
    } catch (error) {
        console.log(error);
    }
}


exports.getSharers = async (postId) => {
    try {
        let Rp = await repostModel.find({ postId: postId });
        return Rp;
    } catch (error) {
        console.log(error);
    }
}

exports.DeleteRePost = async (postId) => {
    try {
        await repostModel.findByIdAndDelete(postId);
    } catch (error) {
        console.log(error);
    }
}