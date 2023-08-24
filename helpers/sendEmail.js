const sgMail = require('@sendgrid/mail');

const {SENDGRID_API_KEY} = require('../config');

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async(data) => {
    const email = {...data, from: "Elborn18@gmail.com"};
    await sgMail.send(email);
    return true;
}

module.exports = sendEmail;