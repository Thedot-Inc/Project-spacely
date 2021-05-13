require("dotenv").config();

const User = require("../../models/user/auth");
const { v4: uuidv4 } = require('uuid');
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.userprofile = (req, res) => {
    console.log(req.body);

    var temp_id = req.body.temp_userid;
    temp_id = temp_id.slice(1, temp_id.length - 1)
    if (req.body.temp_userid == null || req.body.temp_userid == undefined) {
        return res.json({
            notAuth: true
        })
    } else {
        User.findOne({ temp_userid: temp_id }, (err, got) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            if (got == null) {
                return res.json({
                    isnotExist: true
                })
            }
            got.name = req.body.name;
            got.email = req.body.email;
            got.aadhaar = req.body.aadhaar;
            got.location.loc.coordinates = req.body.location;
            got.user_pic = req.body.downloadURL;
            got.completed = true;

            got.save((err, profileSaved) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    })
                } else {

                    if (profileSaved == null) {
                        return res.json({
                            errorsaving: true
                        })
                    }
                    // Here we are setting jwt -- TOKEN
                    // And redirect
                    const token = jwt.sign({ _id: profileSaved._id }, "SpaceLYwewillwin");
                    res.cookie("token", token, { expire: new Date() + 99999 });
                    const { _id, name, userID } = profileSaved;
                    return res.json({


                        success: {
                            token,
                            user: { _id, name, userID }
                        }
                    });



                }
            });

        })

    }

    // const token = jwt.sign({ _id: done._id }, process.env.SECRET);
    // res.cookie("token", token, { expire: new Date() + 99999 });
    // const { _id, name, userID } = done;
    // return res.json({ token, user: { _id, name, userID } });


}