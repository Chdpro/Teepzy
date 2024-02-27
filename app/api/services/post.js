const postModel = require('../models/post');
const repostModel = require('../models/repost');


exports.CreatePost = async (post) => {
    try {
        let pst = await postModel.create(post);
        if (pst) {
            // let data = { status: 200, data: null, message: "Post created successfully", }
            return pst;
        }
    } catch (error) {
        console.log(error);
    }
}

exports.GetAllPosts = async (userId, skipQuery) => {

    let query = {
        includedUsers: userId,
        isDelete: false
    }

    try {
        let Posts = await postModel.find(query).sort({ "createdAt": 1 })
            .limit(skipQuery.limit)
            .skip(skipQuery.skipIndex)
            .exec();
        let MyPosts = await postModel.find({ userId: userId, isDelete: false })
            .limit(skipQuery.limit)
            .skip(skipQuery.skipIndex)
            .exec();
        return { myPosts: MyPosts, posts: Posts };
        //.sort({"createdAt": 1});
    } catch (error) {
        console.log(error);
    }
}

exports.GetAll = async () => {
    try {
        let Posts = await postModel.find().sort({ "createdAt": 1 });
        return Posts;
    } catch (error) {
        console.log(error);
    }
}

exports.GetAllTeepzs = async () => {
    try {
        let Posts = await postModel.find({ isDelete: false }).sort({ "createdAt": 1 });
        return Posts;
    } catch (error) {
        console.log(error);
    }
}


exports.getPostsOnSearchMatch = async (searchValue) => {
    try {
        let posts = await postModel.find({ $text: { $search: searchValue }, isDelete: false })
        return posts;
    } catch (error) {
        console.log(error);
    }
}


exports.GetMyPosts = async (userId) => {
    try {
        let MyPosts = await postModel.find({ userId: userId, isDelete: false });
        return MyPosts;
    } catch (error) {
        console.log(error);
    }
}

exports.GetAPost = async (postId) => {
    try {
        let post = await postModel.findById(postId);
        return post;
    } catch (error) {
        console.log(error);
    }
}

exports.GetAPostByProductId = async (productId) => {
    try {
        let post = await postModel.findOne({ productId: productId });
        return post;
    } catch (error) {
        console.log(error);
    }
}


exports.UpdatePost = async (postId, post) => {
    try {
        await postModel.findByIdAndUpdate(postId, post);
    } catch (error) {
        console.log(error);
    }
}


exports.updateUserPhotoInPosts = async (user) => {
    try {
        await postModel.updateMany(
            { userId: user.userId },
            { $set: { userPhoto_url: user.photo } },
        );
        await repostModel.updateMany(
            { fromId: user.userId },
            { $set: { userPhoto_url: user.photo } },
        );
    } catch (error) {
        console.log(error);
    }
}

exports.DeletePost = async (postId) => {
    try {
        await postModel.findByIdAndDelete(postId);
    } catch (error) {
        console.log(error);
    }
}