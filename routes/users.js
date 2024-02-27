const express = require('express');
const router = express.Router();
const userController = require('../app/api/controllers/users');


const multer = require('multer');
var fs = require('fs');


var storage = multer.diskStorage({
    // destination
    destination: function (req, file, cb) {
        var dir = `public/uploads/`;
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString()+'user_'+req.params.id+'_'+file.originalname);
    }
});
var upload = multer({ storage: storage });


router.post('/register', userController.signupUser);
router.post('/authenticate', userController.signing);
router.post('/checkEmail', userController.checkUserEmail);
router.post('/authenticate_admin', userController.signingAdministrator);
router.post('/updatePass', userController.changeUserPassword);


router.post('/update', userController.updateUser);
router.post('/updateInfo', userController.updateUserInfo);
router.post('/updatePlayerId', userController.updateUserPlayerId);
router.post('/getOnline', userController.setUserOnline);
router.get('/getOnlineUsers', userController.getOnlineUsers);
router.post('/activate', userController.activateUser);
router.post('/unactivate', userController.UnActivateUser);
router.post('/changeAccount', userController.changeAccount);

router.post('/authorizeContacts', userController.AuthorizeContacts);
router.post('/authorizePhotos', userController.AuthorizePhotos);
router.post('/authorizeConversationNotifications', userController.AuthorizeConversationNotifications);
router.post('/authorizeInvitationNotifications', userController.AuthorizeInvitationNotifications);

router.post('/updateProfile', userController.updateUserProfile);
router.post('/updateProfile2', userController.updateUserProfile2);
router.post('/addProject', userController.CreateProject);
router.delete('/deleteProject/:id', userController.DeleteProject);
router.post('/addProduct', userController.CreateProduct);
router.delete('/deleteProduct/:id', userController.DeleteProduct);
router.post('/check', userController.checkUser);

router.post('/SmsInvited', userController.SendInvitationViaSms);
router.post('/inviteToJoinCircle', userController.SendInvitation);
router.post('/cancelToJoinCircle', userController.CancelInvitation);
router.post('/linkPeople', userController.SendInvitationToLink);
router.post('/linksPeoples', userController.ListLinksTo);
router.post('/refuseLinkPeople', userController.RefuseALinkTo);
router.post('/closeLinkPeople', userController.CloseALinkTo);
router.post('/acceptLinkPeople', userController.AcceptLink);
router.post('/checkInMycircle', userController.checkIfUserInMyCircle);
router.post('/removeFromCircle', userController.RemoveMemberFromCircle);


router.post('/acceptToJoinCircle', userController.AcceptInvitation);
router.post('/invitations', userController.ListInvitation);
router.post('/invitationsSms', userController.ListInvitationViaSms);


router.post('/checkSmsInvitation', userController.checkInvitationViaSms);
router.post('/deleteSmsInvitation', userController.DeleteInvitationViaSms);

router.post('/checkInvitation', userController.checkInvitation);
router.get('/user/:id', userController.getUser);

router.get('/teepzr/:id', userController.getTeepZrNotInMyCircle);

router.post('/teepzrto', userController.SearchTeepzrsNotInMyCircle);
router.post('/searchTeepzrsInCircle', userController.SearchTeepzrsMatchInMyCircle);
router.get('/circle/:id', userController.getCircleMembers);


//router.get('/users/:id', userController.getUsers);
router.get('/teepzr/eventualsTeepzrs/:id', userController.GetTeepZrEventualKnown);
router.post('/posts', userController.AddPost);
router.post('/admin/posts', userController.AddAdminPost);
router.put('/post/update', userController.UpdatePost);
router.put('/post/:id', userController.DeletePost);

router.post('/reposts', userController.AddRePost);
router.get('/repost/:id', userController.GetARePost);
router.put('/repost/update', userController.UpdateRePost);


router.post('/reports', userController.AddReport);
router.post('/reports/bug', userController.ReportBug);
router.post('/suggestion', userController.Suggest);
router.post('/block', userController.blockUserAccount);
router.post('/unblock', userController.UnblockUserAccount);


router.get('/posts/all/:id', userController.GetPosts);
router.get('/posts/my/:id', userController.GetMyPosts);
router.post('/posts/apost', userController.GetAPost);

router.get('/comments/all/:postId', userController.AllCommentsOfPost);
router.post('/comments/all', userController.AddCommentToPost);

router.post('/comments/comment/all', userController.AddCommentToComment);
router.get('/comments/comment/all/:commentId', userController.AllCommentsOfComment);

router.get('/notifications/:id', userController.listNotification);
router.get('/notifications_mentions/:id', userController.listMentionNotifications);


router.get('/notifications/unreads/:id', userController.NbrUnreadNotifications);
router.get('/notifications/mark/:id', userController.markNotificationRead);


router.post('/checkFavorite', userController.checkFavorite);
router.get('/myFavorite/:id', userController.GetMyFavorites);
router.post('/addFavorite', userController.addFavorite);
router.post('/removeFavorite', userController.removeFavorite);
router.post('/addMessageFavorite', userController.addMessageFavorite);

router.post('/searchMatch', userController.SearchOnMatch);
router.get('/reports', userController.listReports);
router.get('/bugs', userController.listBugs);

router.get('/all/teepzs', userController.GetAllTeepzs);


router.post("/upload/",upload.single('files'),userController.uploadPhoto);






module.exports = router;