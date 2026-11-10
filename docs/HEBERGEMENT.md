# Mettre le site en ligne

[← Retour à docs/](README.md)

## GitHub Pages (solution retenue)

Le dépôt contient un workflow, [`.github/workflows/pages.yml`](../.github/workflows/pages.yml), qui publie le dossier `site/` à chaque push sur la branche `main`. Seul `site/` est publié : la documentation de `docs/` et le README ne le sont pas.

Réglage à faire une seule fois sur GitHub :

1. ouvre le dépôt, puis *Settings → Pages* ;
2. dans *Build and deployment → Source*, choisis **GitHub Actions** ;
3. fais un push sur `main` (ou lance le workflow « Publier le site » depuis l'onglet *Actions*). L'adresse du site s'affiche dans *Settings → Pages* quand c'est fini.

À savoir :

- sur un dépôt privé, GitHub Pages demande un compte GitHub Pro (gratuit avec le GitHub Student Developer Pack) ;
- le site publié est **public**, même si le dépôt est privé. Tout ce qui est dans `site/documents-tp/` est donc visible par quiconque a l'adresse ;
- `robots.txt` demande aux moteurs de recherche de ne pas l'indexer, mais ce n'est pas une protection.

## Alternative privée : Cloudflare Pages + Cloudflare Access

Si le site doit redevenir privé : Cloudflare Pages lit le dépôt et publie `site/` (dossier de sortie à indiquer : `site`), et Cloudflare Access protège l'adresse avec un code envoyé par e-mail. Le fichier `site/_headers` est lu par Cloudflare.

## Accéder au site depuis un autre PC

- **En ligne :** ouvre simplement l'adresse GitHub Pages.
- **Sans connexion :** récupère le dépôt (`git clone` ou *Code → Download ZIP*) et lance le serveur local décrit dans le [README](../README.md#lancer-le-site).

Dans les deux cas, les données (TP ajoutés, notes, fichiers déposés) restent dans le navigateur où elles ont été saisies. Pour les retrouver ailleurs : onglet **Données** → *Télécharger la sauvegarde* sur le premier PC, puis *Importer* sur l'autre.
