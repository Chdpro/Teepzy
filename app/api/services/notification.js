
const notificationModel = require('../models/notification');


exports.addNotification = async (notification) => {
    try {
        await notificationModel.create(notification);
        let data = { status: 200, data: null, message: "Notification added successfully", }
        return data;
    } catch (error) {
        console.log(error);
    }
}

exports.markNotificationRead = async (userConcernId) => {
    let query = {
        userConcernId: userConcernId,
        isRead: false
    }
    try {
        let notifications = await notificationModel.find(query)
        for (const notification of notifications) {
            let notif = { isRead: true }
            await notificationModel.findByIdAndUpdate(notification['_id'], notif);
        }
        let data = { status: 200, data: null, message: "Notification added successfully", }
        return data;
    } catch (error) {
        console.log(error);
    }
}

exports.listNotifications = async (userConcernId, query) => {
    
    try {
        let notifications = await notificationModel.find({ userConcernId: userConcernId })
         .sort({_id: -1})
         .limit(query.limit)
         .skip(query.skipIndex)
         .exec();
        return notifications
    } catch (error) {
        console.log(error);
    }
}


exports.listMentions = async (userConcernId) => {
    
    try {
        let notifications = await notificationModel.find({ userConcernId: userConcernId, type: 'MENTION' })
         //.sort({ _id: 1 })
         //.limit(query.limit)
        // .skip(query.skipIndex)
        // .exec();
      
        return notifications
    } catch (error) {
        console.log(error);
    }
}

exports.NbrUnreadNotifications = async (userConcernId) => {
    let query = {
        userConcernId: userConcernId,
        isRead: false
    }
    try {
        let notifications = await notificationModel.find(query)
        return notifications.length
    } catch (error) {
        console.log(error);
    }
}

