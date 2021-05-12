const User = require("../../models/user/auth");
const Temp = require("../../models/user/tempauth");
const { v4: uuidv4 } = require('uuid');
var randomize = require('randomatic');
const Nexmo = require('nexmo');

const Temp = require('../../models/user/tempauth');

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


    Temp.findById({ phone: req.body.phone }, (err, gotuser) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        if (gotuser) {
            return res.status(400).json({
                msg: "You can use the latest OTP"
            })
        }
        User.findOne({ watsappno: req.body.phone }, (err, gotuser) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            console.log(gotuser == null);
            if (gotuser == null || !gotuser) {

                const temp = new Temp();

                const user_phone = req.body.phone;
                const user_uuid = uuidv4();
                const user_otp = randomize('0', 4)


                const from = "SpaceLY "
                const to = "+91" + req.body.phone;
                const text = `Your SpaceLY verification code is. ${user_otp}. Don't share this code with anyone; our employees will never ask for the code.`

                vonage.message.sendSms(from, to, text, (err, responseData) => {
                    if (err) {
                        return res.json({
                            error: "SMS is not working"
                        })
                    } else {
                        if (responseData.messages[0]['status'] === "0") {
                            console.log("Message sent successfully.");
                            temp.phone = req.body.phone;
                            temp.otp = user_otp;
                            temp.temp_userid = user_uuid;
                            temp.save((err, temp) => {
                                if (err) {
                                    return res.status(503).json({
                                        error: 'Sry, Some problem in server'
                                    })
                                }
                                return res.json({
                                    msg: temp,
                                    user_temp_id: temp.temp_userid
                                })
                            });





                        } else {
                            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                        }
                    }
                })
            } else {
                const tempID = gotuser.temp_userid;
                Temp.findOne({ temp_userid: tempID }, (err, got) => {
                    if (err) {
                        return res.status(400).json({
                            error: err
                        })
                    }
                    const temp_already = randomize('0', 4)




                    const from = "SpaceLY "
                    const to = "+91" + req.body.phone;
                    const text = `Your SpaceLY verification code to Login. ${temp_already}. Don't share this code with anyone; our employees will never ask for the code.`

                    vonage.message.sendSms(from, to, text, (err, responseData) => {
                        if (err) {
                            return res.json({
                                error: "SMS is not working"
                            })
                        } else {
                            if (responseData.messages[0]['status'] === "0") {
                                console.log("Message sent successfully.");
                                got.otp = temp_already;

                                got.save((err, temp) => {
                                    if (err) {
                                        return res.status(503).json({
                                            error: 'Sry, Some problem in server'
                                        })
                                    }
                                    return res.json({

                                        // TODO Testing Responce
                                        msg: temp,
                                        user: gotuser,
                                        user_temp_id: temp.temp_userid
                                    })
                                });





                            } else {
                                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                            }
                        }
                    })


                })


            }
        })


    });









}



exports.verify = (req, res) => {
    console.log(req.body);
    var temp_id = req.body.tempId;
    temp_id = temp_id.slice(1, temp_id.length - 1)
    console.log(temp_id.slice(1, temp_id.length - 1));


    Temp.findOne({ temp_userid: temp_id }, (err, found) => {
        if (err) {
            return res.status(503).json({
                error: err,
                emsg: "Some error in server"
            })
        }

        if (found.otp === req.body.otp) {

            User.findOne({ temp_userid: found.temp_userid }, (err, okok) => {
                if (err) {
                    return res.status(503).json({
                        error: err,
                        emsg: "Some error in server"
                    })
                }
                if (okok == null) {
                    return res.status(503).json({
                        profilestatus: "imcomplete profile redirect to profile fill"
                    })
                }
                return res.json({
                    msg: found,
                    completed: true
                })

            })




        } else {
            return res.json({
                emsg: "Wrong OTP, request for resend"
            })
        }


    })

}



exports.resendotp = (req, res) => {

    Temp.findOneAndDelete({ temp_userid: req.body.temp_userid }, (err, found) => {
        if (err) {
            return res.status(503).json({
                error: err,
                emsg: "Some error in server"
            })
        }

        if (found) {
            PHONE = found.phone
            const temp = new Temp();

            const user_phone = req.body.phone;
            const user_uuid = uuidv4();
            const user_otp = randomize('0', 4)


            const from = "SpaceLY "
            const to = "+91" + req.body.phone;
            const text = `Your SpaceLY verification code is. ${user_otp}. Don't share this code with anyone; our employees will never ask for the code.`

            vonage.message.sendSms(from, to, text, (err, responseData) => {
                if (err) {
                    return res.json({
                        error: "SMS is not working"
                    })
                } else {
                    if (responseData.messages[0]['status'] === "0") {
                        console.log("Message sent successfully.");
                        temp.phone = req.body.phone;
                        temp.otp = user_otp;
                        temp.temp_userid = user_uuid;
                        temp.save((err, temp) => {
                            if (err) {
                                return res.status(503).json({
                                    error: 'Sry, Some problem in server'
                                })
                            }
                            return res.json({
                                msg: temp
                            })
                        });





                    } else {
                        console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                    }
                }
            })

        }
    })





}