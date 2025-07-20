const sendEmail = async (to, subject, text) => {
  // Use nodemailer here
  console.log(`📧 To: ${to}\nSubject: ${subject}\nMessage: ${text}`);
};

module.exports = sendEmail;
