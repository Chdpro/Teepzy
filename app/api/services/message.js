const messageModel = require('../models/message');
const roomModel = require('../models/room');


exports.AddMessage = async (message) => {
    try {
        let msg = await messageModel.create(message);
        return msg;
    } catch (error) {
        console.log(error);
    }
}

exports.AddReponseToMessage = async (message) => {
    try {
        let msg = await messageModel.create(message);
        return msg;
    } catch (error) {
        console.log(error);
    }
}

exports.GetAllMessages = async (userId) => {
    let query = {
        userId: userId
    }
    try {
        let Messages = await messageModel.find(query).sort({ "createdAt": 1 });
        return Messages;
    } catch (error) {
        console.log(error);
    }
}

exports.GetNbrUnreadMessages = async (currentUserOnlineId) => {
    try {
        let listUnreadMessages = []
        let myOwnrooms = await roomModel.find({ userId: currentUserOnlineId })
        let otherRooms = await roomModel.find({ connectedUsers: { $in: currentUserOnlineId } })
        let allRooms = [...myOwnrooms, ...otherRooms]
        for (const room of allRooms) {
            let query = {
                isRead: false,
                roomId: room['_id'],
                userId: { $ne: currentUserOnlineId }
            }
            let Messages = await messageModel.find(query).sort({ "createdAt": 1 });
            listUnreadMessages = listUnreadMessages.concat(Messages)
        }
        return listUnreadMessages.length;
    } catch (error) {
        console.log(error);
    }
}

exports.GetCountUnreadMessages = async (m) => {

    try {
        let messagesCount = await messageModel.find(m)
        return messagesCount.length;
    } catch (error) {
        console.log(error);
    }
}

exports.GetAMessage = async (messageId) => {

    try {
        let message = await messageModel.findById(messageId)
        return message;
    } catch (error) {
        console.log(error);
    }
}

exports.GetLastMessage = async (roomId) => {
    let query = {
        roomId: roomId,
    }
    console.log(query)
    try {
        let Messages = await messageModel.find(query).sort({ _id: -1 }).limit(1);
        return Messages;
    } catch (error) {
        console.log(error);
    }
}

exports.getMessageOnSearchMatch = async (searchValue) => {
    try {
        let messages = await messageModel.find({ $text: { $search: searchValue } })
        return messages;
    } catch (error) {
        console.log(error);
    }
}


exports.GetConversationByRoom = async (room) => {

    try {
        let messages = await messageModel.find(room);
        return messages;
    } catch (error) {
        console.log(error);
    }
}


exports.updateUserPhotoInMessages = async (user) => {
    try {
        await messageModel.updateMany(
            { userId: user.userId },
            { $set: { userPhoto_url: user.photo } },
        );
    } catch (error) {
        console.log(error);
    }
}

exports.markGroupMessageRead = async (roomId, currentUserOnlineId) => {
    let query = {
        roomId: roomId,
        userId: { $ne: currentUserOnlineId },
        ReadByRecipients: { $nin: currentUserOnlineId },
        isRead: false
    }
    try {
        let room = await roomModel.findById(roomId);
        let unmarkMessagesRead = await messageModel.find(query);
        for (const umr of unmarkMessagesRead) {
            umr['ReadByRecipients'].push(currentUserOnlineId)
            if (umr['ReadByRecipients'].length == room['connectedUsers'].length) {
                umr.isRead = true;
                await messageModel.findByIdAndUpdate(umr['_id'], umr)
            } else {
                await messageModel.findByIdAndUpdate(umr['_id'], umr)
            }
        }

    } catch (error) {

    }
}


exports.markMessageRead = async (roomId, currentUserOnlineId) => {
    let query = {
        roomId: roomId,
        userId: { $ne: currentUserOnlineId },
        ReadByRecipients: { $nin: currentUserOnlineId },
        isRead: false
    }
    try {
        let unmarkMessagesRead = await messageModel.find(query);
        for (const umr of unmarkMessagesRead) {
            if (umr['isRead'] == false) {
                umr.isRead = true;
                await messageModel.findByIdAndUpdate(umr['_id'], umr)
            } else {
                await messageModel.findByIdAndUpdate(umr['_id'], umr)
            }
        }

    } catch (error) {

    }
}

exports.DeleteMessage = async (messageId) => {
    try {
        await messageModel.findByIdAndDelete(messageId);
    } catch (error) {
        console.log(error);
    }
}

exports.archiveMessagesbyInitiator = async (roomId) => {
    try {
        await messageModel.updateMany({ roomId: roomId }, { $set: { isRoomArchiveByInitiator: true } })
    } catch (error) {
        console.log(error)
    }
}

exports.archiveMessagesbyConnectedUser = async (roomId) => {
    try {
        await messageModel.updateMany({ roomId: roomId }, { $set: { isRoomArchiveByConnectedUser: true } })
    } catch (error) {
        console.log(error)
    }
}