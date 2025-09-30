# Parcours Frontend

## Page Gestion des Vacataires
- Affiche la liste des vacataires (Admin/RH).
- Colonne Actions → bouton "Dossier":
  - Appelle `vacataireService.downloadDossier(vacataire.id)`
  - Si 404, récupère `vacataire.user.id` et appelle `downloadDossierByUser(userId)`
  - Télécharge le blob ZIP (`application/zip`)

## Services API (Axios)
- Base URL: `REACT_APP_API_URL` ou `http://localhost:5000/api`
- `downloadDossier(id)` → GET `/vacataires/:id/dossier` (blob)
- `downloadDossierByUser(userId)` → GET `/vacataires/user/:userId/dossier` (blob)
