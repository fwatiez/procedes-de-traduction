# Atelier de version anglaise — L2

Site pédagogique statique en français, conçu pour GitHub Pages.

## Fonctionnalités du prototype
- Pages de cours en HTML.
- Banque de QCM dans `data/questions.json`.
- Tirage aléatoire des questions et mélange des propositions.
- Correction et explications à la fin du QCM.
- Aucun compte, serveur, cookie ou stockage des résultats.

## Publier gratuitement avec GitHub Pages
1. Créez un dépôt GitHub public, par exemple `version-l2`.
2. Téléversez le contenu de ce dossier à la racine du dépôt.
3. Dans **Settings → Pages**, choisissez **Deploy from a branch**.
4. Sélectionnez la branche `main` et le dossier `/ (root)`, puis enregistrez.
5. GitHub publiera le site à l'adresse `https://VOTRE-NOM.github.io/version-l2/`.

## Ajouter des questions
Modifiez `data/questions.json`. Chaque question doit comporter :
- `id` : identifiant unique ;
- `category` : `tenses`, `modals`, `articles`, `prepositions` ou `false-friends` ;
- `label` : intitulé affiché ;
- `question` : énoncé ;
- `answers` : exactement quatre propositions ;
- `correct` : index de la bonne réponse, de 0 à 3 ;
- `answersOriginal` : les quatre propositions dans leur ordre d'origine ;
- `explanation` : explication affichée dans le corrigé.

Pour ajouter une catégorie, ajoutez aussi une option dans le menu `#category` de `index.html`.

## Tester en local
Pour que le navigateur puisse charger le fichier JSON, lancez un petit serveur local depuis ce dossier :
`python -m http.server 8000`
Puis ouvrez `http://localhost:8000`.

## À compléter avant diffusion
- Remplacer les questions de démonstration par vos questions relues et validées.
- Compléter les fiches de cours.
- Ajouter vos mentions de cours / contact si nécessaire.
- Vérifier les traductions et explications avec vos supports de TD.

Le site ne collecte aucun résultat. Les réponses sont conservées uniquement en mémoire pendant la session du navigateur.
