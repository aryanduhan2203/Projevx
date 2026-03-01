import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https://taskmanagerlink.com",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "mail.taskmanager@exmaple.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };
  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(
      "Email service failed silently,Make sure that you have provided your MAILTRAP the credentials in the .env file ",
    );
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App, we are happy to have you in board.",
      action: {
        instruction:
          " To verify your email please click on the following button",
        button: {
          color: "#22a75c",
          text: "verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help or have question? Just reply to this email, we would love to help",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We gr instruction to reeset the password of your account.",
      action: {
        instruction:
          " To reset your password click on the following button or link",
        button: {
          color: "rgb(20, 95, 52)",
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help or have question? Just reply to this email, we would love to help",
    },
  };
};

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};
