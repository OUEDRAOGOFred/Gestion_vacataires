const sequelize = require('./config/database');
const { User, Vacataire } = require('./models');

async function testDatabaseConnection() {
  try {
    console.log('🔍 Test de connexion à la base de données...');
    
    // Test de connexion
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');
    
    // Test de synchronisation
    console.log('🔄 Test de synchronisation des modèles...');
    await sequelize.sync({ force: false });
    console.log('✅ Synchronisation des modèles réussie');
    
    // Test de création d'un utilisateur
    console.log('👤 Test de création d\'utilisateur...');
    const testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      role: 'vacataire'
    });
    console.log('✅ Utilisateur créé avec succès:', testUser.id);
    
    // Test de création d'un profil vacataire
    console.log('👨‍🏫 Test de création de profil vacataire...');
    const testVacataire = await Vacataire.create({
      userId: testUser.id
    });
    console.log('✅ Profil vacataire créé avec succès:', testVacataire.id);
    
    // Nettoyage
    await testVacataire.destroy();
    await testUser.destroy();
    console.log('🧹 Données de test supprimées');
    
    console.log('🎉 Tous les tests sont passés avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    console.error('📋 Détails de l\'erreur:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  } finally {
    await sequelize.close();
    console.log('🔒 Connexion fermée');
  }
}

testDatabaseConnection();
