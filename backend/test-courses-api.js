const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testCoursesAPI() {
  console.log('🧪 Test de l\'API des cours...\n');

  try {
    // Test 1: Récupérer tous les cours
    console.log('1. Test GET /api/applications/courses');
    const response = await axios.get(`${API_BASE_URL}/applications/courses`);
    console.log(`✅ Status: ${response.status}`);
    console.log(`📊 Nombre de cours: ${response.data.length}`);
    console.log(`📋 Premiers cours:`, response.data.slice(0, 3).map(c => ({ id: c.id, code: c.code, name: c.name })));
    console.log('');

    // Test 2: Vérifier la structure des données
    if (response.data.length > 0) {
      const course = response.data[0];
      console.log('2. Structure d\'un cours:');
      console.log(`   - ID: ${course.id}`);
      console.log(`   - Code: ${course.code}`);
      console.log(`   - Nom: ${course.name}`);
      console.log(`   - Heures/semaine: ${course.hoursPerWeek}`);
      console.log(`   - Total heures: ${course.totalHours}`);
      console.log(`   - Semestre: ${course.semester}`);
      console.log(`   - Département: ${course.department}`);
      console.log('');
    }

    // Test 3: Test avec des paramètres
    console.log('3. Test avec headers CORS');
    const corsResponse = await axios.get(`${API_BASE_URL}/applications/courses`, {
      headers: {
        'Origin': 'http://localhost:3000',
        'Content-Type': 'application/json'
      }
    });
    console.log(`✅ CORS Status: ${corsResponse.status}`);
    console.log('');

    console.log('🎉 Tous les tests de l\'API des cours ont réussi !');

  } catch (error) {
    console.error('❌ Erreur lors du test de l\'API des cours:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message: ${error.response.data?.message || error.response.statusText}`);
      console.error(`   Data:`, error.response.data);
    } else if (error.request) {
      console.error('   Aucune réponse reçue du serveur');
      console.error('   Vérifiez que le serveur backend est démarré sur le port 5000');
    } else {
      console.error(`   Erreur: ${error.message}`);
    }
  }
}

// Attendre un peu que le serveur démarre
setTimeout(() => {
  testCoursesAPI();
}, 3000);



