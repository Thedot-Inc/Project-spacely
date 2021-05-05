const mongoose = require('mongoose');


const tempSchema = new mongoose.Schema({

    phone: {
        type: String,
        trim: true,
        maxlength: 10
    },
    otp: {
        type: String,
        trim: true,
        unique: true
    },
    temp_userid: {
        type: String,
        unique: true
    },

});


module.exports = mongoose.model('Temp', tempSchema);