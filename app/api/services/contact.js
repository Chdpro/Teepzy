const contactModel = require('../models/contact');

exports.CreateContact= async (contact) => {
    try {
        let MyContact = await contactModel.create(contact);
       if (MyContact) {
        let data = { status: 200, data: null, message: "Contact created successfully",}
        return data;
        }
    } catch (error) {
        console.log(error);
    }
}

exports.GetMyContacts= async () => {
    try {
        let MyContacts = await contactModel.find();
       if (MyContacts.length) {
        let data = { status: 200, data: MyContacts, message: "Contact listed successfully",}
        return data;
        }
    } catch (error) {
        console.log(error);
    }
}