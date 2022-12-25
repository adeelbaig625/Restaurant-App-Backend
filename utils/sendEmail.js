const nodemailer = require("nodemailer");

exports.sendEmail = async (email, subject, text) => {
  try {
    let testAccount = await nodemailer.createTestAccount();
    console.log("Email: ", process.env.EMAIL);
    console.log("Pass: ", process.env.PASS);
    console.log("Email: ", email);
    console.log("Subject: ", subject);
    console.log("Text: ", text);
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.EMAIL, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
    });
  } catch (err) {
    throw err;
  }
};
