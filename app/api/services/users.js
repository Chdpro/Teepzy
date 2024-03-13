const userModel = require('../models/users');
const invitationModel = require('../models/invitationJoinCircle');
const linkToModel = require('../models/linkTo');
const invitationSmsModel = require('../models/inivtationViaSms');
const circleModel = require('../models/circle');
const mongoose = require('mongoose');
const remove_stopwords = require('../functions/rm_stop_words');
const constant = require('../constants/constant');


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (user) => {
    try {
        let usr = await userModel.findOne({ email: user.email })
        // let pA = await userModel.findOne({ pseudoIntime: user.pseudoIntime })
        if (usr) {
            return { status: 403, msg: 'User already exists' }
        } else {
            await userModel.create({
                nom: user.nom,
                prenom: user.prenom,
                phone: user.phone,
                email: user.email,
                password: user.password,
                // playerId: user.playerId
            });
            return { status: 200, msg: 'User added successfully' }
        }
    } catch (error) {
        console.log(error);
    }
}

// exports.getAUser = async (userId) => {
//     try {
//         let userI = await userModel.findById(userId);
//         if (!userI) {
//             return null;
//         } else {
//             let userInfo = userI
//             return userInfo;
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

exports.getAUser = async (userId) => {
    try {
      // Validate the userId before querying:
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.warn(`Invalid ObjectId provided for user query: ${userId}`);
        return null;
      }
  
      const userI = await userModel.findById(userId);
  
      return userI ?? null; // Use nullish coalescing for concise return
    } catch (error) {
      console.error(`Error fetching user: ${error.message}`); // Log a descriptive error message
      throw error; // Re-throw the error for further handling if needed
    }
  };
  

exports.getAUserByPseudo = async (pseudo) => {
    try {
        let userI = await userModel.findOne({ pseudoIntime: pseudo });
        if (userI) {
            let userInfo = userI
            return userInfo;
        }
    } catch (error) {
        console.log(error);
    }
}

exports.getNbrUsersOnSex = async () => {
    try {
        let usersM = await userModel.find({ gender: constant.HOMME, accountType: "PUBLIC" });
        let usersF = await userModel.find({ gender: constant.FEMME, accountType: "PUBLIC" });
        let usersP = await userModel.find({ gender: constant.PERSONNALISE, accountType: "PUBLIC" });
        let stats = {
            usersMen: usersM.length,
            usersWomen: usersF.length,
            usersPersonnalised: usersP.length
        }
        return stats
    } catch (error) {
        console.log(error);
    }
}


// exports.checkUser = async (user) => {
//     let userI
//     try {
//         let userIntime = {
//             pseudoIntime: user.pseudoIntime,
//         }

//         userIntime.pseudoIntime != '' ? userI = await userModel.findOne(userIntime) : null;
//         if (userI) {
//             return { status: 201, message: "username exists", data: null }
//         } else {
//             return { status: 404, message: "username does not exist", data: null }
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

exports.checkUser = async (user) => {
    try {
      const userIntime = { pseudoIntime: user.pseudoIntime };
  
      let userI = null;
      if (userIntime.pseudoIntime !== '') {
        userI = await userModel.findOne(userIntime);
      }
  
      if (userI) {
        return { status: 200, message: "username exists", data: null }; // Use 200 for success
      } else {
        return { status: 404, message: "username does not exist", data: null };
      }
    } catch (error) {
      console.error(`Error checking for user: ${error.message}`);
      throw error; // Re-throw for potential further handling
    }
  };
  

exports.getUserConnected = async (user) => {
    let userId = user.userId

    try {
        let userI = await userModel.findById(userId);
        if (!userI) {
            return { status: 404, message: "user does not exist", data: null };
        } else {
            let userI = {
                isOnline: user.isOnline,

            }
            await userModel.findByIdAndUpdate(userId, userI);
            return { status: 200, message: "user updated", data: null }
        }
    } catch (error) {
        console.log(error);
    }
}

exports.OnlineUsers = async () => {
    try {
        let onlineUsers = await userModel.find({ isOnline: true, accountType: "PUBLIC" });
        return onlineUsers
    }
    catch (error) {
        console.log(error);
    }

}



