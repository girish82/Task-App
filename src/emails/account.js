const sgMail = require('@sendgrid/mail')
// const SENDMAIL_API='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'
sgMail.setApiKey(process.env.SENDMAIL_API)

const sendwelcomeEmail = (email,name) => {
    sgMail.send({
    to:email,
    from:'pgirish4u@gmail.com',
    subject:'Welcome to the Task App',
    text:`Hi ${name},Welcome to the application.Let me know how it worked`
})
}

const sendCancelEmail = (email,name) => {
    // console.log('sending email')
    sgMail.send({
    to:email,
    from:'pgirish4u@gmail.com',
    subject:'What happened ?',
    text:`Hi ${name},may i know the reason for cancelling the login.`
})
}

module.exports = {
    sendwelcomeEmail,
    sendCancelEmail
}