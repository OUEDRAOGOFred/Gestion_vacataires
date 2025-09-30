const { sendEmail, testEmailConnection } = require('./utils/emailService');
require('dotenv').config();

async function testEmails() {
    try {
        // Test de la connexion
        console.log('Test de la connexion au serveur SMTP...');
        const isConnected = await testEmailConnection();
        if (!isConnected) {
            throw new Error('Échec de la connexion au serveur SMTP');
        }
        console.log('Connexion au serveur SMTP réussie ✓');

        // Test email de bienvenue
        console.log('\nTest de l\'email de bienvenue...');
        await sendEmail('test@example.com', 'welcome', {
            firstName: 'Jean',
            lastName: 'Test',
            email: 'test@example.com'
        });
        console.log('Email de bienvenue envoyé avec succès ✓');

        // Test email de candidature
        console.log('\nTest de l\'email de confirmation de candidature...');
        await sendEmail('test@example.com', 'applicationSubmitted', {
            firstName: 'Jean',
            lastName: 'Test',
            discipline: 'Mathématiques',
            submittedAt: new Date()
        });
        console.log('Email de confirmation de candidature envoyé avec succès ✓');

        // Test email de mise à jour de statut
        console.log('\nTest de l\'email de mise à jour de statut...');
        await sendEmail('test@example.com', 'applicationStatusUpdate', {
            firstName: 'Jean',
            lastName: 'Test',
            status: 'approved',
            feedback: 'Votre profil correspond parfaitement à nos besoins.'
        });
        console.log('Email de mise à jour de statut envoyé avec succès ✓');

        console.log('\nTous les tests ont réussi! ✓');
    } catch (error) {
        console.error('\nErreur lors des tests:', error);
        process.exit(1);
    }
}

testEmails();