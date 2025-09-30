const axios = require('axios');

async function testRegisterAPI() {
  try {
    console.log('🔍 Test de l\'API d\'inscription...');
    
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      phone: '+226 70 12 34 56',
      role: 'vacataire'
    });
    
    console.log('✅ Inscription réussie:', response.data);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'inscription:', error.response?.data || error.message);
    console.error('📋 Status:', error.response?.status);
    console.error('📋 Headers:', error.response?.headers);
  }
}

testRegisterAPI();
