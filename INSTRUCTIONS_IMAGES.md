# 🖼️ Instructions pour ajouter les images

## Images requises

Pour que l'application fonctionne correctement, vous devez ajouter **2 images** dans le dossier `frontend/public/` :

### 1. Logo 2iE
- **Nom du fichier** : `logo2ie.png`
- **Emplacement** : `frontend/public/logo2ie.png`
- **Description** : Logo de l'Institut 2iE
- **Format** : PNG (avec transparence de préférence)
- **Taille recommandée** : 200x200px minimum

### 2. Image de fond du bâtiment
- **Nom du fichier** : `fond.png`
- **Emplacement** : `frontend/public/fond.png`
- **Description** : Photo du bâtiment de l'Institut 2iE
- **Format** : PNG
- **Taille recommandée** : 1920x1080px minimum

## 📁 Structure des fichiers

```
frontend/
├── public/
│   ├── logo2ie.png    ← À ajouter
│   ├── fond.png       ← À ajouter
│   ├── favicon.ico
│   ├── index.html
│   └── ...
```

## 🚀 Étapes d'installation

1. **Placez le logo** :
   - Renommez votre fichier logo en `logo2ie.png`
   - Copiez-le dans `frontend/public/logo2ie.png`

2. **Placez l'image de fond** :
   - Renommez votre fichier image en `fond.png`
   - Copiez-le dans `frontend/public/fond.png`

3. **Redémarrez l'application** :
   ```bash
   cd frontend
   npm start
   ```

## ✅ Vérification

Une fois les images ajoutées, vous devriez voir :
- Le logo 2iE dans le header et footer
- L'image du bâtiment (`fond.png`) en arrière-plan de la page d'accueil
- La page d'accueil avec le titre "Bienvenue sur la plateforme de gestion des vacataires"
- Le bouton "Accéder à la plateforme" qui redirige vers le dashboard ou la connexion
- L'effet glassmorphism sur la carte de connexion

## 🎨 Design reproduit

L'application reproduit fidèlement le design de l'image fournie :
- **Header bleu foncé** avec logo et navigation
- **Image de fond floue** du bâtiment 2iE
- **Carte de connexion** avec effet glassmorphism
- **Footer bleu foncé** avec informations légales
- **Séparateurs jaunes** entre les sections
- **Design responsive** pour tous les écrans

## 🔧 Personnalisation

Si vous souhaitez modifier les couleurs ou le style :
- Les couleurs principales sont définies dans les fichiers CSS
- Le bleu principal : `#1a365d`
- Le jaune des séparateurs : `#fbbf24`
- L'effet glassmorphism est configuré dans les styles
