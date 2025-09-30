const axios = require('axios');

async function testRegister() {
  try {
    console.log('🔍 Test de l\'API d\'inscription...');
    
    // Utiliser un email unique avec timestamp
    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;
    
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      email: email,
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      phone: '+226 70 12 34 56',
      role: 'vacataire'
    });
    
    console.log('✅ Inscription réussie !');
    console.log('📧 Email:', email);
    console.log('👤 Utilisateur:', response.data.user);
    console.log('🔑 Token:', response.data.token ? 'Généré' : 'Non généré');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'inscription:');
    console.error('📋 Status:', error.response?.status);
    console.error('📋 Message:', error.response?.data?.message || error.message);
    console.error('📋 Données:', error.response?.data);
  }
}

testRegister();
