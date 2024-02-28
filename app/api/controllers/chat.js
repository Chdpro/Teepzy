const messageService = require('../services/message');
const roomService = require('../services/room');
const circleService = require('../services/circle');
const userService = require('../services/users');
const { Socket } = require("../../../utils/socket");
const constant = require('../constants/constant');
const sendNotification = require('../../../middlewares/sendNotification');
const notificationService = require('../services/notification');

// const { validationResult } = require('express-validator/check');
const { validationResult } = require('express-validator');



exports.initiateChatRoom = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    let { name, connectedUsers, userId } = req.body
    let room = {
        userId: userId,
        name: name,
        connectedUsers: connectedUsers
    }
    let check1
    let check2
    try {
        if (connectedUsers.length == 1) {
            check1 = await roomService.CheckRoom({ userId: userId, connectedUsers: { $in: connectedUsers[0] } })
            check2 = await roomService.CheckRoom({ userId: connectedUsers[0], connectedUsers: { $in: userId } })
            console.log(check1)
            console.log(check2)
            if (check1 !== null) {
                let user = await userService.getAUser(check1.connectedUsers[0])
                let r = {
                    _id: check1._id,
                    messages: check1.messages,
                    connectedUsers: check1.connectedUsers,
                    userId: check1.userId,
                    name: check1.name,
                    createdAt: check1.createdAt,
                    connectedUsersInfo: user
                }
                return res.status(200).json({ status: 403, data: r, message: "Room exists" });
            } else if (check2 !== null) {
                let user = await userService.getAUser(check2.connectedUsers[0])
                let r = {
                    _id: check2._id,
                    messages: check2.messages,
                    connectedUsers: check2.connectedUsers,
                    userId: check2.userId,
                    name: check2.name,
                    createdAt: check2.createdAt,
                    connectedUsersInfo: user
                }
                return res.status(200).json({ status: 403, data: r, message: "Room exists" });
            }
            else {
                let roomChat = await roomService.InitiateRoom(room)
                let user = await userService.getAUser(roomChat.connectedUsers[0])
                let r = {
                    _id: roomChat._id,
                    messages: roomChat.messages,
                    connectedUsers: roomChat.connectedUsers,
                    userId: roomChat.userId,
                    name: roomChat.name,
                    createdAt: roomChat.createdAt,
                    connectedUsersInfo: user
                }
                Socket.emit('new-room', r);
                return res.status(200).json({ status: 200, data: r, message: "Room created successfully" });
            }

        } else {
            console.log("superieur")
            let roomChat = await roomService.InitiateRoom(room)
            let userInitiator = await userService.getAUser(room['userId'])
            let r = {
                _id: roomChat._id,
                messages: roomChat.messages,
                connectedUsers: roomChat.connectedUsers,
                userId: roomChat.userId,
                name: roomChat.name,
                createdAt: roomChat.createdAt,
                userInitiator: userInitiator
            }
            Socket.emit('new-room', r);
            return res.status(200).json({ status: 200, data: r, message: "Room created successfully" });

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }

}


