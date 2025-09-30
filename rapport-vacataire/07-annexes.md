# Annexes

## Stockage des documents
- Dossier: `backend/uploads/`
- Géré par Multer (`middleware/upload.js`)
- Nommage: `cvFile-<timestamp>-<rand>.<ext>`, `diplomaFile-<timestamp>-<rand>.<ext>`

## Conventions ZIP
- `profil.json` inclut: vacataireId, status, specialization, experienceYears, user{...}, exportedAt
- Fichiers nommés: `CV_<Nom>.<ext>`, `Diplome_<Nom>.<ext>`

## Sécurité
- JWT + contrôle de rôle Admin/RH
- Limite upload: 5MB, types: pdf/doc/docx/images
