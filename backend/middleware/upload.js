const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer le dossier uploads s'il n'existe pas
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtre pour les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Seuls les fichiers PDF, DOC, DOCX et images sont acceptés.'));
  }
};

// Configuration de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  },
  fileFilter: fileFilter
});

// Middleware pour upload de fichiers multiples
const uploadFiles = upload.fields([
  { name: 'cvFile', maxCount: 1 },
  { name: 'diplomaFile', maxCount: 1 }
]);

// Middleware pour upload d'un seul fichier
const uploadSingle = upload.single('file');

module.exports = {
  uploadFiles,
  uploadSingle
};