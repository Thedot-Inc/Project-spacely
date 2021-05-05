const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;



const userSchema = new mongoose.Schema({
    // Before Verification

    userID: {
        type: String,
        required: true
    },


    phone: {
        type: String,
        trim: true,
        unique: true,
        maxlength: 10
    },

    email: {
        type: String,
        trim: true,
        unique: true,
    },

    otp: {
        type: String,
        trim: true,
        unique: true
    },

    verified: {
        type: Boolean
    },


    temp_userid: {
        type: String,
        unique: true
    },


    // After verification

    name: {
        type: String,
        maxlength: 32,
    },
    watsappno: {
        type: String,
        maxlength: 10
    },
    location: {
        loc: {
            type: { type: String },
            coordinates: [Number],
        }
    },

    // User added to wish list

    wishlist: {
        type: [String]
    },


    // USer payed order
    orders: {
        type: [ObjectId],
        ref: "Order",
    },
    //User reserved
    reserved: {
        type: [ObjectId],
        ref: 'Reserve',
    },


    user_pic: {
        type: String
    },
    aadhaar: {
        type: String,
        maxlength: 12
    },


    // Account completed status

    completed: {
        type: Boolean
    }



});



module.exports = mongoose.model("User", userSchema);