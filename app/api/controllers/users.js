const userService = require('../services/users');
const circleService = require('../services/circle');
const postService = require('../services/post');
const repostService = require('../services/repost');
const commentService = require('../services/comment');
const responseService = require('../services/response');
const reportService = require('../services/report');
const favoriteService = require('../services/favorite');
const onlineService = require('../services/user_online');
const notificationService = require('../services/notification');
const messageService = require('../services/message');
const versionService = require('../services/mobileVersion');
const productService = require('../services/product');
const projectService = require('../services/project');
const constant = require('../constants/constant');
const langTexts = require('../constants/langText');
const sendNotification = require('../../../middlewares/sendNotification');
const { Socket } = require("../../../utils/socket");
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const translate = require("translate"); // Old school
// import translate from 'translate';SS

var redis = require("redis");
//var client = redis.createClient();
const client = redis.createClient()
const { promisify } = require('util')

const asyncRedis = require("async-redis");
const ASYNC_REDIS_CLIENT = asyncRedis.decorate(client);

client.on("connect", function () {
     console.log("You are now connected");
});
//log error to the console if any occurs
client.on("error", (err) => {
     console.log(err);
});

// const { validationResult } = require('express-validator/check');
const { validationResult } = require('express-validator');
const { DeleteRoomByConnectedUser } = require('./chat');
const langText = require('../constants/langText');


exports.signupUser = async function (req, res, next) {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let user = req.body
     try {
          let usr = await userService.signup(user)
          if (usr['status'] == 403) {
               res.status(403).json({ status: 403, data: null, message: "User exists" });
          } else {
               let usr = await userService.signing(req, user)
               let myCircle = {
                    idCreator: usr['data']['userI']['_id'],
               }
               let circle = await circleService.CreateCircle(myCircle)
               res.status(200).json({ status: 200, data: usr['data'], circle: circle, message: "Succesfully User added" });
          }
     } catch (e) {
          res.status(500).json({ error: e });
     }
}


