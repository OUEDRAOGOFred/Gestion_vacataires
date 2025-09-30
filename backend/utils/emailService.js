const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Email templates
const emailTemplates = {
    welcome: (userData) => ({
        subject: 'Bienvenue sur la plateforme Gestion Vacataires',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Bienvenue ${userData.firstName} ${userData.lastName} !</h2>
                <p>Nous sommes ravis de vous accueillir sur notre plateforme de gestion des vacataires.</p>
                <p>Votre compte a été créé avec succès avec l'email: ${userData.email}</p>
                <p>Vous pouvez maintenant vous connecter et déposer votre candidature.</p>
                <p>Cordialement,<br>L'équipe Gestion Vacataires</p>
            </div>
        `
    }),

    applicationSubmitted: (applicationData) => ({
        subject: 'Confirmation de dépôt de candidature',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Candidature reçue</h2>
                <p>Cher(e) ${applicationData.firstName} ${applicationData.lastName},</p>
                <p>Nous confirmons la réception de votre candidature en tant que vacataire.</p>
                <p>Détails de la candidature :</p>
                <ul>
                    <li>Date de soumission : ${new Date().toLocaleDateString('fr-FR')}</li>
                    <li>Discipline : ${applicationData.discipline}</li>
                </ul>
                <p>Nous examinerons votre dossier et vous contacterons dans les plus brefs délais.</p>
                <p>Cordialement,<br>L'équipe Gestion Vacataires</p>
            </div>
        `
    }),

    applicationStatusUpdate: (applicationData) => ({
        subject: 'Mise à jour de votre candidature',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Mise à jour de votre candidature</h2>
                <p>Cher(e) ${applicationData.firstName} ${applicationData.lastName},</p>
                <p>Le statut de votre candidature a été mis à jour :</p>
                <p style="font-weight: bold;">Nouveau statut : ${applicationData.status}</p>
                ${applicationData.feedback ? `<p>Commentaire : ${applicationData.feedback}</p>` : ''}
                <p>Cordialement,<br>L'équipe Gestion Vacataires</p>
            </div>
        `
    })
};

// Send email function
const sendEmail = async (to, template, data) => {
    try {
        const emailContent = emailTemplates[template](data);
        
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: to,
            subject: emailContent.subject,
            html: emailContent.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Test email connection
const testEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log('Email server connection successful');
        return true;
    } catch (error) {
        console.error('Email server connection failed:', error);
        return false;
    }
};

module.exports = {
    sendEmail,
    testEmailConnection
};
