import nodemailer from 'nodemailer';

export default function sendEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const message = {
    from: 'noreply@linear-systems.com',
    to: email,
    subject: 'Password reset',
    text: `You are receiving this because you (or someone else) have requested to reset the password for your account.\n\n
    Please enter this token\n\n ${token} \n\n to complete this request.\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    html: `<p>You are receiving this because you (or someone else) have requested to reset the password for your account.</p>
    <p>Please enter this token<br/><br/><b>${token}</b><br/><br/> to complete this request</p>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log('error: ', error);
        reject(error);
      } else {
        console.log('Mail sent successfully');
        resolve(true);
      }
    });
  });
}
