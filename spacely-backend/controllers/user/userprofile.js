require("dotenv").config();

const User = require("../../models/user/auth");
const { v4: uuidv4 } = require('uuid');
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.userprofile = (req, res) => {
    console.log(req.body);
    const user = new User();

    user.userID = uuidv4();

    user.name = req.body.name;
    user.email = req.body.email;
    user.temp_userid = req.body.temp_userid;
    user.user_pic = req.body.user_pic;
    user.aadhaar = req.body.aadhaar;
    user.location.loc.coordinates = req.body.location;
    user.watsappno = req.body.watsappno;
    user.verified = req.body.verified;

    user.save((err, done) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        console.log(done)

        const token = jwt.sign({ _id: done._id }, process.env.SECRET);
        res.cookie("token", token, { expire: new Date() + 99999 });
        const { _id, name, userID } = done;
        return res.json({ token, user: { _id, name, userID } });


    });








}