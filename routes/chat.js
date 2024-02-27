const express = require('express');
const router = express.Router();

const chatController = require('../app/api/controllers/chat');
router.post('/', chatController.initiateChatRoom);
//router.post('/addMessage', chatController.AddMessage);
router.post('/markMessageRead', chatController.MarkMessageRead);
router.post('/unreadMessages', chatController.NbrUnreadMessages);
//router.post('/addReplyMessage', chatController.AddReplyTo);
router.get('/:id', chatController.AllMyChatRooms);
router.get('/members/:roomId', chatController.ChatMembers);
router.post('/nomembers', chatController.ChatNoMembers);
router.post('/room/messages', chatController.GetConversationByRoomId);
router.post('/deleteMessage', chatController.DeleteMessage);
router.put('/deleteRoomInitiator/:id', chatController.DeleteRoomByInitiator);
router.put('/deleteRoomConnectedUser/:id', chatController.DeleteRoomByConnectedUser);
router.put('/restoreRoomInitiator/:id', chatController.RestoreRoomByInitiator);
router.put('/restoreRoomConnectedUser/:id', chatController.RestoreRoomByConnectedUser);
router.put('/updateRoom/:id', chatController.UpdateRoom);
router.put('/removeUserRoom/:id', chatController.RemoveUserFromRoom);


module.exports = router;