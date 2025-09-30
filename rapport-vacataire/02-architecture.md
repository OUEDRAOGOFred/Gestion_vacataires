# Architecture et Flux

## Backend
- Express + Sequelize (MySQL)
- Uploads via Multer: `backend/uploads/`
- Archive ZIP via `archiver`
- Endpoints:
  - GET `/api/vacataires/:id/dossier`
  - GET `/api/vacataires/user/:userId/dossier`
- Middlewares: `authenticateToken`, `isAdminOrRH`

## Frontend
- React + Axios
- Service `vacataireService.downloadDossier(id)` et `downloadDossierByUser(userId)`
- Page `VacatairesAdmin`: bouton « Dossier » par ligne
- Fallback automatique: si 404 par id, réessaye par `userId`
