import nodemailer from "nodemailer";

export const sendMail = ({ to, sub, msg }) => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "shapu23@gmail.com",
      pass: "aajkutisrfyoztwz",
    },
  });

  // send mail
  transporter.sendMail({
    from: "Wolmart <shapu23@gmail.com>",
    to: to,
    subject: sub,
    text: msg,
  });
};
