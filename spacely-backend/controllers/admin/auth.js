const nodemailer = require("nodemailer");
var hbs = require('nodemailer-express-handlebars');
var ejs = require("ejs");
var randomize = require('randomatic');
const TempAdmin = require('../../models/admin/auth');
const { v4: uuidv4 } = require('uuid');



exports.signup = (req, res) => {
    console.log(req.body);
    if (req.body.passcode === "spacely7585") {

        const email = req.body.email;
        const admin_otp = randomize('0', 4)
        const tempAdmin = new TempAdmin();
        tempAdmin.email = req.body.email;
        tempAdmin.otp = admin_otp;
        tempAdmin.tempAdminId = uuidv4();

        tempAdmin.save((err, done) => {
            if (err) {
                return res.status(400).json({
                    error: "Error in server"
                })
            } else {
                //D:\Project-spacely\spacely-backend\controllers\admin\views\adminotp.ejs
                ejs.renderFile(__dirname + "/views/adminotp.ejs", { name: 'SpaceLY Team', OTP: admin_otp }, function(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        // async..await is not allowed in global scope, must use a wrapper
                        async function main() {
                            // Generate test SMTP service account from ethereal.email
                            // Only needed if you don't have a real mail account for testing
                            let testAccount = await nodemailer.createTestAccount();

                            // create reusable transporter object using the default SMTP transport
                            let transporter = nodemailer.createTransport({
                                service: "gmail",
                                port: 587,
                                secure: false, // true for 465, false for other ports
                                auth: {
                                    user: "thedot.in.help@gmail.com", // generated ethereal user
                                    pass: "thedotthedot", // generated ethereal password
                                },
                            });

                            transporter.use('compile', hbs({
                                viewEngine: 'express-handlebars',
                                viewPath: './views/'
                            }));

                            // send mail with defined transport object
                            let info = await transporter.sendMail({
                                from: '"SpaceLY 👻" <thedot.in.help@gmail.com>', // sender address
                                to: req.body.email, // list of receivers
                                subject: "Email verification SpaceLY - Team ✔", // Subject line
                                text: "Hello world?", // plain text body
                                html: data,
                                // template: 'index'
                            });

                            console.log("Message sent: %s", info.messageId);
                            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                            // Preview only available when sending through an Ethereal account
                            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                            return res.json({
                                msg: done
                            })
                        }

                        main().catch(console.error);
                    }
                });
            }
        });





    } else {
        return res.json({
            msg: "Please ask admin the passcode to signup"
        })
    }







}


exports.verify = (req, res) => {
    console.log(req.body);
    TempAdmin.findById({ tempAdminId: req.body.tempAdminId }, (err, done) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }

        if (req.body.otp === done.otp) {
            return res.json({
                msg: done
            })
        } else {
            return res.status(400).json({
                error: "Code is wrong"
            })
        }

    });
}


exports.completeAdmin = () => {
    //TODO: Need to do Admin profile completion
}