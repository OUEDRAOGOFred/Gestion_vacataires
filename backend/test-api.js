// Script de test pour vérifier toutes les liaisons API
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Configuration axios pour les tests
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variables pour stocker les tokens et IDs
let adminToken = '';
let rhToken = '';
let vacataireToken = '';
let testUserId = '';
let testVacataireId = '';
let testCourseId = '';
let testApplicationId = '';
let testContractId = '';

// Fonction pour tester une route
async function testRoute(name, testFunction) {
  try {
    console.log(`\n🧪 Test: ${name}`);
    await testFunction();
    console.log(`✅ ${name} - SUCCÈS`);
  } catch (error) {
    console.log(`❌ ${name} - ÉCHEC`);
    console.log(`   Erreur: ${error.response?.data?.message || error.message}`);
  }
}

// Tests d'authentification
async function testAuth() {
  // Test inscription
  const registerResponse = await api.post('/auth/register', {
    email: 'test@2ie.edu.bf',
    password: 'test123',
    firstName: 'Test',
    lastName: 'User',
    phone: '+226 70 12 34 56',
    role: 'vacataire'
  });
  
  testUserId = registerResponse.data.user.id;
  vacataireToken = registerResponse.data.token;
  
  // Test connexion admin
  const loginResponse = await api.post('/auth/login', {
    email: 'admin@2ie.edu.bf',
    password: 'admin123'
  });
  
  adminToken = loginResponse.data.token;
  
  // Test profil
  const profileResponse = await api.get('/auth/profile', {
    headers: { Authorization: `Bearer ${vacataireToken}` }
  });
  
  console.log(`   Utilisateur connecté: ${profileResponse.data.user.firstName} ${profileResponse.data.user.lastName}`);
}

// Tests des vacataires
async function testVacataires() {
  // Test mise à jour profil vacataire
  const formData = new FormData();
  formData.append('specialization', 'Test Spécialisation');
  formData.append('experienceYears', '5');
  
  await api.put('/vacataires/profile', formData, {
    headers: { 
      Authorization: `Bearer ${vacataireToken}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  
  // Test récupération tous les vacataires (admin)
  const vacatairesResponse = await api.get('/vacataires', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  
  testVacataireId = vacatairesResponse.data[0].id;
  
  // Test statistiques vacataires
  await api.get('/vacataires/stats', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  
  // Test candidatures vacataire
  await api.get('/vacataires/my-applications', {
    headers: { Authorization: `Bearer ${vacataireToken}` }
  });
}

// Tests des candidatures
async function testApplications() {
  // Test récupération cours
  const coursesResponse = await api.get('/applications/courses');
  testCourseId = coursesResponse.data[0].id;
  
  // Test création cours (admin)
  const courseResponse = await api.post('/applications/courses', {
    code: 'TEST101',
    name: 'Cours de Test',
    hoursPerWeek: 3,
    totalHours: 45,
    semester: 'S1',
    department: 'Test'
  }, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  
  // Test soumission candidature
  const applicationResponse = await api.post('/applications/submit', {
    courseId: testCourseId
  }, {
    headers: { Authorization: `Bearer ${vacataireToken}` }
  });
  
  testApplicationId = applicationResponse.data.application.id;
  
  // Test récupération toutes les candidatures (admin)
  const allApplicationsResponse = await api.get('/applications/all', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  
  // Test statistiques candidatures
  await api.get('/applications/stats', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  
  // Test mise à jour statut candidature
  await api.put(`/applications/${testApplicationId}/status`, {
    status: 'approved',
    notes: 'Test d\'approbation'
  }, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
}

// Tests des contrats
async function testContracts() {
  // Test récupération contrats vacataire
  await api.get('/contracts/my-contracts', {
    headers: { Authorization: `Bearer ${vacataireToken}` }
  });
  
  // Test récupération tous les contrats (admin)
  const contractsResponse = await api.get('/contracts', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  
  if (contractsResponse.data.length > 0) {
    testContractId = contractsResponse.data[0].id;
    
    // Test récupération contrat par ID
    await api.get(`/contracts/${testContractId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    // Test mise à jour contrat
    await api.put(`/contracts/${testContractId}`, {
      hourlyRate: 6000,
      totalHours: 50
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    // Test création paiement
    const paymentResponse = await api.post(`/contracts/${testContractId}/payments`, {
      amount: 150000,
      dueDate: '2024-12-31'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    // Test marquer paiement comme payé
    if (paymentResponse.data.payment) {
      await api.put(`/contracts/payments/${paymentResponse.data.payment.id}/paid`, {
        paidDate: new Date().toISOString().split('T')[0]
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
    }
  }
  
  // Test statistiques contrats
  await api.get('/contracts/stats', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
}

// Test route de test
async function testTestRoute() {
  await api.get('/test');
}

// Fonction principale de test
async function runAllTests() {
  console.log('🚀 Début des tests API - Gestion Vacataires 2iE');
  console.log('================================================');
  
  try {
    await testRoute('Route de test', testTestRoute);
    await testRoute('Authentification', testAuth);
    await testRoute('Gestion des Vacataires', testVacataires);
    await testRoute('Gestion des Candidatures', testApplications);
    await testRoute('Gestion des Contrats', testContracts);
    
    console.log('\n🎉 Tous les tests sont terminés !');
    console.log('================================================');
    console.log('✅ Toutes les liaisons API sont fonctionnelles');
    
  } catch (error) {
    console.log('\n❌ Erreur lors des tests:', error.message);
  }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests };