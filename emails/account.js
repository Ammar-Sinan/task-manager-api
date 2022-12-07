const nodemailer = require('nodemailer')



// create reusable transporter object using the default SMTP transport
// var transport = nodemailer.createTransport({
//     host: "smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//         user: "84476c2e1410bf",
//         pass: "14007e2c8ff28b"
//     }
// });

let transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});




const sendWelcomeEmail = (email, name) => {

    const mailOptions = {
        from: 'sinan.ammar99@gmail.com',
        to: email,
        subject: 'Thanks for joining in!',
        text: `Hello ${name}, Welcome aboard.`, // Plain text body
    };

    transport.sendMail(mailOptions, function (err, info) {
        if (err) {
            //  console.log(err)
        } else {
            //wconsole.log('email sent')
            //console.log(info);
        }
    })
}

const sendCancelationEmail = (email, name) => {

    const mailOptions = {
        from: 'sinan.ammar99@gmail.com',
        to: email,
        subject: 'GoodBye!',
        text: `GoodBye ${name}, `,
    };

    transport.sendMail(mailOptions, function (err, info) {
        if (err) {
            //console.log(err)
        } else {
            //console.log(info);
        }
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}



