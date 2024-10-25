const nodemailer = require("nodemailer");

const mailSender = async (to, subject, text) => {
    try {
        // Create a transporter using Gmail service
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "abhinavsaxena119@gmail.com", 
                pass: "bkwgjnfawvkmpjhe", 
            },
        });

        // Setup email data
        const mailOptions = {
            from: "abhinavsaxena119@gmail.com", 
            to,
            subject,
            text,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response); 
        return info; 
    } catch (error) {
        console.error("Error sending email: ", error.message); 
        throw new Error("Email sending failed"); 
    }
};

// const mailSender = async (email, titel, body) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "abhinavsaxena119@gmail.com",
//         pass: "bkwgjnfawvkmpjhe",
//       },
//     });

//     const mailOptions = {
//         from: 'your_email@example.com',
//         to,
//         subject,
//         text,
//     };
//     console.log("Email info: ", mailOptions);
//     return info;
//   } catch (error) {
//     console.log(error.message);
//   }
// };

module.exports = mailSender;