exports.AllMyChatRooms = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    let userId = req.params.id
    let roomList = []
    try {
        let myRooms = await roomService.GetAllMyRooms(userId)
        for (const r of myRooms) {
            if (r['connectedUsers'].length >= 1) {
                let user = await userService.getAUser(r['connectedUsers'][0])
                let userInitiator = await userService.getAUser(r['userId'])
                let lastMessage = await messageService.GetLastMessage(r['_id'])
                let countUnreadMessages = await messageService.GetCountUnreadMessages({ isRead: false, roomId: lastMessage['roomId'], userId: { $ne: userId } })
                roomList.push({
                    _id: r._id,
                    userId: r.userId,
                    name: r.name,
                    connectedUsers: r.connectedUsers,
                    connectedUsersInfo: user,
                    userInitiator: userInitiator,
                    lastMessage: lastMessage,
                    createdAt: r.createdAt,
                    countUnreadMessages: countUnreadMessages,
                    isRoomArchiveByInitiator: r.isRoomArchiveByInitiator,
                    isRoomArchiveByConnectedUser: r.isRoomArchiveByConnectedUser
                })
            }

        }
        return res.status(200).json({ status: 200, data: roomList, message: "My recent rooms got successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}

exports.ChatMembers = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    let roomId = req.params.roomId
    //let {userId, roomId} = req.body
    let userList = []
    try {
        let room = await roomService.GetARoom(roomId)
        for (const member of room['connectedUsers']) {
            let user = await userService.getAUser(member)
            userList.push(user)
        }
        return res.status(200).json({ status: 200, data: userList, message: "room members got successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}



exports.ChatNoMembers = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    //let roomId = req.params.roomId
    let { userId, roomId } = req.body
    let userList = []
    try {
        let room = await roomService.GetARoom(roomId)
        let circle = await circleService.FindMyCircle(userId)
        for (const member of circle['membersFriends']) {
            if (room['connectedUsers'].includes(member.toString()) != true) {
                let user = await userService.getAUser(member)
                userList.push(user)
            }
        }
        return res.status(200).json({ status: 200, data: userList, message: "room no members got successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}



exports.GetConversationByRoomId = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let { roomId, userId } = req.body

    let messageList = []
    let messages
    try {
        let room = await roomService.GetARoom(roomId)
        let user = await userService.getAUser(room['connectedUsers'][0])
        let roomHelper = {
            userId: room.userId,
            name: room.name,
            messages: [],
            connectedUsers: room.connectedUsers,
            connectedUsersInfo: user,
        }
        if (userId !== room['userId']) {
            messages = await messageService.GetConversationByRoom({ roomId: roomId, isRoomArchiveByConnectedUser: false })
        } else {
            messages = await messageService.GetConversationByRoom({ roomId: roomId, isRoomArchiveByInitiator: false })
        }
        for (const m of messages) {
            if (m['isReply'] === true && m['messageRepliedId']) {
                let mess = {
                    _id: m['_id'],
                    FromMessageText: m['FromMessageText'],
                    FromMessagePseudo: m['FromMessagePseudo'],
                    userFromId: m['userFromId'],
                    userId: m['userId'],
                    pseudo: m['pseudo'],
                    userPhoto_url: m['userPhoto_url'],
                    text: m['text'],
                    isRead: m['isRead'],
                    isReply: m['isReply'],
                    messageRepliedId: m['messageRepliedId'],
                    isTransfered: m['isTransfered'],
                    ReadByRecipients: m['ReadByRecipients'],
                    roomId: m['roomId'],
                    createdAt: m['createdAt'],
                    isRoomArchiveByConnectedUser: m['isRoomArchiveByConnectedUser'],
                    isRoomArchiveByInitiator: m['isRoomArchiveByInitiator']
                }
                messageList.push(mess)
            } else {
                messageList.push(m)
            }
        }
        roomHelper['messages'] = messageList

        return res.status(200).json({ status: 200, data: roomHelper, message: "Conversation got successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}

exports.MarkMessageRead = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let { roomId, currentUserOnlineId } = req.body
    try {
        await messageService.markMessageRead(roomId, currentUserOnlineId)
        await messageService.markGroupMessageRead(roomId, currentUserOnlineId)
        Socket.emit('roomWhoseMessagesRead', roomId);
        return res.status(200).json({ status: 200, data: null, message: "Message marked successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


exports.NbrUnreadMessages = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    let { currentUserOnlineId } = req.body
    try {
        let nbrUnreadMessages = await messageService.GetNbrUnreadMessages(currentUserOnlineId)
        return res.status(200).json({ status: 200, data: nbrUnreadMessages, message: "Message unreads successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


exports.DeleteMessage = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let { messageId } = req.body

    try {
        await messageService.DeleteMessage(messageId)
        Socket.emit('delete-message', messageId);
        return res.status(200).json({ status: 200, data: null, message: "Message deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}


exports.RemoveUserFromRoom = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let roomId = req.params.id
    let { connectedUsers } = req.body

    let room = {
        connectedUsers: connectedUsers,
    }
    try {
        console.log(connectedUsers)
        let roomChat = await roomService.UpdateRoom(roomId, room)
        return res.status(200).json({ status: 200, data: roomChat, message: "Room updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}
exports.UpdateRoom = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let roomId = req.params.id
    let { connectedUsers, name } = req.body

    let room = {
        connectedUsers: connectedUsers,
        name: name
    }
    try {
        let roomChat = await roomService.UpdateRoom(roomId, room)
        if (roomChat) {
            let oldRoom = await roomService.GetARoom(roomId)
            connectedUsers.forEach(async roomElId => {
                if (oldRoom['connectedUsers'].includes(roomElId.toString()) == false) {
                    let user = await userService.getAUser(roomElId);
                    let notification = {
                        type: constant.LINK,
                        userConcernId: roomElId,
                        fromId: oldRoom['userId'],
                        toId: roomElId,
                        message: constant.ADDED_TO_ROOM_MESSAGE + name,
                        icon_name: constant.ADDED_TO_ROOM_ICON,
                    }

                    await notificationService.addNotification(notification)
                    let k = Object.entries(langTexts.lang).find((v) => { return (v[1].trim() === constant.ADD_TO_GROUP.trim()) })
                    const obj = Object.assign({}, k);
                    let translateMessage = langTexts.langMatch[Object.keys(langTexts.langMatch).find(v => { return v === obj['0'] })]
                    let txtToSend = user.language === "fr" ? constant.ADD_TO_GROUP : translateMessage
                    await sendNotification.notification(user['playerId'],
                        txtToSend + name)
                }

            });

        }
        return res.status(200).json({ status: 200, data: roomChat, message: "Room updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}
exports.DeleteRoomByInitiator = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let roomId = req.params.id
    let room = {
        isRoomArchiveByInitiator: true
    }
    try {
        await roomService.DeleteRoomById(roomId, room)
        await messageService.archiveMessagesbyInitiator(roomId)
        return res.status(200).json({ status: 200, data: null, message: "Room deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}
exports.RestoreRoomByInitiator = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let roomId = req.params.id
    let room = {
        isRoomArchiveByInitiator: false
    }
    try {
        await roomService.DeleteRoomById(roomId, room)
        return res.status(200).json({ status: 200, data: null, message: "Room restored successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}

exports.DeleteRoomByConnectedUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let roomId = req.params.id
    let room = {
        isRoomArchiveByConnectedUser: true
    }
    try {
        await roomService.DeleteRoomById(roomId, room)
        await messageService.archiveMessagesbyConnectedUser(roomId)
        return res.status(200).json({ status: 200, data: null, message: "Room deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}

exports.RestoreRoomByConnectedUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    let roomId = req.params.id
    let room = {
        isRoomArchiveByConnectedUser: false
    }
    try {
        await roomService.DeleteRoomById(roomId, room)
        return res.status(200).json({ status: 200, data: null, message: "Room restored successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}

