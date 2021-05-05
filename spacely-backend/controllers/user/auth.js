const User = require("../../models/user/auth");
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



exports.verify = (req, res) => {
    console.log(req.body);

    Temp.findOne({ temp_userid: req.body.temp_userid }, (err, found) => {
        if (err) {
            return res.status(503).json({
                error: err,
                emsg: "Some error in server"
            })
        }

        if (found.otp === req.body.otp) {
            return res.json({
                msg: found
            })
        } else {
            return res.json({
                msg: "Wrong OTP, request for resend"
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