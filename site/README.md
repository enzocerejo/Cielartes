# site/ : le site Cielarte

Ce dossier contient tout ce que le navigateur charge. C'est lui, et lui seul, qui est mis en ligne (voir [docs/HEBERGEMENT.md](../docs/HEBERGEMENT.md)).

[← Retour à l'accueil du dépôt](../README.md)

## Contenu

| Fichier ou dossier | Rôle |
|---|---|
| [index.html](index.html) | La seule page du site, et son point d'entrée : elle pose le cadre (bandeau, zone principale) et charge le CSS et le JavaScript. |
| [css/style.css](css/style.css) | L'apparence : couleurs, quatre palettes, mode sombre, mise en page. |
| [js/app.js](js/app.js) | Toute la logique : navigation entre les pages, affichage, enregistrement des données dans le navigateur. Son plan est décrit dans [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md). |
| [documents-tp/](#documents-des-tp) | Les fichiers fournis avec les TP, un sous-dossier par TP. |
| [robots.txt](robots.txt) | Demande aux moteurs de recherche de ne pas parcourir le site. |
| [_headers](_headers) | Même demande, sous forme d'en-tête HTTP. Lu par Cloudflare Pages, ignoré par GitHub Pages. |

## Documents des TP

Chaque TP qui fournit des documents a son dossier dans `documents-tp/`, nommé comme le TP, en minuscules et sans accents.

| Dossier | TP |
|---|---|
| [documenter-reseau-cabinet/](documents-tp/documenter-reseau-cabinet/) | Documenter le réseau d'un cabinet (Réseaux) : activité, annexes 1 et 2, cours sur les schémas réseau, corrigé en PDF et en draw.io |

Pour ajouter les documents d'un nouveau TP :

1. crée `documents-tp/<nom-du-tp>/` et mets-y les fichiers, avec des noms explicites sans accents ni espaces (`annexe1-cahier-des-charges.pdf`) ;
2. dans `js/app.js`, déclare-les dans la liste `documents` du TP, sur le modèle de `tpCabinet()`.

Les fichiers déposés depuis le site (glisser-déposer dans un TP) ne vont pas ici : ils restent dans le navigateur.
