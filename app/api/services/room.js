const RoomModel = require('../models/room');

exports.InitiateRoom = async (Room) => {
    console.log('why you create room')
    try {
        let room = await RoomModel.create(Room);
        return room;
    } catch (error) {
        console.log(error);
    }
}

exports.UpdateRoom = async (RoomId, Room) => {
    console.log(Room, RoomId)
    try {
        let room = await RoomModel.findByIdAndUpdate(RoomId, Room);
        return room;
    } catch (error) {
        console.log(error);
    }
}

exports.CheckRoom = async (Room) => {
    try {
        let check = await RoomModel.findOne(Room);
        return check;
    } catch (error) {
        console.log(error);
    }
}

exports.updateUserPhotoInChats = async (user) => {
    try {
        await RoomModel.updateMany(
            { userId: user.userId },
            { $set: { userPhoto_url: user.photo } },
        );
    } catch (error) {
        console.log(error);
    }
}

exports.GetAllMyRooms = async (userId) => {
    try {
        let rooms = await RoomModel.find({ userId: userId, isRoomArchiveByInitiator: false });
        let otherRooms = await RoomModel.find({ connectedUsers: userId, isRoomArchiveByConnectedUser: false });
        let myRooms = [...rooms, ...otherRooms]
        return myRooms;
    } catch (error) {
        console.log(error);
    }
}


exports.GetARoom = async (roomId) => {
    try {
        let room = await RoomModel.findById(roomId);
        return room;
    } catch (error) {
        console.log(error);
    }
}


exports.DeleteRoomById = async (roomId, room) => {
    try {
        await RoomModel.findByIdAndUpdate(roomId, room);
    } catch (error) {
        console.log(error);
    }
}

