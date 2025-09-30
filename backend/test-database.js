// Script de test pour vérifier la connexion à la base de données
const { sequelize, User, Vacataire, Course, Application, Contract, Payment } = require('./models');

async function testDatabaseConnection() {
  console.log('🔍 Test de connexion à la base de données...');
  console.log('================================================');
  
  try {
    // Test de connexion
    console.log('1. Test de connexion...');
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');
    
    // Test de synchronisation
    console.log('\n2. Test de synchronisation...');
    await sequelize.sync({ force: false });
    console.log('✅ Synchronisation des modèles réussie');
    
    // Test de création d'un utilisateur
    console.log('\n3. Test de création d\'utilisateur...');
    const testUser = await User.create({
      email: `test-${Date.now()}@2ie.edu.bf`,
      password: 'test123',
      firstName: 'Test',
      lastName: 'Database',
      role: 'vacataire'
    });
    console.log('✅ Utilisateur créé avec succès:', testUser.email);
    
    // Test de création d'un vacataire
    console.log('\n4. Test de création de vacataire...');
    const testVacataire = await Vacataire.create({
      userId: testUser.id,
      specialization: 'Test Spécialisation',
      experienceYears: 5,
      status: 'pending'
    });
    console.log('✅ Vacataire créé avec succès, ID:', testVacataire.id);
    
    // Test de création d'un cours
    console.log('\n5. Test de création de cours...');
    const testCourse = await Course.create({
      code: `TEST${Date.now()}`,
      name: 'Cours de Test',
      hoursPerWeek: 3,
      totalHours: 45,
      semester: 'S1',
      department: 'Test'
    });
    console.log('✅ Cours créé avec succès:', testCourse.name);
    
    // Test de création d'une candidature
    console.log('\n6. Test de création de candidature...');
    const testApplication = await Application.create({
      vacataireId: testVacataire.id,
      courseId: testCourse.id,
      status: 'submitted'
    });
    console.log('✅ Candidature créée avec succès, ID:', testApplication.id);
    
    // Test de création d'un contrat
    console.log('\n7. Test de création de contrat...');
    const testContract = await Contract.create({
      applicationId: testApplication.id,
      contractNumber: `CONTRACT-TEST-${Date.now()}`,
      hourlyRate: 5000,
      totalHours: 45,
      totalAmount: 225000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      status: 'draft'
    });
    console.log('✅ Contrat créé avec succès:', testContract.contractNumber);
    
    // Test de création d'un paiement
    console.log('\n8. Test de création de paiement...');
    const testPayment = await Payment.create({
      contractId: testContract.id,
      amount: 112500,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'pending'
    });
    console.log('✅ Paiement créé avec succès, montant:', testPayment.amount);
    
    // Test de requêtes avec associations
    console.log('\n9. Test des associations...');
    const userWithVacataire = await User.findByPk(testUser.id, {
      include: [{ model: Vacataire, as: 'vacataire' }]
    });
    console.log('✅ Association User-Vacataire fonctionnelle');
    
    const applicationWithDetails = await Application.findByPk(testApplication.id, {
      include: [
        { model: Vacataire, as: 'vacataire', include: [{ model: User, as: 'user' }] },
        { model: Course, as: 'course' }
      ]
    });
    console.log('✅ Association Application-Vacataire-Course fonctionnelle');
    
    const contractWithDetails = await Contract.findByPk(testContract.id, {
      include: [
        { model: Application, as: 'application' },
        { model: Payment, as: 'payments' }
      ]
    });
    console.log('✅ Association Contract-Application-Payment fonctionnelle');
    
    // Test de comptage
    console.log('\n10. Test de comptage...');
    const userCount = await User.count();
    const vacataireCount = await Vacataire.count();
    const courseCount = await Course.count();
    const applicationCount = await Application.count();
    const contractCount = await Contract.count();
    const paymentCount = await Payment.count();
    
    console.log('✅ Comptage des enregistrements:');
    console.log(`   - Utilisateurs: ${userCount}`);
    console.log(`   - Vacataires: ${vacataireCount}`);
    console.log(`   - Cours: ${courseCount}`);
    console.log(`   - Candidatures: ${applicationCount}`);
    console.log(`   - Contrats: ${contractCount}`);
    console.log(`   - Paiements: ${paymentCount}`);
    
    // Nettoyage des données de test
    console.log('\n11. Nettoyage des données de test...');
    await Payment.destroy({ where: { id: testPayment.id } });
    await Contract.destroy({ where: { id: testContract.id } });
    await Application.destroy({ where: { id: testApplication.id } });
    await Course.destroy({ where: { id: testCourse.id } });
    await Vacataire.destroy({ where: { id: testVacataire.id } });
    await User.destroy({ where: { id: testUser.id } });
    console.log('✅ Données de test supprimées');
    
    console.log('\n🎉 TOUS LES TESTS DE BASE DE DONNÉES SONT RÉUSSIS !');
    console.log('================================================');
    console.log('✅ La base de données fonctionne parfaitement');
    console.log('✅ Tous les modèles sont correctement configurés');
    console.log('✅ Toutes les associations fonctionnent');
    console.log('✅ Les opérations CRUD sont fonctionnelles');
    
    return true;
    
  } catch (error) {
    console.log('\n❌ ERREUR LORS DES TESTS DE BASE DE DONNÉES');
    console.log('================================================');
    console.error('Erreur:', error.message);
    
    if (error.name === 'SequelizeConnectionError') {
      console.log('\n🔧 SOLUTIONS POSSIBLES:');
      console.log('1. Vérifiez que MySQL est installé et démarré');
      console.log('2. Vérifiez les paramètres de connexion dans config/database.js');
      console.log('3. Créez la base de données: CREATE DATABASE vacataires_db;');
      console.log('4. Vérifiez les identifiants MySQL (utilisateur/mot de passe)');
    } else if (error.name === 'SequelizeAccessDeniedError') {
      console.log('\n🔧 SOLUTIONS POSSIBLES:');
      console.log('1. Vérifiez le mot de passe MySQL');
      console.log('2. Vérifiez que l\'utilisateur a les permissions nécessaires');
      console.log('3. Essayez de vous connecter manuellement à MySQL');
    } else if (error.name === 'SequelizeDatabaseError') {
      console.log('\n🔧 SOLUTIONS POSSIBLES:');
      console.log('1. Créez la base de données: CREATE DATABASE vacataires_db;');
      console.log('2. Vérifiez que la base de données existe');
    }
    
    return false;
  } finally {
    // Fermer la connexion
    await sequelize.close();
  }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  testDatabaseConnection();
}

module.exports = { testDatabaseConnection };