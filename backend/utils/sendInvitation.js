const sendEmail = require("./sendEmail.js");

const sendInvitation = async ({ email, token, origin, project, id }) => {
  const subject = `Invitation to Join a Project`;
  const verificationLink = `${origin}/dashboard/invite?token=${token}&email=${email}&id=${id}`;
  const text = `You have been sent an Invitation Link to join ${project}. Click the link to accept the Invitation: <a href=${verificationLink}>Accept Invitation</a>`;
  return await sendEmail({ email, subject, html: text });
};

module.exports = sendInvitation;