exports.getUser = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let userId = req.params.id
     console.log(userId)
     try {
          let usr = await userService.getAUser(userId)
          let products = await productService.GetAllProducts(userId)
          let projects = await projectService.GetAllProjects(userId)
          let relations = await circleService.FindMyCircle(userId)
          let membersFriends = relations['membersFriends']

          if (usr) {
               res.status(200).json({ status: 200, message: "user is found", data: usr, products: products, projects: projects, relationsCount: membersFriends.length });
          } else {
               res.status(404).json({ status: 404, auth: false, message: "User not found!", data: null });
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}
exports.getUserFromAdmin = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let userId = req.params.id
     try {
          let usr = await userService.getAUser(userId)
          let products = await productService.GetAllProductsFromDash(userId)
          let projects = await projectService.GetAllProjectsFromDash(userId)
          let relations = await circleService.FindMyCircle(userId)
          let membersFriends = relations['membersFriends']
          let onlineHistory = await onlineService.GetUserOnlines(userId);
          if (usr) {
               res.status(200).json({ status: 200, message: "user is found!", data: usr, products: products, projects: projects, relationsCount: membersFriends.length, onlineHistory: onlineHistory });
          } else {
               res.status(404).json({ status: 404, auth: false, message: "User not found!", data: null });
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}



exports.UsersBasedOnSexe = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     try {
          let stat = await userService.getNbrUsersOnSex()
          if (stat) {
               res.status(200).json({ status: 200, message: "stats based on genders is found!", data: stat, });
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.LinksBySender = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let idSender = req.params.id
     try {
          let links = await userService.LinksByUserSender(idSender)
          if (links) {
               res.status(200).json({ status: 200, message: "links by this user is found!", data: { links: links, total: links.length } });
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.LinksByReceiver = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let idReceiver = req.params.id
     try {
          let links = await userService.LinksByUserReceiver(idReceiver)
          if (links) {
               res.status(200).json({ status: 200, message: "links by this user is found!", data: { links: links, total: links.length } });
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.LinksCount = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     try {
          let links = await userService.ListLinksCount()
          res.status(200).json({ status: 200, message: "linksCount by this user is found!", data: links });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}



exports.LinksAcceptedCount = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let listLinks = []
     try {

          let links = await userService.ListLinksAcceptedCount()
          for (const l of links) {
               let sender = await userService.getAUser(l.idSender)
               let receiver = await userService.getAUser(l.idReceiver)
               let linker = await userService.getAUser(l.linkerId)
               listLinks.push({
                    sender: sender.pseudoIntime,
                    receiver: receiver.pseudoIntime,
                    linker: linker.pseudoIntime,
                    createdAt: l.createdAt,
                    message: l.message
               })
          }
          res.status(200).json({ status: 200, message: "linksCount accepted by this user is found!", data: listLinks, count: links.length });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.LinksRefusedCount = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let listLinks = []

     try {
          let links = await userService.ListLinksRefusedCount()
          for (const l of links) {
               let sender = await userService.getAUser(l.idSender)
               let receiver = await userService.getAUser(l.idReceiver)
               let linker = await userService.getAUser(l.linkerId)
               listLinks.push({
                    sender: sender.pseudoIntime,
                    receiver: receiver.pseudoIntime,
                    linker: linker.pseudoIntime,
                    createdAt: l.createdAt,
                    message: l.message
               })
          }
          res.status(200).json({ status: 200, message: "linksCount refused by this user is found!", data: listLinks, count: links.length });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.getCircleMembers = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let userId = req.params.id
     let usersList = []
     try {
          let relations = await circleService.FindMyCircle(userId)
          let members = relations['membersFriends']
          console.log(members)
          for (const m of members) {
               let u = await userService.getAUser(m)
               let Circle = await circleService.FindMyCircle(u['_id']);
               let circleFriends = Circle['membersFriends']
               usersList.push(
                    {
                         _id: u._id,
                         nom: u.nom,
                         prenom: u.prenom,
                         phone: u.phone,
                         photo: u.photo,
                         pseudoIntime: u.pseudoIntime,
                         wasOnlineDate: u.wasOnlineDate,
                         birthday: u.birthday,
                         localisation: u.localisation,
                         metier: u.metier,
                         bio: u.bio,
                         siteweb: u.siteweb,
                         socialsAmical: u.socialsAmical,
                         socialsPro: u.socialsPro,
                         circleMembersCount: circleFriends.length,
                         isActivated: u.isActivated,
                         tagsLabel: u.tagsLabel,
                         bioLabel: u.bioLabel
                    }
               )
          }
          res.status(200).json({ status: 200, message: "my circle is found!", data: usersList });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.checkIfUserInMyCircle = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { userId, connectedUserId } = req.body
     try {
          let relations = await circleService.FindMyCircle(userId)
          let members = relations['membersFriends']
          if (members.includes(connectedUserId.toString())) {
               res.status(200).json({ status: 200, message: "my circle is found!", data: true });
          } else {
               res.status(200).json({ status: 200, message: "my circle is found!", data: false });

          }

     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.updateUser = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { pseudoIntime, userId, gender, photo, birthday } = req.body
     let userI = {
          pseudoIntime: pseudoIntime,
          userId: userId,
          birthday: birthday,
          isCompleted: true,
          gender: gender,
          photo: photo
     }
     try {
          let usr = await userService.updateUser(userI)
          if (usr['status'] == 200) {
               res.status(200).json(usr);
          } else {
               res.status(403).json(usr);

          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.updateUserPlayerId = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { userId, playerId, language } = req.body
     let userI = {
          playerId: playerId,
          userId: userId,
          language: language
     }
     try {
          let usr = await userService.updateUserProfile(userI)
          if (usr['status'] == 200) {
               res.status(200).json(usr);
          } else {
               res.status(403).json(usr);

          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}



exports.changeUserPassword = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { password, userId } = req.body
     let userI = {
          password: bcrypt.hashSync(password, saltRounds),
          userId: userId,
     }
     try {
          let usr = await userService.changeUserPassword(userI)
          if (usr['status'] == 200) {
               res.status(200).json(usr);
               return link;
          } else {
               res.status(403).json(usr);

          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.blockUserAccount = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { userId } = req.body
     let userI = {
          isBlocked: true,
     }
     try {
          await userService.BlockUser(userId, userI)
          res.status(200).json({ status: 200, message: 'That user account is blocked successfully', data: null });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.UnblockUserAccount = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { userId } = req.body
     let userI = {
          isBlocked: false,
     }
     try {
          await userService.BlockUser(userId, userI)
          res.status(200).json({ status: 200, message: 'That user account is unblocked successfully', data: null });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.ChangeStatusReport = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let reportId = req.params.id
     let report = {
          isClosed: true,
          isPending: false,
          isNewlyCreated: false,
     }
     try {
          await reportService.changeReportStatus(reportId, report)
          res.status(200).json({ status: 200, data: null, message: 'Report status changed succesfully' });

     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.DeleteReport = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let reportId = req.params.id
     let report = {
          isDelete: true,
     }
     try {
          await reportService.changeReportStatus(reportId, report)
          res.status(200).json({ status: 200, data: null, message: 'BUG deleted succesfully' });

     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}
exports.ReportBug = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { reason, userId } = req.body
     let bug = {
          reason: reason,
          userId: userId,
          type: "BUG"
     }
     try {
          await reportService.CreateReport(bug)
          res.status(200).json({ status: 200, data: null, message: 'Report sent succesfully' });

     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.Suggest = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { reason, userId } = req.body
     let suggestion = {
          reason: reason,
          userId: userId,
          type: "SUGGESTION",
     }

     try {
          await reportService.CreateReport(suggestion)
          res.status(200).json({ status: 200, data: null, message: 'Suggestion sent succesfully' });

     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.updateUserInfo = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { pseudoIntime, userId, phone, birthday, nom, prenom, email } = req.body
     let userI = {
          pseudoIntime: pseudoIntime,
          userId: userId,
          birthday: birthday,
          phone: phone,
          email: email,
          prenom: prenom,
          nom: nom
     }
     try {
          console.log(userI)

          let usr = await userService.updateUserInfo(userI)
          console.log(usr)
          if (usr['status'] == 200) {
               res.status(200).json(usr);
          } else {
               res.status(403).json(usr);

          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.activateUser = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }

     let { userId } = req.body

     let userI = {
          isActivated: true,
          userId: userId
     }
     try {
          let usr = await userService.ActivateUnactivateUser(userI)
          if (usr['status'] == 200) {
               res.status(200).json(usr);
          } else {
               res.status(403).json(usr);

          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}




exports.UnActivateUser = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { userId } = req.body

     let userI = {
          isActivated: false,
          userId: userId
     }
     console.log(userI)
     try {
          let usr = await userService.ActivateUnactivateUser(userI)
          if (usr['status'] == 200) {
               res.status(200).json(usr);
          } else {
               res.status(403).json(usr);

          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.changeAccount = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }

     let { userId, typeCircle } = req.body

     let userI = {
          typeCircle: typeCircle,
          userId: userId
     }
     try {
          let usr = await userService.ChangeAccount(userI)
          if (usr['status'] == 200) {
               res.status(200).json(usr);
          } else {
               res.status(403).json(usr);
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.setUserOnline = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { isOnline, userId } = req.body
     let onlineDate = new Date()
     let userI = {
          isOnline: isOnline,
          userId: userId,
          wasOnlineDate: onlineDate
     }
     try {

          let usr = await userService.getUserConnected(userI)
          if (usr['status'] == 200) {
               let Onlineusrs = await userService.OnlineUsers()
               Socket.emit('number-user-online', Onlineusrs.length);
               res.status(200).json(usr);
          } else {
               res.status(403).json(usr);

          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.getOnlineUsers = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     try {
          let Onlineusrs = await userService.OnlineUsers()
          Socket.emit('user-online', Onlineusrs.length);
          res.status(200).json({ status: 200, message: "users online!", data: Onlineusrs, });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.updateUserProfile = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { localisation, metier, bio, bioLabel, tagsLabel, siteweb, tags, photo, userId, cover, hobbies, socialsAmical } = req.body
     let userI = {
          localisation: localisation,
          metier: metier,
          userId: userId,
          siteweb: siteweb,
          bio: bio,
          cover: cover,
          hobbies: hobbies,
          photo: photo,
          socialsAmical: socialsAmical,
          tags: tags,
          tagsLabel: tagsLabel,
          bioLabel: bioLabel,
          isAllProfileCompleted: false
     }

     try {

          if (metier && bio && hobbies.length > 0 && localisation) {
               userI.isAllProfileCompleted = true
          }
          let usr = await userService.updateUserProfile(userI)
          res.status(200).json(usr);
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.updateUserPhoto = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { photo, userId } = req.body
     let userI = {
          userId: userId,
          photo: photo,
     }
     try {
          let usr = await userService.updateUserProfile(userI)
          if (usr['status'] == 200) {
               await postService.updateUserPhotoInPosts(userI)
               await messageService.updateUserPhotoInMessages(userI)
          }
          res.status(200).json(usr);
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.AuthorizeConversationNotifications = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { userId, isConversationNotificationAuthorized } = req.body
     let userI = {
          userId: userId,
          isConversationNotificationAuthorized: isConversationNotificationAuthorized
     }

     try {
          let usr = await userService.updateUserProfile(userI)
          res.status(200).json(usr);
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.AuthorizeInvitationNotifications = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { userId, isInvitationNotificationAuthorized } = req.body
     let userI = {
          userId: userId,
          isInvitationNotificationAuthorized: isInvitationNotificationAuthorized
     }

     try {
          let usr = await userService.updateUserProfile(userI)
          res.status(200).json(usr);
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.AuthorizeContacts = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { userId, isContactAuthorized } = req.body
     let userI = {
          userId: userId,
          isContactAuthorized: isContactAuthorized
     }

     console.log(userI)
     try {
          let usr = await userService.updateUserProfile(userI)
          res.status(200).json(usr);
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.AuthorizePhotos = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { userId, isPhotoAuthorized } = req.body
     let userI = {
          userId: userId,
          isPhotoAuthorized: isPhotoAuthorized
     }

     try {
          let usr = await userService.updateUserProfile(userI)
          res.status(200).json(usr);
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.updateUserProfile2 = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { hobbies, userId, socialsAmical } = req.body
     let userI = {
          userId: userId,
          hobbies: hobbies,
          socialsAmical: socialsAmical,
     }

     try {
          let usr = await userService.updateUserProfile(userI)
          res.status(200).json(usr);
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}



exports.checkUser = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { pseudoIntime } = req.body
     let userI = {
          pseudoIntime: pseudoIntime,
     }
     try {
          let usr = await userService.checkUser(userI)
          if (usr['status'] == 200) {
               res.status(200).json(usr);
          } else {
               res.status(201).json(usr);
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.signing = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let user = req.body
     try {
          let usr = await userService.signing(req, user)
          if (usr['status'] == 200) {
               res.status(200).json(usr);
          } else {
               res.status(404).json({ status: 404, data: null, message: "Invalid email/password" });
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.signingAdministrator = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let user = req.body
     try {
          let usr = await userService.signingAdmin(req, user)
          if (usr['status'] == 200) {
               res.status(200).json(usr);
          } else {
               res.status(404).json({ status: 404, data: null, message: "Invalid email/password" });
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.checkUserEmail = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let user = req.body
     try {
          let usr = await userService.checkUserEmail(user)
          if (usr['status'] == 200) {
               res.status(200).json(usr);
          } else {
               res.status(404).json({ status: 404, data: null, message: "Invalid email" });
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}



exports.getUsers = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let userId = req.params.id
     let userList = []
     let circleMembers = []
     try {
          let usrs = await userService.getUsers(userId)
          for (const u of usrs) {
               let onlineHistory = await onlineService.GetUserOnlines(u['_id']);
               let Posts = await postService.GetMyPosts(u['_id'])
               userList.push({
                    _id: u._id,
                    nom: u.nom,
                    prenom: u.prenom,
                    phone: u.phone,
                    photo: u.photo,
                    pseudoIntime: u.pseudoIntime,
                    wasOnlineDate: u.wasOnlineDate,
                    birthday: u.birthday,
                    localisation: u.localisation,
                    metier: u.metier,
                    bio: u.bio,
                    siteweb: u.siteweb,
                    socialsAmical: u.socialsAmical,
                    socialsPro: u.socialsPro,
                    circle: circleMembers,
                    isActivated: u.isActivated,
                    tagsLabel: u.tagsLabel,
                    bioLabel: u.bioLabel,
                    sexe: u.gender,
                    onlineHistory: onlineHistory,
                    isBlocked: u.isBlocked,
                    nbPosts: Posts.length,
                    isDeleted: u.isDeleted
               })


          }
          res.status(200).json({ status: 200, data: userList, totalUsers: usrs.length, message: "Users retrieved" });

     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.getAllOnlineUsers = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let userId = req.params.id
     let userList = []
     try {
          let onlineHistory = await onlineService.GetAllonlines();
          console.log(onlineHistory)
          for (const oH of onlineHistory) {
               if (oH['userId'] !== userId) {
                    let u = await userService.getAUser(oH['userId'])
                    userList.push({
                         _id: u._id,
                         nom: u.nom,
                         prenom: u.prenom,
                         phone: u.phone,
                         photo: u.photo,
                         pseudoIntime: u.pseudoIntime,
                         wasOnlineDate: u.wasOnlineDate,
                         birthday: u.birthday,
                         localisation: u.localisation,
                         metier: u.metier,
                         bio: u.bio,
                         siteweb: u.siteweb,
                         socialsAmical: u.socialsAmical,
                         socialsPro: u.socialsPro,
                         isActivated: u.isActivated,
                         isBlocked: u.isBlocked,
                         tagsLabel: u.tagsLabel,
                         bioLabel: u.bioLabel,
                         onlineHistory: oH,
                         isDeleted: u.isDeleted
                    })
               }
          }

          res.status(200).json({ status: 200, data: userList, totalUsers: userList.length, message: "Users retrieved" });

     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.GetAllonlinesInLastMinutes = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let userId = req.params.id
     let userList = []
     try {
          let onlineHistory = await onlineService.GetAllonlinesInLastMinutes();
          for (const oH of onlineHistory) {
               if (oH['userId'] !== userId) {
                    let u = await userService.getAUser(oH['userId'])
                    userList.push({
                         _id: u._id,
                         nom: u.nom,
                         prenom: u.prenom,
                         phone: u.phone,
                         photo: u.photo,
                         pseudoIntime: u.pseudoIntime,
                         wasOnlineDate: u.wasOnlineDate,
                         birthday: u.birthday,
                         localisation: u.localisation,
                         metier: u.metier,
                         bio: u.bio,
                         siteweb: u.siteweb,
                         socialsAmical: u.socialsAmical,
                         socialsPro: u.socialsPro,
                         isActivated: u.isActivated,
                         isBlocked: u.isBlocked,
                         tagsLabel: u.tagsLabel,
                         bioLabel: u.bioLabel,
                    })
               }
          }

          res.status(200).json({ status: 200, data: userList, totalUsers: userList.length, message: "Users retrieved" });

     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.SendInvitation = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { idSender, idReceiver, typeLink } = req.body


     let notification = {
          type: constant.INVITATION,
          userConcernId: idReceiver,
          fromId: idSender,
          toId: idReceiver,
          message: constant.INVITATION_MESSAGE,
          icon_name: constant.INVITATION_ICON

     }

     try {
          let userSender = await userService.getAUser(idSender)
          console.log(idSender)
          let invitation = {
               idSender: idSender,
               idReceiver: idReceiver,
               typeLink: typeLink,
               senderPseudo: userSender.pseudoIntime
          }
          let user = await userService.getAUser(idReceiver)
          await userService.SendInvitationToJoinCircle(invitation)
          await notificationService.addNotification(notification)
          Socket.emit('user-notification', notification);
          let k = Object.entries(langTexts.lang).find((v) => { return (v[1].trim() === constant.INVITATION_MESSAGE.trim()) })
          const obj = Object.assign({}, k);
          let translateMessage = langTexts.langMatch[Object.keys(langTexts.langMatch).find(v => { return v === obj['0'] })]
          let txtToSend = user.language === "fr" ? constant.INVITATION_MESSAGE : translateMessage

          await sendNotification.notification(user['playerId'], userSender['pseudoIntime'] + ' ' + txtToSend)
          res.status(200).json({ status: 200, data: null, message: "Invitation sent" });


     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.CancelInvitation = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { idSender, idReceiver } = req.body
     let invitation = {
          idSender: idSender,
          idReceiver: idReceiver,
     }

     try {
          console.log(invitation)
          let cancel = await userService.CancelInvitationToJoinCircle(invitation)
          res.status(200).json(cancel);
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}




exports.SendInvitationToLink = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { idSender, idReceiver, linkerId, postId, message } = req.body
     let notification = {
          type: constant.LINK,
          userConcernId: idReceiver,
          fromId: idSender,
          toId: idReceiver,
          message: constant.LINK_MESSAGE,
          icon_name: constant.LINK_ICON,
          linkerId: linkerId,
          postId: postId,
          retourLink: true
     }

     try {
          let userSender = await userService.getAUser(idSender)
          let userLinker = await userService.getAUser(linkerId)
          let user = await userService.getAUser(idReceiver)
          let invitation = {
               idSender: idSender,
               idReceiver: idReceiver,
               senderPseudo: userSender['pseudoIntime'],
               linkerId: linkerId,
               isLinked: true,
               accept: false,
               message: message,
               postId: postId
          }
          await userService.SendLinkToJoin(invitation)
          await notificationService.addNotification(notification)
          let k = Object.entries(langTexts.lang).find((v) => { return (v[1].trim() === constant.LINK_MESSAGE.trim()) })
          const obj = Object.assign({}, k);
          let translateMessage = langTexts.langMatch[Object.keys(langTexts.langMatch).find(v => { return v === obj['0'] })]
          let txtToSend = user.language === "fr" ? constant.LINK_MESSAGE : translateMessage

          await sendNotification.notification(user['playerId'],
               userLinker['pseudoIntime'] + ' '
               + txtToSend + ' '
               + userSender['pseudoIntime'])

          return res.status(200).json({ status: 200, data: null, message: "link sent" });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.AcceptLink = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { idInvitation, idReceiver, idSender, postId } = req.body
     let invitation = {
          accept: true,
     }

     let notification = {
          type: constant.LINK,
          userConcernId: idSender,
          fromId: idSender,
          toId: idReceiver,
          message: ' a accepté votre link avec lui ',
          icon_name: constant.LINK_ICON,
          retourLink: true,
          postId: postId
     }

     try {
          await userService.AcceptALinkTo(idInvitation, invitation);
          let link = await userService.ALinkTo(idInvitation)
          let userLinker = await userService.getAUser(link.linkerId)
          let userReceiver = await userService.getAUser(link.idReceiver)
          let userSender = await userService.getAUser(idSender)
          await notificationService.addNotification(notification)
          let k = Object.entries(langTexts.lang).find((v) => { return (v[1].trim() === constant.LINK_ACCEPTED_MESSAGE.trim()) })
          const obj = Object.assign({}, k);
          let translateMessage = langTexts.langMatch[Object.keys(langTexts.langMatch).find(v => { return v === obj['0'] })]
          let txtToSend = user.language === "fr" ? constant.LINK_ACCEPTED_MESSAGE : translateMessage

          await sendNotification.notification(userSender['playerId'],
               userReceiver['pseudoIntime'] + txtToSend)

          let notificationToPoster = {
               type: constant.LINK,
               userConcernId: link.linkerId,
               fromId: idSender,
               toId: idReceiver,
               message: ' a accepté le link que vous lui avez envoyé ',
               icon_name: constant.LINK_ICON,
               retourLink: true,
               postId: postId
          }
          await notificationService.addNotification(notificationToPoster)
          let k1 = Object.entries(langTexts.lang).find((v) => { return (v[1].trim() === constant.LINK_ACCEPTED_MESSAGE_YOUSENT.trim()) })
          const obj1 = Object.assign({}, k1);
          let translateMessage1 = langTexts.langMatch[Object.keys(langTexts.langMatch).find(v => { return v === obj1['0'] })]
          let txtToSend1 = user.language === "fr" ? constant.LINK_ACCEPTED_MESSAGE_YOUSENT : translateMessage1

          await sendNotification.notification(userLinker['playerId'],
               userReceiver['pseudoIntime'] + txtToSend1)

          res.status(200).json({ status: 200, data: null, message: "Link accepted" });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.ListLinksTo = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { idReceiver } = req.body
     let invitation = {
          idReceiver: idReceiver
     }
     try {
          let data = await userService.ListLinks(invitation['idReceiver'])
          return res.status(200).json(data);
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.RefuseALinkTo = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { idLink } = req.body
     try {
          let data = await userService.RefuseLink(idLink)

          let link = await userService.ALinkTo(idLink)
          let user = await userService.getAUser(link.linkerId)
          let userReceiver = await userService.getAUser(link.idReceiver)
          let k = Object.entries(langTexts.lang).find((v) => { return (v[1].trim() === constant.LINK_DENIED_MESSAGE_YOUSENT.trim()) })
          const obj = Object.assign({}, k);
          let translateMessage = langTexts.langMatch[Object.keys(langTexts.langMatch).find(v => { return v === obj['0'] })]
          let txtToSend = user.language === "fr" ? constant.LINK_DENIED_MESSAGE_YOUSENT : translateMessage

          await sendNotification.notification(user['playerId'],
               userReceiver['pseudoIntime'] + txtToSend)
          res.status(200).json(data);
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.CloseALinkTo = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { idLink } = req.body
     try {
          let data = await userService.CloseLink(idLink)
          res.status(200).json(data);
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.RemoveMemberFromCircle = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { idCreator, idMember } = req.body
     try {
          console.log(idCreator, idMember)
          let circle = await circleService.FindMyCircle(idCreator)
          const index = circle['membersFriends'].indexOf(idMember);
          if (index > -1) {
               circle['membersFriends'].splice(index, 1);
               let c = {
                    membersFriends: circle['membersFriends']
               }
               console.log("inside")
               let data = await circleService.RemoveMemberFromCircle(circle._id, c)
               res.status(200).json(data);
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.ListInvitation = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { idReceiver } = req.body
     let invitation = {
          idReceiver: idReceiver
     }
     try {
          let data = await userService.ListInvitation(invitation['idReceiver'])
          res.status(200).json(data);
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}



exports.AcceptInvitation = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { idInvitation, typeLink, idSender, idReceiver } = req.body
     let invitation = {
          accept: true,
     }

     let notification = {
          type: constant.INVITATION,
          userConcernId: idSender,
          fromId: idReceiver,
          toId: idReceiver,
          message: ' a accepté votre invitation',
          icon_name: constant.INVITATION_ICON,
     }

     try {
          await userService.AcceptInvitationToJoinCircle(idInvitation, invitation);
          await notificationService.addNotification(notification)
          let userSender = await userService.getAUser(idSender)
          let userReceiver = await userService.getAUser(idReceiver)
          let k = Object.entries(langTexts.lang).find((v) => { return (v[1].trim() === constant.INVITATION_ACCEPT.trim()) })
          const obj = Object.assign({}, k);
          let translateMessage = langTexts.langMatch[Object.keys(langTexts.langMatch).find(v => { return v === obj['0'] })]
          let txtToSend = user.language === "fr" ? constant.INVITATION_ACCEPT : translateMessage

          await sendNotification.notification(userSender['playerId'], userReceiver['pseudoIntime'] + ' ' + txtToSend)
          let senderCircle = await circleService.FindMyCircle(idSender)
          let receiverCircle = await circleService.FindMyCircle(idReceiver)
          if (typeLink) {
               senderCircle['membersFriends'].push(idReceiver)
               let senderCircleToUpdate = {
                    membersFriends: senderCircle['membersFriends']
               }
               receiverCircle['membersFriends'].push(idSender)
               let receiverCircleToUpdate = {
                    membersFriends: receiverCircle['membersFriends']
               }
               await circleService.AddMemberToCircle(senderCircle['_id'], senderCircleToUpdate)
               await circleService.AddMemberToCircle(receiverCircle['_id'], receiverCircleToUpdate)

          }
          res.status(200).json({ status: 200, data: null, message: "Invitation accepted" });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}



exports.uploadPhoto = (req, res) => {
     //const id = req.params.id;
     console.log(req.files)
     if (req.files && req.files.length > 0) {
          let avatar = req.files[0].path
          res.status(200).json({ status: 200, path: avatar });

     } else {
          res.status(500).json({ error: 'File is not uploaded' });

     }
}

exports.SendInvitationViaSms = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { senderId, phone } = req.body
     let invitation = {
          senderId: senderId,
          phone: phone,
          invited: true
     }
     try {
          await userService.SendInvitationBySms(invitation)
          res.status(200).json({ status: 200, data: null, message: "Invitation via sms sent" });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.DeleteInvitationViaSms = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { senderId, phone } = req.body
     let invitation = {
          senderId: senderId,
          phone: phone,
     }
     try {
          await userService.DeleteInvitationBySms(invitation);
          res.status(200).json({ status: 200, data: null, message: "Invitation deleted" });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.checkInvitationViaSms = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     const { phone } = req.body;

     let query = {
          'phone': phone,
     }
     try {
          let invite = await userService.CheckInvitationBySms(query);
          if (invite) {
               res.send({ status: 201, data: true, retour: invite });
          } else {
               res.send({ status: 404, data: false, retour: invite });
          }

     } catch (error) {
          res.status(500).send({ status: 500, message: err.message });

     }

};


exports.ListInvitationViaSms = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { idReceiver } = req.body
     let invitation = {
          idReceiver: idReceiver
     }
     try {
          let data = await userService.ListInvitationViaSms(invitation['idReceiver'])
          res.status(200).json(data);
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.checkInvitation = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     const { idSender, idReceiver } = req.body;
     let query = {
          idSender: idSender,
          idReceiver: idReceiver,
     }
     try {
          let invite = await userService.CheckInvitation(query);
          if (invite.length > 0) {
               res.send({ status: 201, data: true, retour: invite });
          } else {
               res.send({ status: 404, data: false, retour: invite });
          }
     } catch (error) {
          res.status(500).send({ status: 500, message: err.message });

     }

};


exports.checkInvitationNotAccepted = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     const { idSender, idReceiver } = req.body;
     let query = {
          idSender: idSender,
          idReceiver: idReceiver,
     }
     try {
          let invite = await userService.CheckInvitation(query);
          if (invite.length > 0) {
               res.send({ status: 201, data: true, retour: invite });
          } else {
               res.send({ status: 404, data: false, retour: invite });
          }
     } catch (error) {
          res.status(500).send({ status: 500, message: err.message });

     }

};



exports.getTeepZrNotInMyCircle = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }

     let userId = req.params.id
     let userList = []
     let myCircle = []
     try {
          let myC = await circleService.FindMyCircle(userId)
          myCircle = myC['membersFriends']
          let users = await userService.GetTeepZrNotInMyCircle(userId);
          if (users.length > 0) {
               for (const u of users) {
                    let eachUserCircle = await circleService.FindMyCircle(u['_id']);
                    if (eachUserCircle != null) {
                         if (eachUserCircle['membersFriends'] != null) {
                              let userCircle = eachUserCircle['membersFriends']
                              userList.push(
                                   {
                                        circlesBelongTo: [],
                                        _id: u._id,
                                        nom: u.nom,
                                        prenom: u.prenom,
                                        phone: u.phone,
                                        photo: u.photo,
                                        email: u.email,
                                        password: u.password,
                                        pseudoIntime: u.pseudoIntime,
                                        accept: u.accept,
                                        circleMembersCount: userCircle.length
                                   }
                              )
                         }
                    }
               }
               res.send({ status: 201, data: userList });
          } else {
               res.send({ status: 404, data: null, });
          }
     } catch (error) {
          console.log(error)
          res.status(500).send({ status: 500, message: error.message });

     }

};

exports.getTeepZrNotInMyCircleToThenSendInvitation = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }

     let userId = req.params.id
     let userList = []
     try {
          let users = await userService.GetTeepZrNotInMyCircle(userId);
          for (const u of users) {
               userList.push(
                    {
                         _id: u._id,
                         nom: u.nom,
                         prenom: u.prenom,
                         phone: u.phone,
                         photo: u.photo,
                         email: u.email,
                         pseudoIntime: u.pseudoIntime,
                         accept: u.accept,
                    }
               )
          }
          res.send({ status: 201, data: userList });


     } catch (error) {
          console.log(error)
          res.status(500).send({ status: 500, message: error.message });

     }

};

exports.GetTeepZrEventualKnown = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let userId = req.params.id
     try {
          let users = await userService.GetTeepZrEventualKnown(userId)
          res.send({ status: 201, data: users, message: 'eventual known teepzers' });
     } catch (error) {
          res.status(500).send({ status: 500, message: error.message });
     }
}


// All about user and posts



exports.AddPost = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { userId, content, image_url, price, productId, nom, commercialAction, prenom, backgroundColor, userPhoto_url, userPseudo, video_url } = req.body
     let post = {
          userId: userId,
          userPhoto_url: userPhoto_url,
          userPseudo: userPseudo,
          nom: nom,
          prenom: prenom,
          content: content,
          image_url: image_url,
          video_url: video_url,
          backgroundColor: backgroundColor,
          includedUsers: [],
          commercialAction: commercialAction,
          price: price,
          matches: [],
          productId: productId
     }

     let notification = {
          type: constant.POST,
          userConcernId: '',
          fromId: userId,
          toId: '',
          message: constant.POST_MESSAGE,
          icon_name: constant.POST_ICON
     }

     let postBack
     let userList = []
     try {

          let userSender = await userService.getAUser(userId)
          let userOwnCircle = await circleService.FindMyCircle(userId)
          if (userOwnCircle['membersFriends'].length > 0) {
               post['includedUsers'] = userOwnCircle['membersFriends']
               let p = await postService.CreatePost(post)
               const deleted = await ASYNC_REDIS_CLIENT.del("POSTS" + userId)
               for (const usersId of userOwnCircle['membersFriends']) {
                    const deleted = await ASYNC_REDIS_CLIENT.del("POSTS" + usersId)
                    notification['toId'] = p['_id']
                    await notificationService.addNotification(notification)
                    let user = await userService.getAUser(usersId)
                    Socket.emit('user-notification', notification);
                    Socket.emit('user-new-post', { post: 'Nouvelles publications', userConcernedId: usersId });

                    let k = Object.entries(langTexts.lang).find((v) => { return (v[1].trim() === constant.POST_MESSAGE.trim()) })
                    const obj = Object.assign({}, k);
                    let translateMessage = langTexts.langMatch[Object.keys(langTexts.langMatch).find(v => { return v === obj['0'] })]
                    let txtToSend = user.language === "fr" ? constant.POST_MESSAGE : translateMessage

                    await sendNotification.notification(user['playerId'], userSender['pseudoIntime'] + ' ' + txtToSend)
               }


               let contentList = content.split(" ")
               for (const word of contentList) {
                    if (word.charAt(0) === '@') {
                         console.log(word)
                         let pseudo = word.slice(1)
                         let mentionnedUser = await userService.getAUserByPseudo(pseudo)
                         console.log(mentionnedUser)
                         let notification = {
                              type: constant.MENTION,
                              userConcernId: mentionnedUser._id,
                              fromId: userId,
                              toId: p['_id'],
                              message: constant.MENTION_MESSAGE,
                              icon_name: constant.MESSAGE_ICON
                         }
                         await notificationService.addNotification(notification)
                         let k = Object.entries(langTexts.lang).find((v) => { return (v[1].trim() === constant.MENTION_MESSAGE.trim()) })
                         const obj = Object.assign({}, k);
                         let translateMessage = langTexts.langMatch[Object.keys(langTexts.langMatch).find(v => { return v === obj['0'] })]
                         let txtToSend = user.language === "fr" ? constant.MENTION_MESSAGE : translateMessage

                         await sendNotification.notification(mentionnedUser['playerId'], userSender['pseudoIntime'] + ' ' + txtToSend)

                    }
               }

               let users = await userService.getUsersOnSearchMatch(content)
               let myCircle = await circleService.FindMyCircle(userId);
               let circleContent = myCircle['membersFriends']
               // check if matches are in my circle
               if (users && users.length > 0) {
                    for (const u of users) {
                         if (circleContent.includes(u['_id'].toString())) {
                              userList.push({
                                   _id: u._id,
                                   nom: u.nom,
                                   prenom: u.prenom,
                                   phone: u.phone,
                                   photo: u.photo,
                                   pseudoIntime: u.pseudoIntime,
                              })
                         }
                    }

               }

               let dateStamp = JSON.stringify(p['createdAt']).slice(1, 11).split('-').join('')
               let timeStamp = JSON.stringify(p['createdAt']).slice(12, 20).split(':').join('')

               // add users that match to the list of matches for each post
               postBack = {
                    _id: p._id,
                    userId: p.userId,
                    userPhoto_url: p.userPhoto_url,
                    userPseudo: p.userPseudo,
                    nom: p.nom,
                    prenom: p.prenom,
                    content: p.content,
                    image_url: p.image_url,
                    video_url: p.video_url,
                    backgroundColor: p.backgroundColor,
                    includedUsers: p.includedUsers,
                    matches: userList,
                    createdAt: p.createdAt,
                    dateTimeStamp: dateStamp + timeStamp

               }
               res.status(200).json({ status: 200, data: postBack, message: "Post created successfully" });
          } else {
               post['includedUsers'] = []
               let p = await postService.CreatePost(post)
               const deleted = await ASYNC_REDIS_CLIENT.del("POSTS" + userId)
               let users = await userService.getUsersOnSearchMatch(content)
               let myCircle = await circleService.FindMyCircle(userId);
               let circleContent = myCircle['membersFriends']
               // check if matches are in my circle
               if (users && users.length > 0) {
                    for (const u of users) {
                         if (circleContent.includes(u['_id'].toString())) {
                              userList.push({
                                   _id: u._id,
                                   nom: u.nom,
                                   prenom: u.prenom,
                                   phone: u.phone,
                                   photo: u.photo,
                                   pseudoIntime: u.pseudoIntime,
                              })
                         }
                    }

               }

               let dateStamp = JSON.stringify(p['createdAt']).slice(1, 11).split('-').join('')
               let timeStamp = JSON.stringify(p['createdAt']).slice(12, 20).split(':').join('')

               // add users that match to the list of matches for each post
               postBack = {
                    _id: p._id,
                    userId: p.userId,
                    userPhoto_url: p.userPhoto_url,
                    userPseudo: p.userPseudo,
                    nom: p.nom,
                    prenom: p.prenom,
                    content: p.content,
                    image_url: p.image_url,
                    video_url: p.video_url,
                    backgroundColor: p.backgroundColor,
                    includedUsers: p.includedUsers,
                    matches: userList,
                    createdAt: p.createdAt,
                    dateTimeStamp: dateStamp + timeStamp

               }
               res.status(200).json({ status: 200, data: postBack, message: "Post created successfully" });
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.AddAdminPost = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { userId, content, image_url, nom, prenom, backgroundColor, video_url, includedUsers } = req.body
     let post = {
          userId: userId,
          userPhoto_url: "https://api.teepzy.com/logo.png",
          userPseudo: "TeepZy",
          nom: nom,
          prenom: prenom,
          content: content,
          image_url: image_url,
          video_url: video_url,
          backgroundColor: backgroundColor,
          includedUsers: includedUsers,
     }


     let notification = {
          type: constant.POST,
          userConcernId: '',
          fromId: userId,
          toId: '',
          message: constant.POST_MESSAGE,
          icon_name: constant.POST_ICON
     }

     let postBack
     try {

          if (includedUsers.length > 0) {
               let p = await postService.CreatePost(post)
               for (const usersId of includedUsers) {
                    //set key to cache to know later if there is new post
                    // client.setex("USERNEWPOST" + usersId, 3600, usersId);
                    // client.setex("USERNEWPOST" + userId, 3600, userId);
                    // console.log("set user new post in my circle")
                    // notification['userConcernId'] = usersId
                    notification['toId'] = p['_id']
                    await notificationService.addNotification(notification)
                    let user = await userService.getAUser(usersId)
                    Socket.emit('user-notification', notification);
                    let k = Object.entries(langTexts.lang).find((v) => { return (v[1].trim() === constant.POST_MESSAGE.trim()) })
                    const obj = Object.assign({}, k);
                    let translateMessage = langTexts.langMatch[Object.keys(langTexts.langMatch).find(v => { return v === obj['0'] })]
                    let txtToSend = user.language === "fr" ? constant.POST_MESSAGE : translateMessage

                    await sendNotification.notification(user['playerId'], "TeepZy" + ' ' + txtToSend)
               }

               let dateStamp = JSON.stringify(p['createdAt']).slice(1, 11).split('-').join('')
               let timeStamp = JSON.stringify(p['createdAt']).slice(12, 20).split(':').join('')

               // add users that match to the list of matches for each post
               postBack = {
                    _id: p._id,
                    userId: p.userId,
                    userPhoto_url: p.userPhoto_url,
                    userPseudo: p.userPseudo,
                    nom: p.nom,
                    prenom: p.prenom,
                    content: p.content,
                    image_url: p.image_url,
                    video_url: p.video_url,
                    backgroundColor: p.backgroundColor,
                    includedUsers: p.includedUsers,
                    createdAt: p.createdAt,
                    dateTimeStamp: dateStamp + timeStamp

               }
               res.status(200).json({ status: 200, data: postBack, message: "Post created successfully" });
          } else {
               res.status(200).json({ status: 500, data: postBack, message: "You must specify at least one user for includerUsers attribute" });
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}



exports.GetPosts = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let userId = req.params.id
     let AllPosts = []
     let userList = []


     const page = parseInt(req.query.page);
     const limit = parseInt(req.query.limit);
     const skipIndex = (page - 1) * limit;
     let skipQuery = {
          page: page,
          limit: limit,
          skipIndex: skipIndex
     }

     try {
          const CACHE_RES = await ASYNC_REDIS_CLIENT.get("POSTS" + userId);
          if (CACHE_RES) {
               res.send({ status: 201, data: JSON.parse(CACHE_RES), message: 'Posts got from cache successfully' });
          } else {
               let posts = await postService.GetAllPosts(userId, skipQuery)
               let reposts = await repostService.GetAllRePosts(userId, skipQuery)
               if (posts.posts.length !== 0 || reposts.posts.length !== 0 || posts.myPosts.length !== 0 || reposts.myRePosts.length !== 0) {
                    let p = [...posts.posts, ...reposts.posts, ...posts.myPosts, ...reposts.myRePosts]
                    for (const post of p) {
                         let users = await userService.getUsersOnSearchMatch(post.content)
                         let allComments = await commentService.GetAllCommentsOfPost(post['_id'])
                         let favoriteCounts = await favoriteService.CountFavorite(post['_id'])
                         let repostCounts = await repostService.RepostCount(post['_id'])
                         let myCircle = await circleService.FindMyCircle(userId);
                         let circleContent = myCircle['membersFriends']
                         // check if matches are in my circle
                         for (const u of users) {
                              if (circleContent.includes(u['_id'].toString())) {
                                   userList.push({
                                        _id: u._id,
                                        nom: u.nom,
                                        prenom: u.prenom,
                                        phone: u.phone,
                                        photo: u.photo,
                                        pseudoIntime: u.pseudoIntime,
                                   })
                              }
                         }

                         let favorite = {
                              postId: post['_id'],
                              userId: userId
                         }

                         let isFavorite = await favoriteService.CheckFavorite(favorite)
                         let dateStamp = JSON.stringify(post['createdAt']).slice(1, 11).split('-').join('')
                         let timeStamp = JSON.stringify(post['createdAt']).slice(12, 20).split(':').join('')
                         let reposter = await userService.getAUser(post['reposterId'])
                         if (isFavorite.length > 0) {
                              // add users that match to the list of matches for each post

                              AllPosts.push({
                                   _id: post._id,
                                   userId: post.userId,
                                   userPhoto_url: post.userPhoto_url,
                                   userPseudo: post.userPseudo,
                                   nom: post.nom,
                                   prenom: post.prenom,
                                   content: post.content,
                                   image_url: post.image_url,
                                   video_url: post.video_url,
                                   backgroundColor: post.backgroundColor,
                                   includedUsers: post.includedUsers,
                                   matches: userList,
                                   createdAt: post.createdAt,
                                   nbrComments: allComments.length,
                                   favoriteCount: favoriteCounts,
                                   repostCounts: repostCounts,
                                   reposterId: post.reposterId,
                                   reposterPseudo: reposter ? reposter.pseudoIntime : null,
                                   favorite: true,
                                   dateTimeStamp: dateStamp + timeStamp,
                                   fromId: post.fromId,
                                   isDelete: post.isDelete,
                                   commercialAction: post.commercialAction,
                                   price: post.price,
                                   views: post.views

                              })
                         } else {
                              // add users that match to the list of matches for each post
                              AllPosts.push({
                                   _id: post._id,
                                   userId: post.userId,
                                   userPhoto_url: post.userPhoto_url,
                                   userPseudo: post.userPseudo,
                                   nom: post.nom,
                                   prenom: post.prenom,
                                   content: post.content,
                                   image_url: post.image_url,
                                   video_url: post.video_url,
                                   backgroundColor: post.backgroundColor,
                                   includedUsers: post.includedUsers,
                                   matches: userList,
                                   createdAt: post.createdAt,
                                   nbrComments: allComments.length,
                                   favoriteCount: favoriteCounts,
                                   repostCounts: repostCounts,
                                   reposterId: post.reposterId,
                                   reposterPseudo: reposter ? reposter.pseudoIntime : null,
                                   favorite: false,
                                   dateTimeStamp: dateStamp + timeStamp,
                                   fromId: post.fromId,
                                   isDelete: post.isDelete,
                                   commercialAction: post.commercialAction,
                                   price: post.price,
                                   views: post.views

                              })
                         }
                         // here clear userList after each post
                         userList = []
                    }
                    await ASYNC_REDIS_CLIENT.setex("POSTS" + userId, 50, JSON.stringify(AllPosts));
                    res.send({ status: 201, data: AllPosts, message: 'Posts got successfully p1' });
               }

          }

     } catch (error) {
          console.log(error)
          res.status(500).send({ status: 500, message: error.message });
     }
}


exports.testMatch = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let userId = req.params.id
     let userList = []
     let S = await userService.getUsersOnSearchMatch("Qui a envie de pousser à fond teepzy?proche de Melun")
     let myCircle = await circleService.FindMyCircle(userId);
     let circleContent = myCircle['membersFriends']
     console.log(S)
     for (const u of S) {
          if (circleContent.includes(u['_id'].toString())) {
               userList.push(u)
          }
     }

     res.send({ status: 201, data: userList, message: 'Matches tests successfully ' });

}

exports.SetViewOnPost = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }

     try {
          let { userId, userPhoto, userPseudo, postId } = req.body
          let post = await postService.GetAPost(postId)
          let repost = await repostService.ARePost(postId)
          if (post) {
               if (!post.views.some((e) => e.userId === userId && e.userPseudo === userPseudo)) {
                    post.views.push({ userId: userId, userPhoto: userPhoto, userPseudo: userPseudo })
                    let p = { views: post.views }
                    await postService.UpdatePost(postId, p)
                    res.send({ status: 201, data: null, message: 'View added successfully ' });
               }

          } else {
               if (!repost.views.some((e) => e.userId === userId && e.userPseudo === userPseudo)) {
                    repost.views.push({ userId: userId, userPhoto: userPhoto, userPseudo: userPseudo })
                    let p = { views: repost.views }
                    await repostService.updateRePost(repost._id, p)
                    res.send({ status: 201, data: null, message: 'View added successfully ' });
               }

          }

     } catch (error) {
          console.log(error.message)
          res.status(500).send({ status: 500, message: error.message });
     }


}

exports.GetAllFeeds = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let AllPosts = []
     try {
          let posts = await postService.GetAll()
          let reposts = await repostService.GetAll()
          let all = [...posts, reposts]
          for (const post of all) {
               let allComments = await commentService.GetAllCommentsOfPost(post['_id'])
               let favoriteCounts = await favoriteService.CountFavorite(post['_id'])
               let repostCounts = await repostService.RepostCount(post['_id'])

               let favorites = await favoriteService.getFavorites(post['_id'])
               console.log(favorites)
               if (favorites.length > 0) {
                    for (const favorite of favorites) {
                         var usersLiked = []
                         let uL = await userService.getAUser(favorite.userId)
                         usersLiked.push(uL)
                    }
                    // add users that match to the list of matches for each post
                    AllPosts.push({
                         _id: post._id,
                         userId: post.userId,
                         userPhoto_url: post.userPhoto_url,
                         userPseudo: post.userPseudo,
                         nom: post.nom,
                         prenom: post.prenom,
                         content: post.content,
                         image_url: post.image_url,
                         video_url: post.video_url,
                         backgroundColor: post.backgroundColor,
                         includedUsers: post.includedUsers,
                         createdAt: post.createdAt,
                         nbrComments: allComments.length,
                         favoriteCount: favoriteCounts,
                         usersLiked: usersLiked,
                         repostCounts: repostCounts,
                         reposterId: post.reposterId,
                         isDelete: post.isDelete,
                         deletedAt: post.deletedAt,
                         views: post.views


                    })
               } else {

                    // add users that match to the list of matches for each post
                    AllPosts.push({
                         _id: post._id,
                         userId: post.userId,
                         userPhoto_url: post.userPhoto_url,
                         userPseudo: post.userPseudo,
                         nom: post.nom,
                         prenom: post.prenom,
                         content: post.content,
                         image_url: post.image_url,
                         video_url: post.video_url,
                         backgroundColor: post.backgroundColor,
                         includedUsers: post.includedUsers,
                         createdAt: post.createdAt,
                         nbrComments: allComments.length,
                         favoriteCount: favoriteCounts,
                         repostCounts: repostCounts,
                         reposterId: post.reposterId,
                         isDelete: post.isDelete,
                         deletedAt: post.deletedAt,
                         views: post.views

                    })
               }

          }
          res.send({ status: 201, data: AllPosts.reverse(), message: 'Posts got successfully ' });


     } catch (error) {
          console.log(error)
          res.status(500).send({ status: 500, message: error.message });
     }
}

exports.getLikers = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let postId = req.params.postId
     let userList = []
     try {
          let favorites = await favoriteService.getFavorites(postId)
          for (let F of favorites) {
               let user = await userService.getAUser(F.userId)
               userList.push({
                    _id: user._id,
                    pseudoIntime: user.pseudoIntime,
                    nom: user.pseudoIntime,
                    prenom: user.prenom,
                    nom: user.nom,
                    email: user.email,
                    photo: user.photo,
                    metier: user.metier
               })
          }
          res.send({ status: 201, data: userList, message: 'Favorites successfully ' });
     } catch (error) {
          console.log(error)
          res.status(500).send({ status: 500, message: error.message });
     }

}



exports.getSharers = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let postId = req.params.postId
     let userList = []
     try {
          let sharers = await repostService.getSharers(postId)
          for (let S of sharers) {
               let user = await userService.getAUser(S.reposterId)
               userList.push({
                    _id: user._id,
                    pseudoIntime: user.pseudoIntime,
                    nom: user.pseudoIntime,
                    prenom: user.prenom,
                    nom: user.nom,
                    email: user.email,
                    photo: user.photo,
                    metier: user.metier
               })
          }
          res.send({ status: 201, data: userList, message: 'Sharers successfully ' });
     } catch (error) {
          console.log(error)
          res.status(500).send({ status: 500, message: error.message });
     }

}

exports.GetMyPosts = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let userId = req.params.id
     try {
          let myPosts = await postService.GetMyPosts(userId)
          if (myPosts.length != 0) {
               let p = myPosts
               res.send({ status: 201, data: p.reverse(), message: 'My Posts got successfully ' });
          } else {
               res.send({ status: 201, data: null, message: 'Posts got successfully' });
          }
     } catch (error) {
          console.log(error)
          res.status(500).send({ status: 500, message: error.message });
     }
}

exports.GetAllTeepzs = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     try {
          let posts = await postService.GetAllTeepzs()
          res.send({ status: 201, data: posts.reverse(), message: 'All Posts got successfully ' });
     } catch (error) {
          console.log(error)
          res.status(500).send({ status: 500, message: error.message });
     }
}


exports.GetAPost = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }

     let { userId, idPost } = req.body
     let userList = []
     try {
          let post = await postService.GetAPost(idPost)
          let users = await userService.getUsersOnSearchMatch(post.content)
          let allComments = await commentService.GetAllCommentsOfPost(post['_id'])
          let favoriteCounts = await favoriteService.CountFavorite(post['_id'])
          let repostCounts = await repostService.RepostCount(post['_id'])

          // console.log(post['_id'])
          let myCircle = await circleService.FindMyCircle(userId);
          let circleContent = myCircle['membersFriends']
          // check if matches are in my circle
          for (const u of users) {
               if (circleContent.includes(u['_id'].toString())) {
                    userList.push({
                         _id: u._id,
                         nom: u.nom,
                         prenom: u.prenom,
                         phone: u.phone,
                         photo: u.photo,
                         pseudoIntime: u.pseudoIntime,
                    })
               }
          }
          let p = {
               _id: post._id,
               userId: post.userId,
               userPhoto_url: post.userPhoto_url,
               userPseudo: post.userPseudo,
               nom: post.nom,
               prenom: post.prenom,
               content: post.content,
               image_url: post.image_url,
               video_url: post.video_url,
               backgroundColor: post.backgroundColor,
               matches: userList,
               createdAt: post.createdAt,
               nbrComments: allComments.length,
               favoriteCount: favoriteCounts,
               repostCounts: repostCounts,
               commercialAction: post.commercialAction,
               price: post.price,
               views: post.views
          }
          res.send({ status: 201, data: p, message: 'A Post got successfully ' });
     } catch (error) {
          console.log(error)
          res.status(500).send({ status: 500, message: error.message });
     }
}


exports.GetPostScopesCount = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { postId, userId } = req.body
     let scopeCount = 0

     try {
          let reposts = await repostService.getRePostsByPostId(postId)
          let My_circle = await circleService.FindMyCircle(userId);
          My_circle !== null ? scopeCount = My_circle.membersFriends.length : null
          for (const RP of reposts) {
               let reposterId = RP['reposterId']
               let circle = await circleService.FindMyCircle(reposterId);
               scopeCount = scopeCount + circle.membersFriends.length
          }
          res.send({ status: 201, data: scopeCount, message: 'Post scope got successfully ' });
     } catch (error) {
          console.log(error)
          res.status(500).send({ status: 500, message: error.message });
     }
}

exports.GetMyFavorites = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let userId = req.params.id
     let listFavorites = []

     try {
          let myFavoritePosts = await favoriteService.myFavorites(userId)
          for (const f of myFavoritePosts) {
               let postId = f['postId']
               let post = await postService.GetAPost(postId);
               if (post != null) {
                    listFavorites.push(post)
               }
          }
          res.send({ status: 201, data: listFavorites.reverse(), message: 'My Favorites Posts got successfully ' });

     } catch (error) {
          console.log(error)
          res.status(500).send({ status: 500, message: error.message });
     }
}


exports.addFavorite = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { userId, postId, type } = req.body
     let favorite = {
          userId: userId,
          postId: postId,
          type: type
     }

     let notification = {
          type: constant.FAVORITE,
          userConcernId: '',
          fromId: userId,
          toId: postId,
          message: constant.FAVORITE_MESSAGE,
          icon_name: constant.FAVORITE_ICON
     }

     try {
          let user = await userService.getAUser(userId)
          await favoriteService.addFavorite(favorite)
          let post = await postService.GetAPost(postId)
          if (post) {
               let userReceiver = await userService.getAUser(post['userId'])
               notification['userConcernId'] = post['userId']
               Socket.emit('user-notification', notification);
               await notificationService.addNotification(notification)
               await ASYNC_REDIS_CLIENT.del("POSTS" + userId);
               let k = Object.entries(langTexts.lang).find((v) => { return (v[1].trim() === constant.FAVORITE_MESSAGE.trim()) })
               const obj = Object.assign({}, k);
               let translateMessage = langTexts.langMatch[Object.keys(langTexts.langMatch).find(v => { return v === obj['0'] })]
               let txtToSend = user.language === "fr" ? constant.FAVORITE_MESSAGE : translateMessage

               await sendNotification.notification(userReceiver['playerId'], user['pseudoIntime'] + ' ' + txtToSend)
          } else {
               let repost = await repostService.ARePost(postId)
               let userReceiver = await userService.getAUser(repost['fromId'])
               notification['userConcernId'] = repost['fromId']
               Socket.emit('user-notification', notification);
               await notificationService.addNotification(notification)
               await ASYNC_REDIS_CLIENT.del("POSTS" + userId);
               let k = Object.entries(langTexts.lang).find((v) => { return (v[1].trim() === constant.FAVORITE_MESSAGE.trim()) })
               const obj = Object.assign({}, k);
               let translateMessage = langTexts.langMatch[Object.keys(langTexts.langMatch).find(v => { return v === obj['0'] })]
               let txtToSend = user.language === "fr" ? constant.FAVORITE_MESSAGE : translateMessage

               await sendNotification.notification(userReceiver['playerId'], user['pseudoIntime'] + ' ' + txtToSend)

          }
          res.status(200).json({ status: 200, data: null, message: "favorite added" });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.addMessageFavorite = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { userId, messageId, type } = req.body
     let favorite = {
          userId: userId,
          postId: messageId,
          type: type
     }
     try {
          await favoriteService.addFavorite(favorite)
          res.status(200).json({ status: 200, data: null, message: "Message favorite added" });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}



exports.removeFavorite = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { userId, postId } = req.body
     let favorite = {
          userId: userId,
          postId: postId
     }
     try {
          await favoriteService.removeFavorite(favorite)
          res.status(200).json({ status: 200, data: null, message: "favorite deleted" });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.checkFavorite = async (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     const { userId, postId } = req.body;
     let query = {
          userId: userId,
          postId: postId
     }
     try {
          let favorite = await favoriteService.CheckFavorite(query);
          if (favorite.length > 0) {
               res.send({ status: 201, data: true, retour: favorite });
          } else {
               res.send({ status: 404, data: false, retour: favorite });
          }
     } catch (error) {
          res.status(500).send({ status: 500, message: err.message });
     }

};
// All about Report

exports.AddReport = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }

     let { userId, postId, reason } = req.body

     let report = {
          userId: userId,
          postId: postId,
          reason: reason,
          type: "POST"
     }

     console.log(report)
     try {
          await reportService.CreateReport(report)
          res.status(200).json({ status: 200, data: null, message: "Report created successfully", });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.listReports = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let reportsList = []

     try {
          let reports = await reportService.listReports()
          for (const report of reports) {
               let post = await postService.GetAPost(report['postId'])
               let userReporter = await userService.getAUser(report['userId'])
               console.log(post)
               if (post != null) {
                    reportsList.push({
                         _id: post._id,
                         userId: post.userId,
                         userPhoto_url: post.userPhoto_url,
                         userPseudo: post.userPseudo,
                         nom: post.nom,
                         prenom: post.prenom,
                         content: post.content,
                         image_url: post.image_url,
                         backgroundColor: post.backgroundColor,
                         includedUsers: post.includedUsers,
                         reason: report.reason,
                         createdAt: report.createdAt,
                         video_url: report.video_url,
                         isPending: report.isPending,
                         isClosed: report.isClosed,
                         isNewlyCreated: report.isNewlyCreated,
                         userReporter: userReporter
                    })
               }

          }
          res.status(200).json({ status: 200, data: reportsList, message: "Reports listed successfully", });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.listSuggestions = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let reportsList = []

     try {
          let reports = await reportService.listSuggestions()
          for (const report of reports) {
               let userReporter = await userService.getAUser(report['userId'])
               reportsList.push({
                    _id: report._id,
                    isPending: report.isPending,
                    isClosed: report.isClosed,
                    reason: report.reason,
                    createdAt: report.createdAt,
                    video_url: report.video_url,
                    isNewlyCreated: report.isNewlyCreated,
                    userReporter: userReporter
               })

          }
          res.status(200).json({ status: 200, data: reportsList, message: "Suggestions listed successfully", });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.listBugs = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let reportsList = []

     try {
          let reports = await reportService.listBugs()
          for (const report of reports) {
               let userReporter = await userService.getAUser(report['userId'])
               reportsList.push({
                    _id: report._id,
                    isPending: report.isPending,
                    isClosed: report.isClosed,
                    reason: report.reason,
                    createdAt: report.createdAt,
                    video_url: report.video_url,
                    isNewlyCreated: report.isNewlyCreated,
                    userReporter: userReporter
               })

          }
          res.status(200).json({ status: 200, data: reportsList, message: "Bugs listed successfully", });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

// All about repost 

exports.AddRePost = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { content, image_url, backgroundColor, productId, price, commercialAction, nom, prenom, userPhoto_url, userPseudo, fromId, postId, reposterId } = req.body
     let post = {
          fromId: fromId,
          reposterId: reposterId,
          userPhoto_url: userPhoto_url,
          userPseudo: userPseudo,
          nom: nom,
          prenom: prenom,
          content: content,
          image_url: image_url,
          postId: postId,
          backgroundColor: backgroundColor,
          price: price,
          productId: productId,
          commercialAction: commercialAction,
          includedUsers: []
     }

     let notification = {
          type: constant.SHARE,
          userConcernId: '',
          fromId: reposterId,
          toId: postId,
          message: constant.SHARE_MESSAGE,
          icon_name: constant.SHARE_ICON

     }

     try {
          let userSender = await userService.getAUser(post['reposterId'])
          let user = await userService.getAUser(fromId)
          let userOwnCircle = await circleService.FindMyCircle(reposterId)
          if (userOwnCircle['membersFriends'].length > 0) {
               post['includedUsers'] = userOwnCircle['membersFriends']
               // for (const usersId of post['includedUsers']) {
               //      client.setex("USERNEWPOST" + usersId, 3600, usersId);
               // }
               // client.setex("USERNEWPOST" + fromId, 3600, fromId);
               // post['userPseudo'] = user['pseudoIntime']
               await repostService.CreateRePost(post)
               let poste = await postService.GetAPost(postId)
               notification['userConcernId'] = poste['userId']
               await notificationService.addNotification(notification)
               Socket.emit('user-notification', notification);
               let k = Object.entries(langTexts.lang).find((v) => { return (v[1].trim() === constant.SHARE_MESSAGE.trim()) })
               const obj = Object.assign({}, k);
               let translateMessage = langTexts.langMatch[Object.keys(langTexts.langMatch).find(v => { return v === obj['0'] })]
               let txtToSend = user.language === "fr" ? constant.SHARE_MESSAGE : translateMessage

               await sendNotification.notification(user['playerId'], userSender['pseudoIntime'] + ' ' + txtToSend)
               res.status(200).json({ status: 200, data: null, message: "rePost created successfully" });
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}



exports.GetARePost = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }

     let { userId, idPost } = req.body
     let userList = []
     try {
          let repost = await repostService.ARePost(idPost)
          let users = await userService.getUsersOnSearchMatch(repost.content)
          let allComments = await commentService.GetAllCommentsOfPost(repost['_id'])
          let favoriteCounts = await favoriteService.CountFavorite(repost['_id'])
          let repostCounts = await repostService.RepostCount(repost['_id'])

          // console.log(post['_id'])
          let myCircle = await circleService.FindMyCircle(userId);
          let circleContent = myCircle['membersFriends']
          // check if matches are in my circle
          for (const u of users) {
               if (circleContent.includes(u['_id'].toString())) {
                    userList.push({
                         _id: u._id,
                         nom: u.nom,
                         prenom: u.prenom,
                         phone: u.phone,
                         photo: u.photo,
                         pseudoIntime: u.pseudoIntime,
                    })
               }
          }


          if (!repost) {
               return res.status(200).json({ status: 200, data: null, message: "rePost got successfully but null", })
          } else {
               let p = {
                    _id: repost._id,
                    userId: repost.userId,
                    userPhoto_url: repost.userPhoto_url,
                    userPseudo: repost.userPseudo,
                    nom: repost.nom,
                    prenom: repost.prenom,
                    content: repost.content,
                    image_url: repost.image_url,
                    video_url: repost.video_url,
                    backgroundColor: repost.backgroundColor,
                    matches: userList,
                    createdAt: repost.createdAt,
                    nbrComments: allComments.length,
                    favoriteCount: favoriteCounts,
                    repostCounts: repostCounts,
                    commercialAction: repost.commercialAction,
                    price: repost.price,
                    views: repost.views

               }
               return res.status(200).json({ status: 200, data: p, message: "rePost got successfully", })
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.UpdateRePost = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }

     let { postId, content, image_url, video_url, backgroundColor } = req.body

     let post = {
          content: content,
          image_url: image_url,
          video_url: video_url,
          backgroundColor: backgroundColor,
     }

     try {
          let repost = await repostService.updateRePost(postId, post)
          return res.status(200).json({ status: 200, data: repost, message: "rePost updated successfully", })
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.UpdatePost = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }

     let { postId, content, image_url, backgroundColor, video_url } = req.body
     let post = {
          content: content,
          image_url: image_url,
          video_url: video_url,
          backgroundColor: backgroundColor,
     }
     try {
          console.log(post)
          let poste = await postService.UpdatePost(postId, post)
          return res.status(200).json({ status: 200, data: poste, message: "Post updated successfully", })
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}

exports.DeletePost = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let postId = req.params.id
     //let userId = req.userId
     let { userId } = req.body

     let poste = {
          isDelete: true,
          deletedAt: Date.now()
     }
     try {
          //let user = await userService.getAUser(userId)
          let post = await postService.GetAPost(postId)
          let repost = await repostService.ARePost(postId)
          if (post) {
               await postService.UpdatePost(postId, poste)
               let reposts = await repostService.getRePostsByPostId(postId)
               for (const reposte of reposts) {
                    await repostService.updateRePost(reposte._id, poste)
               }
               await ASYNC_REDIS_CLIENT.del("POSTS" + userId)
               return res.status(200).json({ status: 200, data: null, message: "Post deleted successfully", })
          }
          if (repost) {
               await repostService.updateRePost(postId, poste)
               await ASYNC_REDIS_CLIENT.del("POSTS" + userId)
               return res.status(200).json({ status: 200, data: null, message: "rePost deleted successfully", })

          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}





// All about comment a post
exports.AddCommentToPost = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { userId, postId, comment } = req.body
     let commentT = {
          userId: userId,
          userPseudo: '',
          userPhoto: '',
          postId: postId,
          comment: comment,
     }

     let notification = {
          type: constant.COMMENT,
          userConcernId: '',
          fromId: userId,
          toId: postId,
          message: constant.COMMENT_MESSAGE,
          icon_name: constant.COMMENT_ICON
     }

     try {
          let userSender = await userService.getAUser(userId)
          if (userSender) {
               commentT['userPseudo'] = userSender['pseudoIntime']
               commentT['userPhoto'] = userSender['photo']
               await commentService.CreateComment(commentT)
               let post = await postService.GetAPost(postId)
               let userReceiver = await userService.getAUser(post['userId'])
               notification['userConcernId'] = post['userId']
               Socket.emit('user-notification', notification);
               await notificationService.addNotification(notification)
               let k = Object.entries(langTexts.lang).find((v) => { return (v[1].trim() === constant.COMMENT_MESSAGE.trim()) })
               const obj = Object.assign({}, k);
               let translateMessage = langTexts.langMatch[Object.keys(langTexts.langMatch).find(v => { return v === obj['0'] })]
               let txtToSend = userReceiver.language === "fr" ? constant.COMMENT_MESSAGE : translateMessage

               await sendNotification.notification(userReceiver['playerId'], userSender['pseudoIntime'] + ' ' + txtToSend)
               let commentList = comment.split(" ")
               for (const word of commentList) {
                    if (word.charAt(0) === '@') {
                         console.log(word)
                         let pseudo = word.slice(1)
                         let mentionnedUser = await userService.getAUserByPseudo(pseudo)
                         let notification = {
                              type: constant.MENTION,
                              userConcernId: mentionnedUser._id,
                              fromId: userId,
                              toId: postId,
                              message: constant.MENTION_COMMENT_MESSAGE,
                              icon_name: constant.MESSAGE_ICON
                         }
                         await notificationService.addNotification(notification)
                         let k = Object.entries(langTexts.lang).find((v) => { return (v[1].trim() === constant.MENTION_COMMENT_MESSAGE.trim()) })
                         const obj = Object.assign({}, k);
                         let translateMessage = langTexts.langMatch[Object.keys(langTexts.langMatch).find(v => { return v === obj['0'] })]
                         let txtToSend = user.language === "fr" ? constant.MENTION_COMMENT_MESSAGE : translateMessage

                         await sendNotification.notification(mentionnedUser['playerId'], userSender['pseudoIntime'] + ' ' + txtToSend)

                    }
               }
               res.status(200).json({ status: 200, data: null, message: "Post commented successfully" });
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.AllCommentsOfPost = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let postId = req.params.postId
     let responses = []
     try {
          let allComments = await commentService.GetAllCommentsOfPost(postId)
          for (const aC of allComments) {
               let allCommentsOfComments = await responseService.GetAllResponsesOfComment(aC._id)
               responses.push({
                    _id: aC._id,
                    userId: aC.userId,
                    userPseudo: aC.userPseudo,
                    listCommentsOfComment: allCommentsOfComments.length,
                    userPhoto: aC.userPhoto,
                    postId: aC.postId,
                    comment: aC.comment,
                    createdAt: aC.createdAt
               })
          }
          res.status(200).json({ status: 200, data: responses, message: "Post retrieved successfully" });
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


// All about response to a comment 


exports.AddCommentToComment = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { userId, commentId, comment } = req.body
     let commentT = {
          userId: userId,
          userPseudo: '',
          userPhoto: '',
          commentId: commentId,
          comment: comment,
     }
     try {
          let user = await userService.getAUser(userId)
          if (user) {
               commentT['userPseudo'] = user['pseudoIntime']
               commentT['userPhoto'] = user['photo']
               await responseService.CreateResponse(commentT)
               res.status(200).json({ status: 200, data: null, message: "Comment commented successfully" });
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.AllCommentsOfComment = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let commentId = req.params.commentId
     try {
          let allComments = await responseService.GetAllResponsesOfComment(commentId)
          if (allComments != undefined) {
               res.status(200).json({ status: 200, data: allComments, message: "Comments retrieved successfully" });
          } else {
               res.status(200).json({ status: 200, data: null, message: "Comments retrieved successfully" });
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.listNotification = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }


     let notificationsList = []
     let userId = req.params.id

     let lang = req.query.lang
     let page = parseInt(req.query.page);
     let limit = parseInt(req.query.limit);
     let skipIndex = (page - 1) * limit;
     let query = {
          page: page,
          limit: limit,
          skipIndex: skipIndex
     }
     try {
          {
               let notifications = await notificationService.listNotifications(userId, query)
               for (const notification of notifications) {
                    let user = await userService.getAUser(notification['fromId'])

                    let k = Object.entries(langTexts.lang).find((v) => { return (v[1].trim() === notification['message'].trim()) })
                    const obj = Object.assign({}, k);
                    let translateMessage = langTexts.langMatch[Object.keys(langTexts.langMatch).find(v => { return v === obj['0'] })]
                    if (notification['linkerId']) {
                         let linkerUser = await userService.getAUser(notification['linkerId'])
                         let user = await userService.getAUser(userId)
                         notificationsList.push({
                              fromId: notification['fromId'],
                              toId: notification['toId'],
                              pseudoIntime: user.accountType === "ADMIN" ? "TeepZy" : user['pseudoIntime'],
                              message: user.language === 'fr' ? notification['message'] : translateMessage,
                              // message: notification['message'],
                              icon_name: notification['icon_name'],
                              createdAt: notification['createdAt'],
                              linkerUserPseudo: linkerUser['pseudoIntime'],
                              postId: notification['postId'],
                              retourLink: notification['retourLink'],
                              roomId: notification['roomId'],

                         })
                    } else {
                         let user = await userService.getAUser(userId)
                         notificationsList.push({
                              fromId: notification['fromId'],
                              toId: notification['toId'],
                              pseudoIntime: user.accountType === "ADMIN" ? "TeepZy" : user['pseudoIntime'],
                              //message: notification['message'],
                              message: user.language === 'fr' ? notification['message'] : translateMessage,
                              icon_name: notification['icon_name'],
                              createdAt: notification['createdAt'],
                              linkerUserPseudo: '',
                              postId: notification['postId'],
                              retourLink: notification['retourLink'],
                              roomId: notification['roomId'],

                         })
                    }

               }
               res.status(200).json({ status: 200, data: notificationsList, message: "My Notifications retrieved successfully" });
               //    await ASYNC_REDIS_CLIENT.setex("NOTIFICATIONS" + userId, 5, JSON.stringify(notificationsList));

          }

     } catch (error) {

     }

}



exports.listMentionNotifications = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let notificationsList = []
     let userId = req.params.id

     try {
          const CACHE_RES = await ASYNC_REDIS_CLIENT.get("NOTIFICATIONS_MENTION" + userId);
          if (CACHE_RES) {
               res.status(200).json({ status: 200, data: JSON.parse(CACHE_RES), message: "My Notifications mentions cache retrieved successfully" });
          } else {
               let notifications = await notificationService.listMentions(userId)
               for (const notification of notifications) {
                    let user = await userService.getAUser(notification['fromId'])
                    notificationsList.push({
                         fromId: notification['fromId'],
                         type: notification['type'],
                         toId: notification['toId'],
                         pseudoIntime: user.accountType === "ADMIN" ? "TeepZy" : user['pseudoIntime'],
                         message: notification['message'],
                         icon_name: notification['icon_name'],
                         createdAt: notification['createdAt'],
                         linkerUserPseudo: '',
                         postId: notification['postId'],
                         retourLink: notification['retourLink'],
                         roomId: notification['roomId'],

                    })

               }
               await ASYNC_REDIS_CLIENT.setex("NOTIFICATIONS_MENTION" + userId, 150, JSON.stringify(notificationsList));
               res.status(200).json({ status: 200, data: notificationsList, message: "My Notifications mentions retrieved successfully" });

          }

     } catch (error) {

     }

}



exports.NbrUnreadNotifications = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let userId = req.params.id
     try {
          let nbrUnreadNotifications = await notificationService.NbrUnreadNotifications(userId)
          res.status(200).json({ status: 200, data: nbrUnreadNotifications, message: "My unread Notifications retrieved successfully" });
     } catch (error) {

     }

}

exports.markNotificationRead = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let userId = req.params.id
     try {
          await notificationService.markNotificationRead(userId)
          res.status(200).json({ status: 200, data: null, message: "My Notifications marked read successfully" });
     } catch (error) {

     }

}


/*
All about user project and product
*/



exports.CreateProject = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }

     let { userId, nom, photo, tags, userPhoto_url, userPseudo, description } = req.body

     let project = {
          userId: userId,
          nom: nom,
          photo: photo,
          tags: tags,
          description: description,
          userPseudo: userPseudo,
          userPhoto_url: userPhoto_url
     }
     try {
          let p = await projectService.CreateProject(project)
          res.status(200).json(p);
     } catch (error) {
          console.log(error)
     }

}



exports.DeleteProject = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }

     let id = req.params.id
     try {
          await projectService.DeleteProject(id)
          res.status(200).json({ status: 200, message: 'Project deleted successfully' });
     } catch (error) {
          console.log(error)
     }

}





exports.CreateProduct = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let { userId, nom, photo, price, description, commercialAction, userPhoto_url, userPseudo, tags } = req.body
     let product = {
          userId: userId,
          nom: nom,
          photo: photo,
          price: price,
          description: description,
          tags: tags,
          userPhoto_url: userPhoto_url,
          userPseudo: userPseudo,
          commercialAction: commercialAction,

     }
     try {

          let p = await productService.CreateProduct(product)
          res.status(200).json(p);
     } catch (error) {

     }

}

exports.DeleteProduct = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }

     let id = req.params.id
     try {
          await productService.DeleteProduct(id)
          console.log(id)
          let relativePost = await postService.GetAPostByProductId(id)
          //delete relative post too
          console.log(relativePost)
          if (relativePost) {
               let deleteI = { isDelete: true }
               const deleted = await ASYNC_REDIS_CLIENT.del("POSTS" + relativePost.userId)
               await postService.UpdatePost(relativePost._id, deleteI)
          }
          res.status(200).json({ status: 200, message: 'Product deleted successfully' });
     } catch (error) {
          console.log(error)
     }

}



// search on match
exports.SearchOnMatch = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }

     let { searchValue, userId } = req.body

     let search = {
          userId: userId,
          valeur: searchValue,
     }
     let userList = []
     let projectList = []
     let productList = []
     let postsList = []
     let mergeLevel2CircleMembers = []

     try {

          let projects = await projectService.getProjectsOnSearchMatch(search.valeur)
          let shops = await productService.getProductsOnSearchMatch(search.valeur)
          let users = await userService.getUsersOnSearchMatch(search.valeur)
          let posts = await postService.getPostsOnSearchMatch(search.valeur)

          let myCircle = await circleService.FindMyCircle(search.userId);
          let circleContent = myCircle['membersFriends']
          for (const cc of circleContent) {
               let level_2_Circle = await circleService.FindMyCircle(cc);
               mergeLevel2CircleMembers = level_2_Circle['membersFriends']
          }
          // merge all first and second level circle members
          let mergeGlobalCircleMembers = [...circleContent, ...mergeLevel2CircleMembers];



          for (const u of users) {
               if (mergeGlobalCircleMembers.indexOf(u['_id'].toString()) > -1) {
                    let myC = await circleService.FindMyCircle(u._id)
                    let myCcount = myC['membersFriends']
                    userList.push({
                         _id: u._id,
                         nom: u.nom,
                         prenom: u.prenom,
                         phone: u.phone,
                         photo: u.photo,
                         pseudoIntime: u.pseudoIntime,
                         circleMembersCount: myCcount.length
                    })
               }

          }
          for (const p of posts) {
               if (mergeGlobalCircleMembers.indexOf(p['userId'].toString()) > -1) {
                    console.log("success");
                    postsList.push(p)
               }

          }
          for (const s of shops) {
               if (mergeGlobalCircleMembers.indexOf(s['userId'].toString()) > -1) {
                    console.log("success");
                    productList.push(s)
               }

          }
          for (const pr of projects) {
               if (mergeGlobalCircleMembers.indexOf(pr['userId'].toString()) > -1) {
                    console.log("success");
                    projectList.push(pr)
               }

          }


          res.status(200).json({ status: 200, products: productList, projects: projectList, users: userList, posts: postsList, message: "searched successfully" });
     } catch (error) {
          console.log(error)
     }

}



exports.SearchTeepzrsNotInMyCircle = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }

     let { searchValue, userId } = req.body

     let search = {
          userId: userId,
          valeur: searchValue,
     }
     let userList = []
     try {
          let myCircle = await circleService.FindMyCircle(search.userId);
          let circleContent = myCircle['membersFriends']
          let users = await userService.getUsersOnSearchMatch(search.valeur)
          for (const u of users) {
               if (u['_id'] != search.userId) {
                    let myC = await circleService.FindMyCircle(u['_id'])
                    if (myC !== null) {
                         let myCcount = myC['membersFriends']
                         circleContent.includes(u._id.toString()) ? null : userList.push({ _id: u._id, nom: u.nom, prenom: u.prenom, phone: u.phone, photo: u.photo, pseudoIntime: u.pseudoIntime, circleMembersCount: myCcount.length })
                    }
               }
          }
          res.status(200).json({ status: 200, users: userList, message: "searched successfully" });
     } catch (error) {
          console.log(error)
     }

}


exports.SearchTeepzrsMatchInMyCircle = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }

     let { searchValue, userId } = req.body

     let search = {
          userId: userId,
          valeur: searchValue,
     }
     let userList = []
     try {
          let myCircle = await circleService.FindMyCircle(search.userId);
          let circleContent = myCircle['membersFriends']
          let users = await userService.getUsersOnPseudoSearchMatch(search.valeur)
          console.log(users)
          for (const u of users) {
               if (u['_id'] != search.userId) {
                    let myC = await circleService.FindMyCircle(u['_id'])
                    let myCcount = myC['membersFriends']
                    circleContent.includes(u._id.toString()) ? userList.push({ _id: u._id, nom: u.nom, prenom: u.prenom, phone: u.phone, photo: u.photo, pseudoIntime: u.pseudoIntime, circleMembersCount: myCcount.length }) : null

               }
          }
          res.status(200).json({ status: 200, users: userList, message: "searched successfully" });
     } catch (error) {
          console.log(error)
     }

}


exports.DeleteUser = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }
     let userId = req.body.userId
     let adminUserId = req.userId
     try {
          let adminUser = await userService.getAUser(adminUserId)
          console.log(adminUser)
          if (adminUser.accountType === "ADMIN") {
               await userService.deleteUser(userId)
               return res.status(200).json({ status: 200, data: null, message: "User deleted successfully", })
          } else {
               return res.status(402).json({ status: 402, data: null, message: "User is not authorized", })
          }
     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}



// App Version

exports.AddAppNewVersion = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }

     try {
          let { numero } = req.body
          let numeroSplitted = numero.split('.')
          if (numeroSplitted.length !== 3) res.status(400).json({ status: 400, message: "Version number must be in following format: 0.0.0" })
          let GMV = await versionService.GetMobileVersion()
          let numeroNumber = numero.split('.').join('')
          let GMVNumber = GMV[0]['numero'].split('.').join('')
          if (parseInt(numeroNumber) <= parseInt(GMVNumber)) res.status(400).json({ status: 400, message: "new Version number must be greater than the previous one" })
          if (parseInt(numeroNumber) > parseInt(GMVNumber)) {
               await versionService.NewMobileVersion({ numero: numero })
               res.status(200).json({ status: 200, data: null, message: 'New Mobile Version got succesfully' });
          }

     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}


exports.CreateAppNewVersion = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }

     try {
          let { numero } = req.body
          await versionService.AddMobileVersion({ numero: numero })
          res.status(200).json({ status: 200, data: null, message: 'Add Mobile Version got succesfully' });

     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}
exports.GetAppNewVersion = async (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          const error = new Error('Validation failed.');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
     }

     try {
          let GMV = await versionService.GetMobileVersion()
          res.status(200).json({ status: 200, data: GMV, message: 'New Mobile Version got succesfully' });

     } catch (error) {
          console.log(error);
          res.status(500).json({ error: error });
     }
}




