// Fichier de configuration d'exemple
// Copiez ce fichier vers config.js et modifiez les valeurs selon votre environnement

module.exports = {
  // Configuration de la base de données
  database: {
    host: 'localhost',
    name: 'vacataires_db',
    user: 'root',
    password: 'password'
  },
  
  // Configuration JWT
  jwt: {
    secret: 'votre_secret_jwt_tres_securise_ici_changez_cela_en_production',
    expiresIn: '7d'
  },
  
  // Configuration serveur
  server: {
    port: 5000,
    nodeEnv: 'development'
  },
  
  // Configuration CORS
  cors: {
    origin: 'http://localhost:3000'
  },
  
  // Configuration upload
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  }
};