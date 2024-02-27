
const favoriteModel = require('../models/favorite');


exports.addFavorite = async (favorite) => {
    try {
        let fav = await favoriteModel.find(favorite);
        if (fav.length == 0) {
            await favoriteModel.create(favorite);
            let data = { status: 200, data: null, message: "Favorite added successfully", }
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}

exports.addMessageFavorite = async (favorite) => {
    try {
            await favoriteModel.create(favorite);
            let data = { status: 200, data: null, message: "Message Favorite added successfully", }
            return data;
    } catch (error) {
        console.log(error);
    }
}

exports.myFavorites = async (userId) => {
    try {
        let favs = await favoriteModel.find({userId: userId});
            return favs;
    } catch (error) {
        console.log(error);
    }
}

exports.removeFavorite = async (favorite) => {
    try {

        let favo = {
            userId: favorite.userId,
            postId: favorite.postId
       }
        let getFav = await favoriteModel.findOne(favo)
        await favoriteModel.findByIdAndDelete(getFav['_id']);
     
    } catch (error) {
        console.log(error);
    }
}


exports.CheckFavorite = async (favorite) => {
    try {
        let fav = await favoriteModel.find(favorite);
        return fav;
    } catch (error) {
        console.log(error);
    }
}


exports.CountFavorite = async (postId) => {
    try {
        let fav = await favoriteModel.find({postId: postId});
        console.log(fav)
        return fav.length;
    } catch (error) {
        console.log(error);
    }
}


exports.getFavorites = async (postId) => {
    try {
        let fav = await favoriteModel.find({postId: postId});
        return fav;
    } catch (error) {
        console.log(error);
    }
}