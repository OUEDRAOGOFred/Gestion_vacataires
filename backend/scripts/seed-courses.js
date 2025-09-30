const axios = require('axios');

async function main() {
  try {
    const baseUrl = process.env.API_URL || 'http://localhost:5000/api';
    const email = process.env.ADMIN_EMAIL || 'admin@2ie.edu.bf';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    const loginResp = await axios.post(`${baseUrl}/auth/login`, { email, password });
    const token = loginResp.data.token;
    if (!token) {
      console.error('Échec login: token manquant');
      process.exit(1);
    }

    const headers = { Authorization: `Bearer ${token}` };
    const courses = [
      { code: 'CS401', name: 'Algorithmique avancée', hoursPerWeek: 4, totalHours: 48, semester: 'S7', department: 'Informatique' },
      { code: 'MG210', name: 'Gestion de Projet', hoursPerWeek: 3, totalHours: 36, semester: 'S5', department: 'Management' },
      { code: 'NT300', name: 'Réseaux Informatiques', hoursPerWeek: 3, totalHours: 36, semester: 'S6', department: 'Informatique' },
      { code: 'DB220', name: 'Bases de Données', hoursPerWeek: 4, totalHours: 48, semester: 'S5', department: 'Informatique' }
    ];

    for (const c of courses) {
      try {
        const resp = await axios.post(`${baseUrl}/applications/courses`, c, { headers });
        console.log('Créé:', resp.data?.course?.code || c.code, '-', resp.data?.course?.name || c.name);
      } catch (err) {
        if (err.response) {
          console.error('Erreur création', c.code, '-', err.response.status, err.response.data);
        } else {
          console.error('Erreur création', c.code, '-', err.message);
        }
      }
    }

    console.log('Seed terminé.');
  } catch (e) {
    console.error('Erreur seed:', e.message);
    process.exit(1);
  }
}

main();


