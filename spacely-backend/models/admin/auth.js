const mongoose = require('mongoose');


const adminTemp = new mongoose.Schema({

    tempAdminId: {
        type: String
    },
    email: {
        type: String,
        trim: true,
    },
    otp: {
        type: String,
        trim: true,
        unique: true
    },
    name: {
        type: String
    },
    position: {
        type: String
    }


})

module.exports = mongoose.model("TempAdmin", adminTemp);