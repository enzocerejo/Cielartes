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

## Mettre le site en ligne en privé

Le dépôt GitHub est privé. GitHub Pages ne convient pas : sur un dépôt privé il faut un plan payant, et la page publiée reste publique.

Solution retenue : **Cloudflare Pages + Cloudflare Access** (gratuit).

1. Cloudflare Pages lit ce dépôt privé et publie le site à chaque `git push` sur `main`.
2. Cloudflare Access protège l'adresse : pour ouvrir le site, il faut saisir son e-mail et recevoir un code à usage unique. Seules les adresses autorisées passent.

Le fichier `_headers` et `robots.txt` demandent aux moteurs de recherche de ne pas indexer le site.

Limite : les données (TP, notes, fichiers déposés) sont toujours enregistrées **dans le navigateur**. Sur un autre PC, il faut importer la sauvegarde JSON (onglet **Données**). Une vraie base partagée demandera un backend plus tard.

## Accéder au site sans être en ligne

Sur n'importe quel PC : `git clone` du dépôt (ou *Code → Download ZIP*), puis `python -m http.server 8000` dans le dossier et ouvrir http://localhost:8000.
