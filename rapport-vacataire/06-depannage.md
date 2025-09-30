# Dépannage

## Dossier retourne 400
- Message: `Documents incomplets: CV et Diplôme requis...`
- Solution: téléverser le CV et le Diplôme côté vacataire, puis réessayer.

## Dossier retourne 404
- Le vacataire n’existe pas pour l’ID donné.
- Vérifier `GET /api/vacataires`.
- Utiliser l’ID `vacataire.id` affiché en liste, ou la route par `userId`.

## CORS vers translate-pa.googleapis.com
- Appel direct navigateur non autorisé.
- Désactiver extension/auto-traduction ou proxifier côté backend.

## /api/courses en 404
- La bonne route publique: `/api/applications/courses`.
- La page `Courses` a été corrigée en conséquence.
