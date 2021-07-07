const User = require("../../models/user/auth");
const Temp = require("../../models/user/tempauth");
const { v4: uuidv4 } = require('uuid');
var randomize = require('randomatic');
const Nexmo = require('nexmo');

var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");



const vonage = new Nexmo({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    // applicationId: APP_ID,
    // privateKey: PRIVATE_KEY_PATH,
    // signatureSecret: SIGNATURE_SECRET,
    // signatureMethod: SIGNATURE_METHOD
});


//uuidv4();
exports.signup = (req, res) => {

    console.log("Signup / Login : ", req.body);
    const OTP = randomize('0', 4);


    const from = "SpaceLY "
    const to = "+91" + req.body.phone;
    const text = `Your SpaceLY verification code is. ${OTP}. Don't share this code with anyone; our employees will never ask for the code.`

    // vonage.message.sendSms(from, to, text, (err, responseData) => {
    //     if (err) {
    //         return res.json({
    //             error: "SMS is not working"
    //         })
    //     } else {
    //         if (responseData.messages[0]['status'] === "0") {
    //             console.log("Message sent successfully.");

    //             const user = new User();
    //             user.phone = req.body.phone;
    //             user.otp = OTP;
    //             const tempID = uuidv4();
    //             user.temp_userid = tempID;
    //             user.save((err, saved) => {
    //                 if (err) {
    //                     return res.status(400).json({
    //                         error: err
    //                     })
    //                 }

    //                 return res.json({
    //                     tempID: tempID
    //                 })

    //             });





    //         } else {
    //             console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
    //         }
    //     }
    // })


    // Testing without OTP sending

    User.findOne({ phone: req.body.phone }, (err, havePhone) => {
        if (err) {
            console.log(err);

            return res.status(400).json({
                error: err
            })
        }
        if (havePhone == null) {
            const user = new User();
            user.phone = req.body.phone;
            user.otp = OTP;
            const tempID = uuidv4();
            user.temp_userid = tempID;
            user.save((err, saved) => {
                if (err) {
                    console.log(err);

                    return res.status(400).json({
                        error: err
                    })
                }
                return res.json({
                    tempID: tempID
                })

            });
        } else {


            // Here we need to send SMS


            //TODO we can reuse this snippet for OTP resend also

            havePhone.otp = OTP;
            havePhone.save((err, newOtp) => {
                if (err) {
                    console.log(err);

                    return res.status(400).json({
                        error: err
                    })
                }
                return res.json({
                    tempID: havePhone.temp_userid
                })
            });


        }

    });





}



exports.verify = (req, res) => {
    console.log("Verify : ", req.body);
    if (req.body.tempId == undefined || req.body.tempId == null) {
        return res.json({
            returnto: "login"
        })
    }

    var temp_id = req.body.tempId;
    temp_id = temp_id.slice(1, temp_id.length - 1)
    User.findOne({ temp_userid: temp_id }, (err, gotTempID) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        } else {
            //console.log(gotTempID);
            if (gotTempID != null) {
                if (gotTempID.otp != req.body.otp) {
                    return res.json({
                        wrong: "Wrong passcode"
                    })
                }
                if (gotTempID.otp == req.body.otp && gotTempID.temp_userid == temp_id && gotTempID.completed) {
                    // Here we can return JWT
                    const token = jwt.sign({ _id: gotTempID._id }, "SpaceLYwewillwin");
                    res.cookie("token", token, { expire: new Date() + 99999 });
                    const { _id, name, userID } = gotTempID;
                    return res.json({


                        success: {
                            token,
                            user: { _id, name, userID }
                        }
                    });


                }
                if (gotTempID.otp == req.body.otp && gotTempID.temp_userid == temp_id && gotTempID.completed == false) {
                    // Imcomplete Profile
                    console.log();
                    return res.json({
                        incomplete: true
                    })
                }
            }
            if (gotTempID == null) {
                return res.json({
                    returnto: "login"
                })
            }



        }
    });


}


//TODO Resend OTP should be done
exports.resendotp = (req, res) => {

    const OTP = randomize('0', 4);

    User.findOne({ temp_userid: req.body.temp_userid }, (err, havePhone) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        console.log(havePhone);


    });






}