exports.changeUserPassword = async (user) => {
    let userId = user.userId

    try {
        let userI = await userModel.findById(userId);
        if (!userI) {
            return { status: 404, message: "user does not exist", data: null };
        } else {
            let userI = {
                password: user.password,
            }
            await userModel.findByIdAndUpdate(userId, userI);
            return { status: 200, message: "user password updated", data: null }
        }
    } catch (error) {
        console.log(error);
    }
}
exports.updateUser = async (user) => {
    let userId = user.userId

    try {
        let userI = await userModel.findById(userId);
        if (!userI) {
            return { status: 404, message: "user does not exist", data: null };
        } else {
            let userI = {
                pseudoIntime: user.pseudoIntime,
                birthday: user.birthday,
                photo: user.photo,
                isCompleted: user.isCompleted,
                gender: user.gender
            }
            await userModel.findByIdAndUpdate(userId, userI);
            return { status: 200, message: "user updated", data: null }
        }
    } catch (error) {
        console.log(error);
    }
}



exports.updateUserInfo = async (user) => {
    let userId = user.userId

    try {

        let userI = await userModel.findById(userId);
        if (!userI) {
            return { status: 404, message: "user does not exist", data: null };
        } else {
            let userI = {
                pseudoIntime: user.pseudoIntime,
                birthday: user.birthday,
                phone: user.phone,
                email: user.email
            }
            await userModel.findByIdAndUpdate(userId, userI);
            return { status: 200, message: "user updated", data: null }
        }
    } catch (error) {
        console.log(error);
    }
}




exports.ActivateUnactivateUser = async (user) => {
    let userId = user.userId

    try {
        let userI = await userModel.findById(userId);
        if (!userI) {
            return { status: 404, message: "user does not exist", data: null };
        } else {
            let userI = {
                isActivated: user.isActivated,
            }
            await userModel.findByIdAndUpdate(userId, userI);
            return { status: 200, message: "user updated", data: null }
        }
    } catch (error) {
        console.log(error);
    }
}

exports.ChangeAccount = async (user) => {
    let userId = user.userId

    try {
        let userI = await userModel.findById(userId);
        if (!userI) {
            return { status: 404, message: "user does not exist", data: null };
        } else {
            let userI = {
                typeCircle: user.typeCircle,
            }
            await userModel.findByIdAndUpdate(userId, userI);
            return { status: 200, message: "user updated", data: null }
        }
    } catch (error) {
        console.log(error);
    }
}





exports.updateUserProfile = async (user) => {
    let userId = user.userId
    try {
        let userI = await userModel.findById(userId);
        if (!userI) {
            return { status: 404, message: "user does not exist", data: null };
        } else {
            await userModel.findByIdAndUpdate(userId, user);
            return { status: 200, message: "user updated", data: null }
        }
    } catch (error) {
        console.log(error);
    }
}

exports.signing = async (req, user) => {
    try {
        let userI = await userModel.findOne({ email: user.email, accountType: "PUBLIC" });
        if (userI != null && bcrypt.compareSync(user.password, userI.password)) {
            const token = jwt.sign({ id: userI._id }, req.app.get('secretKey'), {});
            let userInfo = { status: 200, message: "user found!", data: { userI, token: token } }
            return userInfo;
        } else {
            let err = { status: 404, auth: false, message: "Invalid email/password!", data: null }
            return err;
        }
    } catch (error) {
        console.log(error);
    }
}



exports.signingAdmin = async (req, user) => {
    try {
        let userI = await userModel.findOne({ email: user.email, accountType: "ADMIN" });
        if (userI != null && bcrypt.compareSync(user.password, userI.password)) {
            const token = jwt.sign({ id: userI._id }, req.app.get('secretKey'), {});
            let userInfo = { status: 200, message: "user found!", data: { userI, token: token } }
            return userInfo;
        } else {
            let err = { status: 404, auth: false, message: "Invalid email/password!", data: null }
            return err;
        }
    } catch (error) {
        console.log(error);
    }
}



exports.checkUserEmail = async (user) => {
    try {
        let userI = await userModel.findOne({ email: user.email });
        if (userI) {
            let userInfo = { status: 200, message: "user found!", data: userI }
            return userInfo;
        } else {
            let err = { status: 404, auth: false, message: "Invalid email/password!", data: null }
            return err;
        }
    } catch (error) {
        console.log(error);
    }
}



