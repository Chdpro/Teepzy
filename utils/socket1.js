// const Server = require('socket.io');

const { createServer } = require('http');
const { Server } = require('socket.io');

const server = createServer();
const io = new Server(server);

// const io = new Server();
const messageService = require('../app/api/services/message');
const roomService = require('../app/api/services/room');
const userService = require('../app/api/services/users');
const onlineService = require('../app/api/services/user_online');
const constant = require('../app/api/constants/constant');
const sendNotification = require('../middlewares/sendNotification');
const notificationService = require('../app/api/services/notification');
io.engine.httpServer.on('request', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*:*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  });
  

var Socket = {
    emit: function (event, data) {
        // console.log(event, data);
        io.sockets.emit(event, data);
    },
    on: function (event) {
        io.sockets.on(event, data => {
            console.log(event, data)
        });
    }
};


io.on("connection", function (socket) {
    socket.on('add-message', async message => {
        let messag = {
            userId: message.userId,
            roomId: message.roomId,
            text: message.text,
            pseudo: message.pseudo,
            createdAt: message.createdAt,
            userPhoto_url: message.userPhoto_url,
            timeStamp: message.timeStamp
        }

        let resMessage = {
            userId: message.userId,
            userFromId: message.userFromId,
            FromMessagePseudo: message.FromMessagePseudo,
            roomId: message.roomId,
            text: message.text,
            pseudo: message.pseudo,
            userPhoto_url: message.userPhoto_url,
            messageRepliedId: message.messageRepliedId,
            FromMessageText: message.FromMessageText,
            isReply: message.isReply,
            createdAt: message.createdAt,
            timeStamp: message.timeStamp
        }

        let room = await roomService.GetARoom(message.roomId)
        let connectedUsersWithRoomInitiator = room['connectedUsers']
        connectedUsersWithRoomInitiator.push(room['userId'])
        for (const cu of connectedUsersWithRoomInitiator) {
            if (message.userId !== cu) {
                let notification = {
                    type: constant.MESSAGE,
                    userConcernId: cu,
                    fromId: message.userId,
                    toId: cu,
                    message: message.text.slice(0, 24),
                    icon_name: constant.MESSAGE_ICON,
                    roomId: message.roomId
                }
                let usr = await userService.getAUser(cu)
                let userSender = await userService.getAUser(message.userId)
                await notificationService.addNotification(notification)
                if (room.isRoomArchiveByInitiator == true) {
                    let room = {
                        isRoomArchiveByInitiator: false
                    }
                    await roomService.DeleteRoomById(message.roomId, room)
                }
                if (room.isRoomArchiveByConnectedUser == true) {
                    let room = {
                        isRoomArchiveByConnectedUser: false
                    }
                    await roomService.DeleteRoomById(message.roomId, room)
                }
                Socket.emit('user-notification', notification);
                if (usr['isConversationNotificationAuthorized'] == true && (cu !== message.userId)) {
                    await sendNotification.notification(usr['playerId'], userSender['pseudoIntime'] + ' ' + message.text)
                }
            }

        }

        if (message.isReply == true) {
            console.log(resMessage)
            let m = await messageService.AddReponseToMessage(resMessage)
            if (room.isRoomArchiveByInitiator == true) {
                let room = {
                    isRoomArchiveByInitiator: false
                }
                await roomService.DeleteRoomById(roomId, room)
            }
            if (room.isRoomArchiveByConnectedUser == true) {
                let room = {
                    isRoomArchiveByConnectedUser: false
                }
                await roomService.DeleteRoomById(roomId, room)
            }
            let countUnreadMessages = await messageService.GetCountUnreadMessages({ isRead: false, roomId: message.roomId, userId: { $ne: message.userId } })

            let mess = {
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
                timeStamp: m['timeStamp'],
                countUnreadMessages: countUnreadMessages
            }
            io.emit('message', mess);
        } else {
            let m = await messageService.AddMessage(messag)
            if (room.isRoomArchiveByInitiator == true) {
                let room = {
                    isRoomArchiveByInitiator: false
                }
                await roomService.DeleteRoomById(message.roomId, room)
            }
            if (room.isRoomArchiveByConnectedUser == true) {
                let room = {
                    isRoomArchiveByConnectedUser: false
                }
                await roomService.DeleteRoomById(message.roomId, room)
            }
            let countUnreadMessages = await messageService.GetCountUnreadMessages({ isRead: false, roomId: message.roomId, userId: { $ne: message.userId } })
            m['countUnreadMessages'] = countUnreadMessages
            io.emit('message', m);
        }

    });


    socket.on('message-to-delete', async (messageToDelete) => {
        await messageService.DeleteMessage(messageToDelete.messageId)
        io.emit('delete-message', messageToDelete.messageId);
    });

    socket.on('set-nickname', (nickname) => {
        socket.nickname = nickname;
        io.emit('users-changed', { user: nickname, event: 'joined' });
    });

    socket.on('online', async user => {
        let online = { userId: user.userId, isOnline: true, onlineDate: user.onlineDate, adress: user.adress }
        console.log(online)
        await onlineService.Createonline(online)
        let usr = await userService.getAUser(user.userId)
        let userInfo = { online, usr }
        io.emit('user-online', userInfo);
    });

    socket.on('number-online', (isOnlineUserId) => {
        console.log(isOnlineUserId)
        // io.emit('number-user-online', isOnlineUserId);
    });


    socket.on('disconnect', (isOnlineUserId) => {
        io.emit('user-outline', { userId: isOnlineUserId, isOnline: false, outlineDate: new Date() });
        console.log('user disconnected' + isOnlineUserId);
    });

});

exports.Socket = Socket;
exports.io = io;




