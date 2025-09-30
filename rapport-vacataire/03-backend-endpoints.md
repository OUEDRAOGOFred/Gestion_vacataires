# Endpoints Backend – Dossier Vacataire

## Sécurité
- JWT obligatoire (header `Authorization: Bearer <token>`)
- Rôle requis: Admin ou RH (`isAdminOrRH`)

## GET /api/vacataires/:id/dossier
- Paramètre: `id` = `vacataire.id` (ou `userId` toléré via recherche OR)
- Réponse: ZIP (application/zip)
- Contenu ZIP:
  - `profil.json`
  - `CV_<Nom>.<ext>` (si présent)
  - `Diplome_<Nom>.<ext>` (si présent)
- Dans la configuration actuelle, si CV ou Diplôme manquent → 400

## GET /api/vacataires/user/:userId/dossier
- Paramètre: `userId` = `users.id`
- Comportement identique, ciblage par identifiant utilisateur

## Erreurs possibles
- 400: `Documents incomplets: CV et Diplôme requis pour générer le dossier.`
- 404: `Vacataire non trouvé` (ou `Utilisateur non trouvé`)
- 500: `Erreur lors de la génération du dossier`