exports.SendInvitationToJoinCircle = async (invitation) => {
    console.log(invitation)

    try {
        let contact = await invitationModel.find(invitation);
        if (contact.length == 0) {
            await invitationModel.create(invitation);
            let data = { status: 200, data: null, message: "Invitation sent successfully", }
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}


exports.CancelInvitationToJoinCircle = async (invitation) => {
    let query = {
        idSender: invitation.idSender,
        idReceiver: invitation.idReceiver,
    }
    try {

        let inv = await invitationModel.findOne(query);
        console.log(inv)
        if (inv) {
            await invitationModel.findByIdAndDelete(inv['_id']);
            let data = { status: 200, data: null, message: "Invitation canceled successfully", }
            return data;
        } else {
            return { status: 400, data: null, message: "Invitation not canceled successfully", }
        }
    } catch (error) {
        console.log(error);
    }
}


exports.AcceptInvitationToJoinCircle = async (idInvitation, invitation) => {
    try {
        await invitationModel.findByIdAndUpdate(idInvitation, invitation);
        let data = { status: 200, data: null, message: "Invitation accepted successfully", }
        return data;
    } catch (error) {
        console.log(error);
    }
}


exports.SendLinkToJoin = async (invitation) => {
    console.log(invitation)

    try {
        let contact = await linkToModel.find(invitation);
        if (contact.length == 0) {
            await linkToModel.create(invitation);
        }
    } catch (error) {
        console.log(error);
    }
}

exports.AcceptALinkTo = async (idInvitation, invitation) => {
    try {
        await linkToModel.findByIdAndUpdate(idInvitation, invitation);

    } catch (error) {
        console.log(error);
    }
}


exports.ALinkTo = async (idInvitation) => {
    try {
        let link = await linkToModel.findById(idInvitation);
        return link;
    } catch (error) {
        console.log(error);
    }
}
exports.BlockUser = async (UserId, user) => {
    try {
        await userModel.findByIdAndUpdate(UserId, user);
    } catch (error) {
        console.log(error);
    }
}

exports.LinksByUserSender = async (idSender) => {
    let IList = []
    try {
        let list = await linkToModel.find({ idSender: idSender });
        for (const l of list) {
            let UserLinker = await userModel.findById(l['linkerId']);
            let UserSender = await userModel.findById(l['idSender']);
            IList.push(
                {
                    _id: l['_id'],
                    senderId: l['idSender'],
                    photo: UserSender['photo'],
                    pseudo: UserSender['pseudoIntime'],
                    pseudoLinker: UserLinker['pseudoIntime'],
                    typeLink: l['typeLink'],
                    createdAt: l['createdAt'],
                    postId: l['postId'],
                    message: l['message'],
                    isLinked: l['isLinked'],
                    isDeleted: l['isDeleted'],
                }
            )
        }
        return IList;
    } catch (error) {
        console.log(error);
    }
}



exports.LinksByUserReceiver = async (idReceiver) => {
    let IList = []
    try {
        let list = await linkToModel.find({ idReceiver: idReceiver });
        for (const l of list) {
            let UserLinker = await userModel.findById(l['linkerId']);
            let UserSender = await userModel.findById(l['idSender']);
            IList.push(
                {
                    _id: l['_id'],
                    senderId: l['idSender'],
                    photo: UserSender['photo'],
                    pseudo: UserSender['pseudoIntime'],
                    pseudoLinker: UserLinker['pseudoIntime'],
                    typeLink: l['typeLink'],
                    createdAt: l['createdAt'],
                    postId: l['postId'],
                    message: l['message'],
                    isLinked: l['isLinked'],
                    isDeleted: l['isDeleted'],
                }
            )
        }
        return IList;
    } catch (error) {
        console.log(error);
    }
}


exports.ListLinks = async (idReceiver) => {
    let IList = []
    try {
        let query = {
            idReceiver: idReceiver,
            accept: false,
            isDeleted: false
        }
        let list = await linkToModel.find(query);
        console.log(list)
        for (const l of list) {
            let UserLinker = await userModel.findById(l['linkerId']);
            let UserSender = await userModel.findById(l['idSender']);

            IList.push(
                {
                    _id: l['_id'],
                    senderId: l['idSender'],
                    photo: UserSender['photo'],
                    pseudo: UserSender['pseudoIntime'],
                    pseudoLinker: UserLinker['pseudoIntime'],
                    typeLink: l['typeLink'],
                    createdAt: l['createdAt'],
                    postId: l['postId'],
                    message: l['message'],
                    isLinked: l['isLinked'],
                    isDeleted: l['isDeleted'],

                }
            )
        }
        let data = { status: 200, data: IList, message: "Links listed successfully", }
        return data;
    } catch (error) {
        console.log(error);
    }
}


exports.ListLinksCount = async () => {
    try {
        let list = await linkToModel.find();
        return list.length;
    } catch (error) {
        console.log(error);
    }
}

exports.ListLinksAcceptedCount = async () => {
    try {
        let list = await linkToModel.find({ accept: true });
        return list;
    } catch (error) {
        console.log(error);
    }
}

exports.ListLinksRefusedCount = async () => {
    try {
        let list = await linkToModel.find({ accept: false });
        return list;
    } catch (error) {
        console.log(error);
    }
}


exports.RefuseLink = async (linkId) => {
    try {
        let invt = await linkToModel.findOne(linkId)
        if (invt) {
            let Link = {
                accept: false,
                isDeleted: false
            }
            await linkToModel.findByIdAndUpdate(invt['_id'], Link);
        }
    } catch (error) {
        console.log(error);
    }
}

exports.CloseLink = async (linkId) => {
    try {
        let invt = await linkToModel.findOne(linkId)
        if (invt) {
            let Link = {
                accept: false,
                isDeleted: true
            }
            await linkToModel.findByIdAndUpdate(invt['_id'], Link);
        }
    } catch (error) {
        console.log(error);
    }
}

exports.ListInvitation = async (idReceiver) => {
    let IList = []
    try {
        let query = {
            idReceiver: idReceiver,
            accept: false
        }
        let list = await invitationModel.find(query);
        console.log(list)
        for (const l of list) {
            let UserSender = await userModel.findById(l['idSender']);
            console.log(UserSender)
            IList.push(
                {
                    _id: l['_id'],
                    senderId: l['idSender'],
                    photo: UserSender['photo'],
                    pseudo: UserSender['pseudoIntime'],
                    typeLink: l['typeLink'],
                    createdAt: UserSender['createdAt']
                }
            )
        }
        let data = { status: 200, data: IList, message: "Invitation listed successfully", }
        return data;
    } catch (error) {
        console.log(error);
    }
}





exports.ListInvitationViaSms = async (idReceiver) => {
    let IList = []
    try {
        let query = {
            idReceiver: idReceiver,
            accept: false
        }
        let list = await invitationSmsModel.find(query);
        for (const l of list) {
            let UserSender = await userModel.findById(l['idSender']);
            IList.push(
                {
                    _id: l['_id'],
                    senderId: l['idSender'],
                    photo: UserSender['photo'],
                    pseudo: UserSender['pseudoIntime'],
                    typeLink: l['typeLink'],
                    createdAt: l['createdAt']
                }
            )
        }
        let data = { status: 200, data: IList, message: "InvitationViaSms listed successfully", }
        return data;
    } catch (error) {
        console.log(error);
    }
}

exports.SendInvitationBySms = async (invitation) => {
    try {
        await invitationSmsModel.create(invitation);
    } catch (error) {
        console.log(error);
    }
}

exports.DeleteInvitationBySms = async (invitation) => {
    try {
        let invt = await invitationSmsModel.findOne(invitation)
        if (invt) {
            await invitationSmsModel.findByIdAndDelete(invt['_id']);
        }
    } catch (error) {
        console.log(error);
    }
}


exports.CheckInvitationBySms = async (invitation) => {
    let phone = invitation.phone
    try {
        let contact = await invitationSmsModel.findOne({ phone: phone });
        return contact;
    } catch (error) {
        console.log(error);
    }
}

exports.CheckInvitation = async (invitation) => {
    try {
        let contact = await invitationModel.find(invitation);
        return contact;
    } catch (error) {
        console.log(error);
    }
}

exports.getUsers = async (userId) => {
    try {
        let users = await userModel.find({ _id: { $ne: userId }, accountType: "PUBLIC" });
        return users;
    } catch (error) {
        console.log(error);
    }
}

exports.getUsersOnSearchMatch = async (searchValue) => {
    let fr_stopwords = remove_stopwords.remove_stopwords(searchValue, constant.STOP_WORDS)
    try {
        console.log(searchValue)
        console.log(fr_stopwords)
        let users = await userModel.find({ $text: { $search: fr_stopwords }, accountType: "PUBLIC" }, { score: { $meta: "textScore" } })
        return users;
    } catch (error) {
        console.log(error);
    }
}

exports.getUsersOnPseudoSearchMatch = async (searchValue) => {
    let fr_stopwords = remove_stopwords.remove_stopwordsDots(searchValue, constant.STOP_WORDS)
    try {
        let users = await userModel.find({ $text: { $search: fr_stopwords }, accountType: "PUBLIC" })
        return users;
    } catch (error) {
        console.log(error);
    }
}


exports.deleteUser = async (userId) => {
    try {
        await userModel.findByIdAndUpdate(userId, { isDeleted: true })
    } catch (error) {
        console.log(error);
    }
}

exports.GetTeepZrNotInMyCircle = async (UserId) => {
    let userCircleMembers = []
    let userTeepzrs = []
    try {
        let userCircle = await circleModel.findOne({ idCreator: UserId });
        if (userCircle.membersFriends.length > 0) {
            userCircleMembers = userCircle['membersFriends']
            let uT = await userModel.find({ _id: { $nin: [...userCircleMembers, UserId] }, accountType: "PUBLIC" });
            userTeepzrs = [...uT]
            return userTeepzrs;
        }
        else {
            userTeepzrs = await userModel.find({ _id: { $ne: UserId }, accountType: "PUBLIC" });
            return userTeepzrs;
        }
    } catch (error) {
        console.log(error);
    }
}


exports.GetTeepZrEventualKnown = async (UserId) => {
    let idCreatorCircle = {
        idCreator: UserId
    }
    let userCircleMembers = []
    let randomUserCircleMembers = []
    let randomUsers = []
    let randomLevel2Users = []
    let eventualKnownUsers = []
    let randomLevel2UsersId = []
    try {
        let userCircle = await circleModel.find(idCreatorCircle);
        if (userCircle[0].membersFriends.length > 0) {
            userCircleMembers = userCircle[0]['membersFriends']
        } else {
            userCircleMembers = []
        }


        for (var i = 0; i < userCircleMembers.length; i++) {
            var randomUser = userCircleMembers[Math.floor(Math.random() * userCircleMembers.length)];
            randomUsers.push(randomUser);
        }


        for (const ru of randomUsers) {
            let idCreatorCircleRandom = {
                idCreator: ru
            }
            let randomUserCircle = await circleModel.find(idCreatorCircleRandom);

            if (randomUserCircle[0].membersFriends.length > 0) {
                randomUserCircleMembers = randomUserCircle[0]['membersFriends']
            }

            for (var ind = 0; ind < randomUserCircleMembers.length; ind++) {
                var randomLevel2User = randomUserCircleMembers[Math.floor(Math.random() * randomUserCircleMembers.length)];
                randomLevel2User !== UserId && !userCircle[0].membersFriends.includes(randomLevel2User) ? randomLevel2Users.push(randomLevel2User) : null;
            }

            randomLevel2UsersId = [...new Set(randomLevel2Users)]

        }

        for (const r2u of randomLevel2UsersId) {
            let user = await userModel.findById(r2u)
            let userCircle = await circleModel.find({ idCreator: r2u });
            let userT = {
                _id: user['_id'],
                pseudoIntime: user['pseudoIntime'],
                phone: user['phone'],
                photo: user['photo'],
                circleMembersCount: userCircle[0].membersFriends.length
            }
            eventualKnownUsers.push(userT)
        }
        // console.log(eventualKnownUsers)


        return eventualKnownUsers;
    } catch (error) {
        console.log(error);
    }
}





