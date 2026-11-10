# Cielarte : carnet de TP

Site statique (HTML, CSS, JavaScript) pour cataloguer les TP du BTS : objectif, étapes, compétences, questionnaires, commentaires et notes.

## Lancer le site

Double-clique sur `index.html`. Il s'ouvre dans le navigateur, sans installation.

Pour voir les documents fournis avec les TP (dossier `docs/`), lance plutôt un petit serveur local dans ce dossier :

```
python -m http.server 8000
```

puis ouvre http://localhost:8000. Les fichiers que tu déposes toi-même dans un TP sont gardés dans le navigateur (IndexedDB).

Les données sont enregistrées **dans le navigateur** (localStorage). Elles restent sur ce PC et dans ce navigateur. Pense à faire une sauvegarde régulière depuis l'onglet **Données** → *Télécharger la sauvegarde*.

## Fonctionnalités

- **Mes TP** : liste avec recherche (titre, compétence, commande dans les notes…), filtre par matière et par statut, avancement.
- **Fiche TP** :
  - *Aperçu* : objectif, compétences, résumé
  - *Étapes* : à cocher, réordonnables, avec un détail (commandes, configs)
  - *Questionnaires* : création de QCM, passage du quiz, historique des scores
  - *Commentaires* : remarques datées
  - *Notes* : bloc-notes libre, enregistré automatiquement
- **Compétences** : vue de toutes les compétences et des TP où elles ont été travaillées.
- **Données** : export et import JSON, réinitialisation.

## Mettre le site en ligne

Le site est publié avec **GitHub Pages** : *Settings → Pages → Source : Deploy from a branch*, branche `main`, dossier `/ (root)`. Chaque modification fusionnée sur `main` met le site à jour toute seule, sur https://enzocerejo.github.io/Cielartes/.

`index.html` doit donc rester à la racine du dépôt. Le site publié est public, même si le dépôt est privé : tout ce qui est dans `docs/` est téléchargeable. `robots.txt` et `_headers` demandent aux moteurs de recherche de ne pas l'indexer, mais ce n'est pas une protection.

Les données (TP, notes, fichiers déposés) restent enregistrées **dans le navigateur**. Sur un autre PC, il faut importer la sauvegarde JSON (onglet **Données**).

## Accéder au site sans être en ligne

Sur n'importe quel PC : `git clone` du dépôt (ou *Code → Download ZIP*), puis `python -m http.server 8000` dans le dossier et ouvrir http://localhost:8000.
