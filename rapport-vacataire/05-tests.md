# Tests – Dossier Vacataire

## Pré-requis
- Backend démarré: http://localhost:5000/api
- Compte Admin/RH
- Vacataire existant avec CV et Diplôme dans `backend/uploads`

## Tests UI
1. Se connecter en Admin/RH
2. Aller à "Gestion des Vacataires"
3. Cliquer sur "Dossier" d’un vacataire → Un ZIP doit se télécharger
4. Ouvrir le ZIP: vérifier `profil.json`, `CV_*`, `Diplome_*`

## Tests API (PowerShell)
```powershell
$loginBody = '{"email":"admin@2ie.edu.bf","password":"admin123"}'
$login = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' -Method Post -Body $loginBody -ContentType 'application/json'
$headers = @{ Authorization = ('Bearer ' + $login.token) }

# Lister
Invoke-RestMethod -Uri 'http://localhost:5000/api/vacataires' -Headers $headers

# Télécharger
Invoke-WebRequest -Uri 'http://localhost:5000/api/vacataires/ID/dossier' -Headers $headers -OutFile 'dossier.zip'
```
