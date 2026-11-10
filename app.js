/* À quoi sert ce fichier : toute la logique du site Cielarte (carnet de TP).
   Il crée les pages (accueil, liste des TP, fiche TP, compétences, données) dans la balise <main id="app">
   de index.html, et enregistre les données dans le navigateur (localStorage, et IndexedDB pour les fichiers).
   L'onglet "Données" permet d'exporter / importer une sauvegarde JSON (sauvegarde ou changement de PC).
   Plan : chaque partie (données, routeur, pages…) commence par un commentaire « ---------- Nom ---------- ». */

const STORE_KEY = 'cielarte-v1';
const PALETTE_KEY = 'cielarte-palette';
const MODE_KEY = 'cielarte-mode';
const AE = ['Non évalué', 'Pas encore', 'En partie', 'Plutôt bien', 'Maîtrisé'];
const STATUTS = { todo: 'À faire', doing: 'En cours', done: 'Terminé' };
const PALETTES = [
  { id: 'ciel', nom: 'Ciel', c: '#2a5a93' },
  { id: 'sapin', nom: 'Sapin', c: '#23655b' },
  { id: 'ardoise', nom: 'Ardoise et corail', c: '#d4573f' },
  { id: 'lavande', nom: 'Lavande', c: '#5f52cf' }
];

/* ---------- Icônes ---------- */
const ICO = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  quiz: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8.5 12l2.5 2.5 5-5"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
  badge: '<circle cx="12" cy="9" r="5"/><path d="M8.5 13l-1.5 8 5-3 5 3-1.5-8"/>',
  data: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  left: '<path d="M15 5l-7 7 7 7"/>',
  right: '<path d="M9 5l7 7-7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v4h16v-4"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'
};
const ic = (n, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO[n]}</svg>`;

/* ---------- Données ---------- */
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const nowISO = () => new Date().toISOString();

/* Données de départ, pour que le site ne soit pas vide à la première visite. */
function exemple() {
  return {
    prenom: 'Enzo',
    tps: [
      {
        id: uid(),
        titre: 'Découvrir l\'algorithmique et les variables en Python',
        matiere: 'Codage',
        date: '2026-10-15', duree: 180, statut: 'doing',
        objectif: 'Passer d\'un problème à un programme Python qui mémorise et fait évoluer des données.\n\n**Ce que je sais faire à la fin :**\n- décrire un problème sous forme d\'algorithme\n- traduire un algorithme simple en Python\n- utiliser des variables et des constantes\n- prévoir le résultat d\'un programme avant de l\'exécuter',
        competences: ['Analyser un problème', 'Écrire un programme Python', 'Tester et valider un programme'],
        vocabulaire: [['Algorithme', 'Suite finie et ordonnée d\'instructions permettant d\'obtenir un résultat'], ['Affectation', 'Instruction qui donne une valeur à un nom'], ['Constante', 'Valeur qui ne change pas, écrite en MAJUSCULES']],
        etapes: [
          { id: uid(), texte: 'Décrire un problème avec un algorithme', detail: 'Écrire en français les étapes, dans l\'ordre, avant de coder.\n\n- données en entrée\n- traitement\n- résultat en sortie', fait: true },
          { id: uid(), texte: 'Les variables', detail: 'Une **variable** est un nom lié à une valeur qui peut évoluer. Python lit d\'abord la partie droite de l\'affectation.\n\n```\nscore = 0\nscore = score + 10\nprint(score)   # 10\n```', fait: true },
          { id: uid(), texte: 'Les types de données', detail: 'Chaque valeur a un type : `int`, `float`, `str` ou `bool`.\n\n```\ntype(3.5)    # float\ntype("BTS")  # str\n```', fait: false },
          { id: uid(), texte: 'Suivre l\'état d\'un programme', detail: 'Remplir un **tableau de suivi** ligne par ligne pour prévoir la valeur de chaque variable.', fait: false }
        ],
        quiz: [{
          id: uid(), titre: 'Révision variables et types',
          questions: [
            { id: uid(), q: 'Que vaut x après : x = 4 puis x = x * 2 ?', options: ['4', '6', '8', '16'], bonne: 2 },
            { id: uid(), q: 'Quel est le type de "42" ?', options: ['int', 'str', 'float'], bonne: 1 },
            { id: uid(), q: 'Comment écrit-on une constante en Python ?', options: ['taux_tva', 'TauxTva', 'TAUX_TVA'], bonne: 2 }
          ],
          resultats: [{ score: 2, total: 3, date: '2026-10-16T17:20:00.000Z' }]
        }],
        commentaires: [{ id: uid(), texte: 'Attention : input() renvoie toujours une chaîne, il faut faire int(input()) pour un nombre.', date: '2026-10-15T15:02:00.000Z' }],
        notes: 'Raccourcis utiles :\nCtrl + / pour commenter une ligne\nF5 pour exécuter dans Thonny',
        creeLe: nowISO()
      },
      {
        id: uid(),
        titre: 'Mettre en place une DevStation de développement',
        matiere: 'Codage',
        date: '2026-10-29', duree: 120, statut: 'todo',
        objectif: 'Installer et configurer un poste de développement complet : éditeur, Python, Git.',
        competences: ['Installer un poste de travail', 'Utiliser un gestionnaire de versions'],
        vocabulaire: [],
        etapes: [
          { id: uid(), texte: 'Installer VS Code et ses extensions', detail: 'Extensions : Python, Pylance, GitLens.', fait: false },
          { id: uid(), texte: 'Installer Python et vérifier la version', detail: '```\npython --version\n```', fait: false },
          { id: uid(), texte: 'Configurer Git', detail: '```\ngit config --global user.name "Enzo"\ngit config --global user.email "..."\n```', fait: false }
        ],
        quiz: [], commentaires: [], notes: '', creeLe: nowISO()
      },
      {
        id: uid(),
        titre: 'Installer un serveur Debian et le service SSH',
        matiere: 'Réseaux',
        date: '2026-10-08', duree: 240, statut: 'done',
        objectif: 'Installer une Debian minimale sur une VM, configurer une IP fixe et sécuriser l\'accès SSH.',
        competences: ['Installer un système d\'exploitation', 'Configurer un service réseau', 'Sécuriser un accès distant'],
        vocabulaire: [['SSH', 'Protocole d\'accès distant chiffré, port 22']],
        etapes: [
          { id: uid(), texte: 'Créer la VM', detail: 'VirtualBox, 2 Go de RAM, 20 Go de disque, carte réseau en accès par pont.', fait: true },
          { id: uid(), texte: 'Configurer une IP fixe', detail: 'Dans `/etc/network/interfaces` :\n\n```\naddress 192.168.1.50/24\ngateway 192.168.1.1\n```', fait: true },
          { id: uid(), texte: 'Installer et sécuriser OpenSSH', detail: '```\napt install openssh-server\n```\n\nPuis `PermitRootLogin no` dans `/etc/ssh/sshd_config`.', fait: true }
        ],
        quiz: [{ id: uid(), titre: 'Révision SSH', questions: [{ id: uid(), q: 'Quel est le port par défaut de SSH ?', options: ['21', '22', '80', '443'], bonne: 1 }], resultats: [{ score: 1, total: 1, date: '2026-10-09T10:00:00.000Z' }] }],
        commentaires: [], notes: 'ip a\nsystemctl status ssh\njournalctl -u ssh', creeLe: nowISO()
      }
    ]
  };
}


/* TP ajoutés après coup : insérés une seule fois, même si le navigateur a déjà des données */
/* Documents fournis avec les TP : dans docs/ */
const DOSSIER_DOCS_TP = 'docs/';
/* Pendant quelques heures (10/11/2026), ces documents étaient dans documents-tp/documenter-reseau-cabinet/ :
   les données enregistrées à ce moment gardent ce chemin, normaliser() le remet sur docs/. */
const ANCIENS_CHEMINS = { 'documents-tp/documenter-reseau-cabinet/': DOSSIER_DOCS_TP };
/* Réécrit un ancien chemin de document vers le dossier actuel, pour ne pas casser les données déjà enregistrées. */
function cheminDocument(src) {
  if (!src) return src;
  for (const ancien in ANCIENS_CHEMINS) if (src.startsWith(ancien)) return ANCIENS_CHEMINS[ancien] + src.slice(ancien.length);
  return src;
}

/* TP réel « Documenter le réseau d'un cabinet », livré avec ses documents. */
function tpCabinet() {
  const D = (nom, fichier, type, taille) => ({ id: 'seed-' + fichier, nom, type, taille, date: '2026-11-05T10:00:00.000Z', src: DOSSIER_DOCS_TP + fichier, note: '', versions: [] });
  return {
    id: 'tp-cabinet', titre: 'Documenter le réseau d\'un cabinet', matiere: 'Réseaux',
    date: '2026-11-05', duree: 120, statut: 'done',
    objectif: '**Mise en situation** : l\'installation du réseau du cabinet comptable Marchand & Associés (22 salariés, 16 postes fixes et un Wi-Fi pour le personnel) vient d\'être terminée. Avant la recette, il faut produire le dossier de documentation : un schéma physique, un schéma logique et un plan d\'adressage. Un autre technicien doit pouvoir s\'en servir sans enquête préalable.\n\n**Mon rôle** : technicien d\'installation chez ReseauPlus.\n\n**Problématique** : comment présenter ce réseau pour qu\'un technicien qui ne le connaît pas puisse localiser un équipement et comprendre qui peut communiquer avec qui ?\n\n**Activité du référentiel** : R2 Installation et qualification, T2 Production des documents pour la mise en œuvre.\n\n**Outils** : ordinateur, draw.io, lecteur PDF. Travail individuel.',
    competences: ['C04 Analyser un système informatique', 'C01 Communiquer en situation professionnelle'],
    vocabulaire: [['Schéma physique', 'Montre où se trouve chaque équipement (local, baie) et comment il est câblé (cuivre, fibre, ports)'], ['Schéma logique', 'Montre les zones du réseau, les adresses et les passerelles, sans les câbles'], ['CIDR', 'Notation d\'une adresse réseau avec son masque, par exemple 192.168.10.0/24'], ['Cartouche', 'Encadré qui donne le titre, le périmètre, la version, la date et l\'auteur du schéma']],
    etapes: [
      { id: 'cab-1', texte: 'Extraire les informations du cahier des charges', detail: '20 min · annexes 1 et 2\n\n- lire l\'annexe 1 en entier\n- compléter le **tableau A** de l\'annexe 2 : pour chaque équipement, le symbole, l\'emplacement et la zone\n\nLes symboles sont dans le cours (§ 3.1). Tous ne servent pas dans ce réseau.', fait: true },
      { id: 'cab-2', texte: 'Dessiner le schéma physique', detail: '45 min · page « Physique »\n\n- créer `NOM_Prenom_schemas-reseau.drawio` et renommer la première page « Physique »\n- un cadre par local, avec son nom et sa baie\n- nommer chaque équipement avec son repère exact\n- relier selon le tableau des liaisons, en distinguant cuivre et fibre\n- indiquer les ports aux deux extrémités de chaque liaison\n- ajouter une légende et un cartouche\n\nConventions : cours § 3.2. Cartouche : cours § 4.2.', fait: true },
      { id: 'cab-3', texte: 'Dessiner le schéma logique et compléter le plan d\'adressage', detail: '35 min · page « Logique » et tableau B\n\n- une zone par cadre, avec son nom et son adresse réseau en CIDR\n- le pare-feu entre les zones, avec le nom et l\'adresse de chaque interface\n- les équipements de chaque zone avec leur adresse IP\n- compléter le **tableau B** (plan d\'adressage)\n- légende et cartouche\n\nUn schéma logique ne montre pas les câbles : il montre les zones, les adresses et les passerelles.', fait: true },
      { id: 'cab-4', texte: 'Contrôler et rendre le travail', detail: '10 min\n\n- même nom pour chaque équipement sur les deux schémas et dans les annexes\n- tous les équipements du cahier des charges sont sur le schéma physique\n- les adresses du schéma logique correspondent au tableau B\n- exporter les deux pages en un PDF `NOM_Prenom_schemas-reseau.pdf`\n- déposer le .drawio et le PDF dans le dossier de rendu', fait: true }
    ],
    documents: [
      D('Activité : Documenter le réseau d\'un cabinet', 'activite-documenter-reseau-cabinet.pdf', 'application/pdf', 536800),
      D('Annexe 1 : Cahier des charges', 'annexe1-cahier-des-charges.pdf', 'application/pdf', 164509),
      D('Annexe 2 : Extraction et plan d\'adressage', 'annexe2-extraction-plan-adressage.pdf', 'application/pdf', 90922),
      D('Cours : Les schémas réseau', 'cours-schemas-reseau.pdf', 'application/pdf', 2069936),
      D('Corrigé des schémas (PDF)', 'corrige-schemas-reseau.pdf', 'application/pdf', 379888),
      D('Corrigé des schémas (draw.io)', 'corrige-schemas-reseau.drawio', 'application/vnd.jgraph.mxfile', 1938079)
    ],
    autoeval: [
      { critere: 'Extraire d\'un cahier des charges les équipements, les liaisons et les adresses', niveau: 0 },
      { critere: 'Placer chaque équipement dans le bon local et la bonne zone', niveau: 0 },
      { critere: 'Représenter les liaisons avec leur type et leurs ports', niveau: 0 },
      { critere: 'Présenter un schéma lisible, avec légende et cartouche', niveau: 0 },
      { critere: 'Employer les noms et les termes techniques exacts', niveau: 0 }
    ],
    retenu: '',
    quiz: [{
      id: 'cab-quiz', titre: 'Révision schémas réseau',
      questions: [
        { id: 'cq1', q: 'Que montre un schéma logique ?', options: ['Les câbles et les ports', 'Les zones, les adresses et les passerelles', 'L\'emplacement des baies'], bonne: 1 },
        { id: 'cq2', q: 'Que doit contenir un cartouche ?', options: ['Titre, périmètre, version, date, auteur', 'La liste des câbles', 'Les mots de passe des équipements'], bonne: 0 },
        { id: 'cq3', q: 'Sur quel schéma distingue-t-on le cuivre de la fibre ?', options: ['Logique', 'Physique', 'Aucun'], bonne: 1 }
      ],
      resultats: []
    }],
    commentaires: [], notes: '', creeLe: '2026-11-05T10:00:00.000Z'
  };
}
const SEEDS = [tpCabinet];
/* Ajoute une seule fois les TP livrés avec le site, sans écraser ce que l'utilisateur a déjà. */
function ajouterSeeds(d) {
  d.seeds = d.seeds || [];
  SEEDS.forEach(f => { const t = f(); if (!d.seeds.includes(t.id)) { d.seeds.push(t.id); if (!d.tps.some(x => x.id === t.id)) d.tps.unshift(t); } });
  return d;
}

let db = charger();
/* Lit les données du navigateur au démarrage, ou part de l'exemple s'il n'y en a pas. */
function charger() {
  try { const raw = localStorage.getItem(STORE_KEY); if (raw) return ajouterSeeds(normaliser(JSON.parse(raw))); } catch (e) { /* stockage indisponible */ }
  return ajouterSeeds(normaliser(exemple()));
}
/* Complète les champs manquants des anciennes sauvegardes, pour que le reste du code n'ait pas à le vérifier. */
function normaliser(d) {
  d.prenom = d.prenom || '';
  d.tps.forEach(t => {
    t.etapes = t.etapes || []; t.quiz = t.quiz || []; t.commentaires = t.commentaires || [];
    t.competences = t.competences || []; t.vocabulaire = t.vocabulaire || []; t.notes = t.notes || '';
    t.documents = t.documents || []; t.autoeval = t.autoeval || []; t.retenu = t.retenu || '';
    t.documents.forEach(doc => {
      doc.src = cheminDocument(doc.src);
      (doc.versions || []).forEach(v => { v.src = cheminDocument(v.src); });
    });
  });
  return d;
}
/* Enregistre toutes les données dans le navigateur après chaque modification. */
function sauver() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(db)); } catch (e) { toast('Impossible d\'enregistrer dans ce navigateur'); }
}
const getTP = id => db.tps.find(t => t.id === id);

/* ---------- Outils ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtDate = d => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
const fmtDateHeure = d => new Date(d).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const avancement = tp => tp.etapes.length ? Math.round(100 * tp.etapes.filter(e => e.fait).length / tp.etapes.length) : 0;
const INVARIABLES = ['TP', 'quiz', 'quiz fait'];
const pluriel = (n, mot) => `${n} ${mot}${n > 1 && !INVARIABLES.includes(mot) ? 's' : ''}`;

/* Mise en forme simple : **gras**, `code`, listes "- ", blocs ``` */
function inline(s) {
  return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}
/* Mini Markdown (titres, listes, code) pour mettre en forme les textes saisis. */
function md(texte) {
  if (!texte) return '';
  return texte.split(/```\n?/).map((part, i) => {
    if (i % 2) return `<pre>${esc(part.replace(/\n$/, ''))}</pre>`;
    return part.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean).map(b => {
      const lignes = b.split('\n');
      if (lignes.every(l => /^\s*-\s/.test(l))) return `<ul>${lignes.map(l => `<li>${inline(l.replace(/^\s*-\s/, ''))}</li>`).join('')}</ul>`;
      return `<p>${lignes.map(inline).join('<br>')}</p>`;
    }).join('');
  }).join('');
}

/* Petit message de confirmation en bas de l'écran. */
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.add('hidden'), 2200);
}
function ouvrirModal(html) {
  $('#modal-box').innerHTML = html; $('#modal').classList.remove('hidden');
  const first = $('#modal-box input:not([type=radio]):not([type=checkbox]), #modal-box textarea'); if (first) first.focus();
}
function fermerModal() { $('#modal').classList.add('hidden'); $('#modal-box').innerHTML = ''; $('#modal-box').classList.remove('wide'); }
/* Demande confirmation avant une action qu'on ne peut pas annuler. */
function confirmer(msg, onOk) {
  const c = $('#confirm');
  c.innerHTML = `<div class="modal-box confirm-box"><p>${esc(msg)}</p><div class="row" style="justify-content:flex-end"><button class="btn" data-c="non">Annuler</button><button class="btn danger-fill" data-c="oui">Confirmer</button></div></div>`;
  c.classList.remove('hidden');
  c.onclick = ev => { const r = ev.target.dataset.c; if (ev.target === c || r) { c.classList.add('hidden'); c.innerHTML = ''; if (r === 'oui') onOk(); } };
}
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') fermerModal(); });
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!$('#confirm').classList.contains('hidden')) { $('#confirm').classList.add('hidden'); return; }
  fermerModal();
});

/* ---------- Bandeau : salutation, navigation, palettes ---------- */
const NAV = [['accueil', 'Accueil', 'home'], ['tps', 'Mes TP', 'layers'], ['competences', 'Compétences', 'badge'], ['donnees', 'Données', 'data']];
/* Met à jour le bandeau du haut et surligne la page active. */
function bandeau(actif) {
  $('#hello-name').textContent = db.prenom ? `Bonjour ${db.prenom}` : 'Bonjour';
  const d = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  $('#hello-date').textContent = d.charAt(0).toUpperCase() + d.slice(1);
  $('#mainnav').innerHTML = NAV.map(([k, l, i]) => `<a href="#${k}" class="${k === actif ? 'active' : ''}">${ic(i)}<span>${l}</span></a>`).join('');
}
function appliquerPalette(id) {
  if (id === 'ciel') document.documentElement.removeAttribute('data-palette');
  else document.documentElement.setAttribute('data-palette', id);
  $$('#palettes button').forEach(b => b.classList.toggle('on', b.dataset.p === id));
}
(function initPalettes() {
  let p = 'ciel';
  try { p = localStorage.getItem(PALETTE_KEY) || 'ciel'; } catch (e) { /* rien */ }
  $('#palettes').innerHTML = '<span class="lbl">Couleur</span>' + PALETTES.map(x => `<button data-p="${x.id}" title="${x.nom}" aria-label="Couleur ${x.nom}" style="background:${x.c}"></button>`).join('');
  $('#palettes').addEventListener('click', e => {
    const id = e.target.dataset.p; if (!id) return;
    appliquerPalette(id);
    try { localStorage.setItem(PALETTE_KEY, id); } catch (err) { /* rien */ }
    toast('Couleur : ' + PALETTES.find(x => x.id === id).nom);
  });
  appliquerPalette(p);
  // Mode clair / sombre (clair par défaut)
  let mode = 'light';
  try { mode = localStorage.getItem(MODE_KEY) || 'light'; } catch (e) { /* rien */ }
  const btn = document.createElement('button');
  btn.className = 'mode-btn'; btn.id = 'mode-btn';
  const appliquerMode = m => {
    if (m === 'dark') document.documentElement.setAttribute('data-mode', 'dark'); else document.documentElement.removeAttribute('data-mode');
    btn.innerHTML = ic(m === 'dark' ? 'sun' : 'moon');
    btn.title = m === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre';
    btn.setAttribute('aria-label', btn.title);
  };
  btn.addEventListener('click', () => {
    mode = mode === 'dark' ? 'light' : 'dark'; appliquerMode(mode);
    try { localStorage.setItem(MODE_KEY, mode); } catch (e) { /* rien */ }
  });
  $('#palettes').appendChild(btn);
  appliquerMode(mode);
})();

/* ---------- Routeur ---------- */
let etatUI = { section: 'presentation', etape: 0, filtre: { q: '', matiere: '', statut: '' } };
/* Choisit la page à afficher selon l'adresse (#tps, #tp-…, #competences…) : c'est le point de départ de chaque navigation. */
function route() {
  const h = location.hash.replace(/^#/, '');
  if (h.startsWith('tp-') && getTP(h.slice(3))) { bandeau('tps'); return vueTP(getTP(h.slice(3))); }
  if (h === 'tps') { bandeau('tps'); return vueListe(); }
  if (h === 'competences') { bandeau('competences'); return vueCompetences(); }
  if (h === 'donnees') { bandeau('donnees'); return vueDonnees(); }
  bandeau('accueil'); return vueAccueil();
}
window.addEventListener('hashchange', () => { etatUI.section = 'presentation'; etatUI.etape = 0; route(); window.scrollTo(0, 0); });

/* ---------- Accueil ---------- */
function matieres() {
  const m = {};
  db.tps.forEach(t => { const k = t.matiere || 'Sans matière'; (m[k] = m[k] || []).push(t); });
  return m;
}
/* Page d'accueil : salutation, matières et derniers TP. */
function vueAccueil() {
  const m = matieres();
  const enCours = db.tps.filter(t => t.statut === 'doing');
  const nbComp = new Set(db.tps.flatMap(t => t.competences)).size;
  const d = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  $('#app').innerHTML = `
    <section class="welcome">
      <div>
        <div class="date">${d.charAt(0).toUpperCase() + d.slice(1)}</div>
        <h1>Bonjour${db.prenom ? ' ' + esc(db.prenom) : ''},<em>prêt pour le prochain TP ?</em></h1>
        <p>${enCours.length ? `Tu as ${pluriel(enCours.length, 'TP')} en cours : <a href="#tp-${enCours[0].id}">${esc(enCours[0].titre)}</a>.` : 'Aucun TP en cours. Ajoute ton prochain TP pour le garder sous la main.'}</p>
      </div>
      <div class="kpis">
        <div class="kpi"><b>${db.tps.length}</b><span>TP enregistrés</span></div>
        <div class="kpi"><b>${nbComp}</b><span>compétences</span></div>
        <div class="kpi"><b>${db.tps.reduce((a, t) => a + t.quiz.length, 0)}</b><span>questionnaires</span></div>
      </div>
    </section>
    <h2 class="section-title">Mes matières</h2>
    <div class="subjects">
      ${Object.entries(m).map(([nom, tps]) => {
        const ouverts = tps.filter(t => t.statut !== 'done').length;
        return `<a class="card subject" href="#tps" data-matiere="${esc(nom)}">
          <h3>${esc(nom)}</h3>
          <div class="muted" style="position:relative">${pluriel(tps.length, 'TP')}</div>
          <div class="meta" style="${ouverts ? '' : 'color:var(--muted)'}">${ouverts ? `<span class="dot"></span>${pluriel(ouverts, 'TP')} en cours ou à faire` : 'Tout est terminé'}</div>
        </a>`;
      }).join('')}
      <button class="card subject" id="nv-tp-home" style="text-align:left;font:inherit;cursor:pointer;border-style:dashed">
        <h3>${ic('plus')} Nouveau TP</h3>
        <div class="muted" style="position:relative">Ajoute un TP et ses étapes</div>
      </button>
    </div>`;
  $$('.subject[data-matiere]').forEach(a => a.addEventListener('click', () => { etatUI.filtre.matiere = a.dataset.matiere === 'Sans matière' ? '' : a.dataset.matiere; }));
  $('#nv-tp-home').addEventListener('click', () => formTP());
}

/* ---------- Liste des TP ---------- */
function miniParcours(t) {
  const et = t.etapes.slice(0, 6);
  const n = Math.max(et.length, 2), W = 260, x = i => 16 + i * ((W - 32) / (n - 1));
  const pts = Array.from({ length: n }, (_, i) => [x(i), i === 0 ? 38 : 16]);
  const mid = (pts[0][0] + pts[1][0]) / 2;
  const d = `M${pts[0][0]} 38 C${mid} 38 ${mid} 16 ${pts[1][0]} 16 H${pts[n - 1][0]}`;
  const courant = et.findIndex(e => !e.fait);
  const ronds = pts.map(([cx, cy], i) => {
    const e = et[i];
    if (e && e.fait) return `<circle cx="${cx}" cy="${cy}" r="10" fill="var(--brand)"/><circle cx="${cx}" cy="${cy}" r="3.2" fill="var(--on-brand)"/>`;
    if (i === courant) return `<circle cx="${cx}" cy="${cy}" r="10" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>`;
    return `<circle cx="${cx}" cy="${cy}" r="9" fill="var(--warm-soft)" stroke="var(--muted)" stroke-width="1.5"/>`;
  }).join('');
  return `<svg class="mini-path" viewBox="0 0 ${W} 54" preserveAspectRatio="xMinYMid meet" aria-hidden="true"><path d="${d}" fill="none" stroke="color-mix(in srgb, var(--accent) 40%, var(--border))" stroke-width="3" stroke-linecap="round"/>${ronds}</svg>`;
}
function carteTP(t) {
  return `
    <a class="card tp-card" href="#tp-${t.id}">
      ${miniParcours(t)}
      <div class="muted small">${esc(t.matiere || 'Sans matière')}${t.date ? ' · ' + fmtDate(t.date) : ''}</div>
      <h3>${esc(t.titre)}</h3>
      <div class="foot">
        <span class="status ${t.statut}"><span class="dot"></span>${STATUTS[t.statut]}</span>
        <span class="muted small">${t.etapes.filter(e => e.fait).length}/${t.etapes.length} étapes · ${t.quiz.length} quiz</span>
      </div>
    </a>`;
}
/* Page « Mes TP » : liste avec recherche et filtres. */
function vueListe() {
  const noms = Object.keys(matieres()).filter(x => x !== 'Sans matière').sort();
  const f = etatUI.filtre;
  $('#app').innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <div><h1>Mes TP</h1><p>Choisis un TP pour retrouver ses étapes, ses questionnaires et tes notes.</p></div>
        <div class="row"><span class="pill"><span class="dot"></span>${pluriel(db.tps.length, 'TP')}</span><button class="btn primary" id="nouveau">${ic('plus')} Nouveau TP</button></div>
      </div>
      <div class="toolbar">
        <input id="f-q" placeholder="Rechercher un TP, une compétence, une commande…" value="${esc(f.q)}">
        <select id="f-matiere"><option value="">Toutes les matières</option>${noms.map(m => `<option ${m === f.matiere ? 'selected' : ''}>${esc(m)}</option>`).join('')}</select>
        <select id="f-statut"><option value="">Tous les statuts</option>${Object.entries(STATUTS).map(([k, v]) => `<option value="${k}" ${k === f.statut ? 'selected' : ''}>${v}</option>`).join('')}</select>
      </div>
      <div id="liste"></div>
    </section>`;
  const dessiner = () => {
    const q = f.q.trim().toLowerCase();
    const res = db.tps
      .filter(t => !f.matiere || t.matiere === f.matiere)
      .filter(t => !f.statut || t.statut === f.statut)
      .filter(t => !q || JSON.stringify([t.titre, t.matiere, t.objectif, t.competences, t.etapes, t.notes, t.vocabulaire]).toLowerCase().includes(q))
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    $('#liste').innerHTML = res.length ? `<div class="tp-grid">${res.map(carteTP).join('')}</div>`
      : `<div class="card empty">${db.tps.length ? 'Aucun TP ne correspond à cette recherche.' : 'Aucun TP pour l\'instant. Clique sur « Nouveau TP » pour commencer.'}</div>`;
  };
  dessiner();
  $('#f-q').addEventListener('input', e => { f.q = e.target.value; dessiner(); });
  $('#f-matiere').addEventListener('change', e => { f.matiere = e.target.value; dessiner(); });
  $('#f-statut').addEventListener('change', e => { f.statut = e.target.value; dessiner(); });
  $('#nouveau').addEventListener('click', () => formTP());
}

/* ---------- Formulaire TP ---------- */
/* Formulaire de création ou de modification d'un TP. */
function formTP(tp) {
  const edit = !!tp;
  tp = tp || { titre: '', matiere: etatUI.filtre.matiere || '', date: new Date().toISOString().slice(0, 10), duree: '', statut: 'todo', objectif: '', competences: [], vocabulaire: [], autoeval: [] };
  const noms = Object.keys(matieres()).filter(x => x !== 'Sans matière');
  ouvrirModal(`
    <h2>${edit ? 'Modifier le TP' : 'Nouveau TP'}</h2>
    <form id="form-tp">
      <div class="field"><label for="ft-titre">Titre</label><input id="ft-titre" name="titre" required value="${esc(tp.titre)}" placeholder="ex. Mettre en place un serveur DHCP"></div>
      <div class="grid2">
        <div><label for="ft-mat">Matière</label><input id="ft-mat" name="matiere" list="liste-matieres" value="${esc(tp.matiere)}"><datalist id="liste-matieres">${noms.map(m => `<option value="${esc(m)}">`).join('')}</datalist></div>
        <div><label for="ft-statut">Statut</label><select id="ft-statut" name="statut">${Object.entries(STATUTS).map(([k, v]) => `<option value="${k}" ${k === tp.statut ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
        <div><label for="ft-date">Date</label><input id="ft-date" type="date" name="date" value="${esc(tp.date)}"></div>
        <div><label for="ft-duree">Durée prévue (min)</label><input id="ft-duree" type="number" min="0" step="10" name="duree" value="${esc(tp.duree)}"></div>
      </div>
      <div class="field"><label for="ft-obj">Présentation / objectif</label><textarea id="ft-obj" name="objectif" placeholder="Ce qu'il fallait réaliser… (**gras**, \`code\`, listes avec - )">${esc(tp.objectif)}</textarea></div>
      <div class="field"><label for="ft-comp">Compétences travaillées <span class="muted small">(une par ligne)</span></label><textarea id="ft-comp" name="competences" style="min-height:70px">${esc(tp.competences.join('\n'))}</textarea></div>
      <div class="field"><label for="ft-voc">Vocabulaire <span class="muted small">(terme : définition, un par ligne)</span></label><textarea id="ft-voc" name="vocabulaire" style="min-height:70px" placeholder="DHCP : attribue automatiquement les adresses IP">${esc(tp.vocabulaire.map(v => v.join(' : ')).join('\n'))}</textarea></div>
      <div class="field"><label for="ft-ae">Auto-évaluation : je suis capable de… <span class="muted small">(un critère par ligne)</span></label><textarea id="ft-ae" name="autoeval" style="min-height:70px" placeholder="Configurer un VLAN sur un switch">${esc((tp.autoeval || []).map(a => a.critere).join('\n'))}</textarea></div>
      <div class="row spread" style="margin-top:20px">
        <span>${edit ? `<button type="button" class="btn danger" id="suppr-tp">${ic('trash')} Supprimer</button>` : ''}</span>
        <span class="row"><button type="button" class="btn" onclick="fermerModal()">Annuler</button><button class="btn primary">${edit ? 'Enregistrer' : 'Créer le TP'}</button></span>
      </div>
    </form>`);
  $('#form-tp').addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const data = {
      titre: d.titre.trim(), matiere: d.matiere.trim(), date: d.date, duree: d.duree ? +d.duree : '', statut: d.statut, objectif: d.objectif.trim(),
      competences: d.competences.split('\n').map(s => s.trim()).filter(Boolean),
      autoeval: d.autoeval.split('\n').map(x => x.trim()).filter(Boolean).map(c => ({ critere: c, niveau: ((tp.autoeval || []).find(a => a.critere === c) || {}).niveau || 0 })),
      vocabulaire: d.vocabulaire.split('\n').map(l => l.split(/\s*:\s*/)).filter(p => p[0].trim()).map(([a, ...b]) => [a.trim(), b.join(' : ').trim()])
    };
    if (edit) Object.assign(tp, data);
    else { tp = { id: uid(), ...data, etapes: [], quiz: [], commentaires: [], documents: [], retenu: '', notes: '', creeLe: nowISO() }; db.tps.push(tp); }
    sauver(); fermerModal();
    if (edit) route(); else location.hash = 'tp-' + tp.id;
    toast(edit ? 'TP modifié' : 'TP créé');
  });
  if (edit) $('#suppr-tp').addEventListener('click', () => confirmer('Supprimer définitivement ce TP et tout son contenu ?', () => {
    db.tps = db.tps.filter(t => t.id !== tp.id); sauver(); fermerModal(); location.hash = 'tps'; toast('TP supprimé');
  }));
}

/* ---------- Page d'un TP : parcours ---------- */
/* Page d'un TP : parcours horizontal qui affiche la section choisie (étapes, documents, quiz…). */
function vueTP(tp) {
  const faites = tp.etapes.filter(e => e.fait).length;
  const nodes = [
    { k: 'presentation', l: 'Présentation', i: 'target', ok: !!tp.objectif },
    { k: 'etapes', l: 'Étapes', i: 'list', sub: `${faites}/${tp.etapes.length}`, ok: tp.etapes.length && faites === tp.etapes.length },
    { k: 'documents', l: 'Documents', i: 'file', sub: tp.documents.length || '', ok: tp.documents.length > 0 },
    { k: 'quiz', l: 'Questionnaires', i: 'quiz', sub: tp.quiz.length ? pluriel(tp.quiz.length, 'quiz') : '', ok: tp.quiz.length && tp.quiz.every(q => q.resultats.length), warm: true },
    { k: 'commentaires', l: 'Commentaires', i: 'chat', sub: tp.commentaires.length || '', ok: tp.commentaires.length > 0 },
    { k: 'notes', l: 'Notes', i: 'pencil', ok: !!tp.notes.trim() },
    { k: 'bilan', l: 'Bilan', i: 'flag', sub: tp.autoeval.length ? `AE ${tp.autoeval.filter(a => a.niveau).length}/${tp.autoeval.length}` : '', ok: tp.statut === 'done' }
  ];
  $('#app').innerHTML = `
    <div class="tp-title">
      <div class="t">${ic('layers')}<div><h1>${esc(tp.titre)}</h1><div class="sub">${esc(tp.matiere || 'Sans matière')}${tp.date ? ' · ' + fmtDate(tp.date) : ''} · <span class="status ${tp.statut}" style="font-size:inherit">${STATUTS[tp.statut]}</span></div></div></div>
      <button class="btn" id="modif">${ic('pencil')} Modifier</button>
    </div>
    <a href="#tps" class="back">${ic('left')} Tous les TP</a>
    <nav class="path" aria-label="Parcours du TP">
      ${nodes.map(n => `
        <button class="node ${n.warm ? 'warm' : ''} ${etatUI.section === n.k ? 'active' : ''}" data-k="${n.k}">
          <span class="c">${ic(n.i)}${n.ok ? `<span class="ok">${ic('check')}</span>` : ''}</span>
          <span class="lbl">${n.l}</span>${n.sub !== undefined && n.sub !== '' ? `<span class="sub">${n.sub}</span>` : ''}
        </button>`).join('')}
    </nav>
    <div id="section"></div>`;
  $('#modif').addEventListener('click', () => formTP(tp));
  $$('.node').forEach(b => b.addEventListener('click', () => { etatUI.section = b.dataset.k; vueTP(tp); }));
  ({ presentation: secPresentation, etapes: secEtapes, documents: secDocuments, quiz: secQuiz, commentaires: secCommentaires, notes: secNotes, bilan: secBilan })[etatUI.section](tp, $('#section'));
}
const teteSection = (titre, droite = '') => `<div class="lesson-head"><h2>${titre}</h2><div class="row">${droite}</div></div>`;

function secPresentation(tp, el) {
  el.innerHTML = `
    ${teteSection(esc(tp.titre), tp.duree ? `<span class="muted">Durée prévue : ${tp.duree} min</span>` : '')}
    <div class="card lesson">
      <h2>Présentation</h2>
      <div class="prose">${tp.objectif ? md(tp.objectif) : '<p class="muted">Aucune présentation. Clique sur « Modifier » pour décrire le TP.</p>'}</div>
      <h3 class="alt">Compétences travaillées</h3>
      <div class="row">${tp.competences.length ? tp.competences.map(c => `<a class="chip" href="#competences">${esc(c)}</a>`).join('') : '<span class="muted">Aucune compétence renseignée.</span>'}</div>
      ${tp.vocabulaire.length ? `<h3 class="alt">Vocabulaire à connaître</h3>
        <div style="overflow-x:auto"><table class="vocab"><thead><tr><th>Terme</th><th>Définition</th></tr></thead><tbody>${tp.vocabulaire.map(([a, b]) => `<tr><td><strong>${esc(a)}</strong></td><td>${esc(b)}</td></tr>`).join('')}</tbody></table></div>` : ''}
      <div class="lesson-foot"><span></span><button class="btn primary" data-go="etapes">Voir les étapes ${ic('right')}</button></div>
    </div>`;
  $('[data-go]', el).addEventListener('click', () => { etatUI.section = 'etapes'; vueTP(tp); });
}

/* Étapes : sommaire + carte de lecture */
function secEtapes(tp, el) {
  const n = tp.etapes.length;
  if (etatUI.etape >= n) etatUI.etape = Math.max(0, n - 1);
  const i = etatUI.etape, e = tp.etapes[i];
  el.innerHTML = `
    ${teteSection('Étapes du TP', `<span class="muted">${tp.etapes.filter(x => x.fait).length} sur ${n} terminées</span>`)}
    <div class="lesson-wrap">
      <div class="toc">
        ${tp.etapes.map((x, j) => `<button class="${j === i ? 'active' : ''} ${x.fait ? 'done' : ''}" data-j="${j}"><span class="n">${x.fait ? '✓' : String(j + 1).padStart(2, '0')}</span><span>${esc(x.texte)}</span></button>`).join('')}
        <button class="add" id="add-etape">${ic('plus')} Ajouter une étape</button>
      </div>
      <div class="card lesson">
        ${e ? `
          <div class="muted small" style="font-family:var(--mono)">Étape ${i + 1} / ${n}</div>
          <h2 style="margin-top:4px">${esc(e.texte)}</h2>
          <div class="prose">${e.detail ? md(e.detail) : '<p class="muted">Pas encore de détail pour cette étape.</p>'}</div>
          <div class="lesson-foot">
            <label class="check"><input type="checkbox" id="fait" ${e.fait ? 'checked' : ''}> Étape terminée</label>
            <div class="row">
              <button class="btn ghost sm" data-a="haut" title="Monter" ${i === 0 ? 'disabled' : ''}>${ic('up')}</button>
              <button class="btn ghost sm" data-a="bas" title="Descendre" ${i === n - 1 ? 'disabled' : ''}>${ic('down')}</button>
              <button class="btn ghost sm" data-a="modif">${ic('pencil')} Modifier</button>
              <button class="btn ghost sm" data-a="suppr" title="Supprimer">${ic('trash')}</button>
            </div>
          </div>
          <div class="row spread" style="margin-top:14px">
            <button class="btn" data-a="prec" ${i === 0 ? 'disabled' : ''}>${ic('left')} Précédente</button>
            <button class="btn primary" data-a="suiv" ${i === n - 1 ? 'disabled' : ''}>Suivante ${ic('right')}</button>
          </div>` : `<div class="empty">Aucune étape pour l'instant.<br><br><button class="btn primary" id="add-etape2">${ic('plus')} Ajouter la première étape</button></div>`}
      </div>
    </div>`;
  $$('.toc [data-j]').forEach(b => b.addEventListener('click', () => { etatUI.etape = +b.dataset.j; vueTP(tp); }));
  $('#add-etape').addEventListener('click', () => formEtape(tp));
  if (!e) return $('#add-etape2').addEventListener('click', () => formEtape(tp));
  $('#fait').addEventListener('change', ev => {
    e.fait = ev.target.checked; sauver();
    if (e.fait && i < n - 1) { etatUI.etape = i + 1; toast('Étape terminée'); }
    vueTP(tp);
  });
  $$('[data-a]', el).forEach(b => b.addEventListener('click', () => {
    const a = b.dataset.a, t = tp.etapes;
    if (a === 'prec') etatUI.etape--;
    if (a === 'suiv') etatUI.etape++;
    if (a === 'haut') { [t[i - 1], t[i]] = [t[i], t[i - 1]]; etatUI.etape--; sauver(); }
    if (a === 'bas') { [t[i + 1], t[i]] = [t[i], t[i + 1]]; etatUI.etape++; sauver(); }
    if (a === 'modif') return formEtape(tp, e);
    if (a === 'suppr') return confirmer('Supprimer cette étape ?', () => { t.splice(i, 1); sauver(); vueTP(tp); });
    vueTP(tp);
  }));
}
function formEtape(tp, e) {
  const edit = !!e;
  ouvrirModal(`
    <h2>${edit ? 'Modifier l\'étape' : 'Nouvelle étape'}</h2>
    <form id="f-et">
      <div class="field"><label for="fe-t">Intitulé</label><input id="fe-t" name="texte" required value="${esc(e ? e.texte : '')}" placeholder="ex. Configurer le VLAN 10"></div>
      <div class="field"><label for="fe-d">Contenu</label><textarea id="fe-d" name="detail" style="min-height:200px;font-family:var(--mono);font-size:.88rem" placeholder="Explications, commandes…&#10;&#10;**gras**, \`code\`, listes avec - &#10;Bloc de commandes entre \`\`\`">${esc(e ? e.detail : '')}</textarea></div>
      <div class="row" style="justify-content:flex-end;margin-top:16px"><button type="button" class="btn" onclick="fermerModal()">Annuler</button><button class="btn primary">${edit ? 'Enregistrer' : 'Ajouter'}</button></div>
    </form>`);
  $('#f-et').addEventListener('submit', ev => {
    ev.preventDefault();
    const d = Object.fromEntries(new FormData(ev.target));
    if (edit) { e.texte = d.texte.trim(); e.detail = d.detail.trim(); }
    else { tp.etapes.push({ id: uid(), texte: d.texte.trim(), detail: d.detail.trim(), fait: false }); etatUI.etape = tp.etapes.length - 1; }
    sauver(); fermerModal(); vueTP(tp);
  });
}


/* ---------- Documents : fichiers stockés dans le navigateur (IndexedDB) ---------- */
const IDB = {
  db: null,
  ouvrir() {
    if (this.db) return Promise.resolve(this.db);
    return new Promise((ok, ko) => {
      let r; try { r = indexedDB.open('cielarte-fichiers', 1); } catch (e) { return ko(e); }
      r.onupgradeneeded = () => r.result.createObjectStore('f');
      r.onsuccess = () => { this.db = r.result; ok(this.db); };
      r.onerror = () => ko(r.error);
    });
  },
  async op(mode, fn) {
    const d = await this.ouvrir();
    return new Promise((ok, ko) => { const t = d.transaction('f', mode); const q = fn(t.objectStore('f')); t.oncomplete = () => ok(q && q.result); t.onerror = () => ko(t.error); });
  },
  put(k, v) { return this.op('readwrite', s => s.put(v, k)); },
  get(k) { return this.op('readonly', s => s.get(k)); },
  del(k) { return this.op('readwrite', s => s.delete(k)); }
};
const tailleTxt = o => o > 1e6 ? (o / 1e6).toFixed(1).replace('.', ',') + ' Mo' : Math.max(1, Math.round(o / 1e3)) + ' Ko';
function genre(doc) {
  const n = doc.nom.toLowerCase() + ' ' + (doc.fichier || doc.src || '').toLowerCase(), t = doc.type || '';
  if (t === 'application/pdf' || /\.pdf\b/.test(n)) return 'pdf';
  if (t.startsWith('image/')) return 'image';
  if (/wordprocessingml|msword/.test(t) || /\.docx\b/.test(n)) return 'docx';
  if (/\.drawio\b/.test(n) || /jgraph/.test(t)) return 'drawio';
  if (t.startsWith('text/') || /\.(txt|md|csv|log|conf|cfg|sh|py|json|xml)\b/.test(n)) return 'texte';
  return 'autre';
}
const ETIQ = { pdf: 'PDF', image: 'Image', docx: 'Word', drawio: 'draw.io', texte: 'Texte', autre: 'Fichier' };
async function blobDe(doc, version) {
  const cle = version ? version.cle : doc.cle;
  if (cle) { const b = await IDB.get(cle); if (b) return b; }
  if (!version && doc.src) { const r = await fetch(doc.src); if (!r.ok) throw new Error('introuvable'); return await r.blob(); }
  throw new Error('introuvable');
}
async function ajouterFichiers(tp, fichiers, remplace) {
  for (const f of fichiers) {
    const cle = 'f-' + uid();
    try { await IDB.put(cle, f); } catch (e) { toast('Ce navigateur refuse d\'enregistrer les fichiers'); return; }
    if (remplace) {
      remplace.versions.unshift({ cle: remplace.cle || null, src: remplace.cle ? null : remplace.src, date: remplace.date, taille: remplace.taille, fichier: remplace.fichier || remplace.nom });
      Object.assign(remplace, { cle, src: null, date: nowISO(), taille: f.size, type: f.type || remplace.type, fichier: f.name });
    } else {
      tp.documents.push({ id: uid(), nom: f.name.replace(/\.[^.]+$/, ''), fichier: f.name, type: f.type, taille: f.size, date: nowISO(), cle, note: '', versions: [] });
    }
  }
  sauver(); vueTP(tp);
  toast(remplace ? 'Nouvelle version enregistrée' : pluriel(fichiers.length, 'document') + ' ajouté' + (fichiers.length > 1 ? 's' : ''));
}
/* Section Documents d'un TP : dépôt de fichiers, liste et versions. */
function secDocuments(tp, el) {
  el.innerHTML = `
    ${teteSection('Documents', `<span class="muted">${pluriel(tp.documents.length, 'document')}</span>`)}
    <label class="drop" id="drop" for="file-in">
      ${ic('upload', 'i big')}
      <strong>Glisse tes fichiers ici</strong>
      <span class="muted small">ou clique pour choisir : PDF, Word, images, draw.io, texte…</span>
      <input type="file" id="file-in" multiple hidden>
    </label>
    <div class="card doc-list">
      ${tp.documents.length ? tp.documents.map(d => {
        const g = genre(d);
        return `<div class="doc" data-id="${d.id}">
          <span class="doc-ico g-${g}">${ETIQ[g]}</span>
          <div class="doc-main"><button class="doc-name" data-act="voir">${esc(d.nom)}</button>
            <div class="muted small">${tailleTxt(d.taille || 0)} · ajouté le ${fmtDate(d.date)}${d.versions.length ? ` · ${pluriel(d.versions.length + 1, 'version')}` : ''}${d.note ? ' · ' + esc(d.note.slice(0, 60)) : ''}</div></div>
          <div class="row">
            <button class="btn sm" data-act="voir">${ic('eye')} Ouvrir</button>
            <button class="btn ghost sm" data-act="version" title="Déposer une nouvelle version">${ic('history')} Nouvelle version</button>
            <button class="btn ghost sm" data-act="suppr" title="Supprimer">${ic('trash')}</button>
          </div>
        </div>`;
      }).join('') : '<div class="empty">Aucun document. Dépose l\'énoncé, les annexes, ton rendu ou le corrigé.</div>'}
    </div>
    <input type="file" id="version-in" hidden>`;
  const drop = $('#drop');
  ['dragenter', 'dragover'].forEach(e => drop.addEventListener(e, ev => { ev.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(e => drop.addEventListener(e, ev => { ev.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', ev => { const f = [...ev.dataTransfer.files]; if (f.length) ajouterFichiers(tp, f); });
  $('#file-in').addEventListener('change', ev => { const f = [...ev.target.files]; if (f.length) ajouterFichiers(tp, f); });
  let cible = null;
  $('#version-in').addEventListener('change', ev => { const f = ev.target.files[0]; if (f && cible) ajouterFichiers(tp, [f], cible); });
  $$('.doc', el).forEach(row => {
    const d = tp.documents.find(x => x.id === row.dataset.id);
    row.addEventListener('dragover', ev => { ev.preventDefault(); row.classList.add('over'); });
    row.addEventListener('dragleave', () => row.classList.remove('over'));
    row.addEventListener('drop', ev => { ev.preventDefault(); row.classList.remove('over'); const f = ev.dataTransfer.files[0]; if (f) ajouterFichiers(tp, [f], d); });
    row.addEventListener('click', ev => {
      const act = ev.target.closest('[data-act]')?.dataset.act;
      if (act === 'voir') visionneuse(tp, d);
      if (act === 'version') { cible = d; $('#version-in').value = ''; $('#version-in').click(); }
      if (act === 'suppr') confirmer(`Supprimer « ${d.nom} » et ses versions ?`, async () => {
        for (const k of [d.cle, ...d.versions.map(v => v.cle)].filter(Boolean)) { try { await IDB.del(k); } catch (e) { /* rien */ } }
        tp.documents = tp.documents.filter(x => x !== d); sauver(); vueTP(tp);
      });
    });
  });
}
function chargerScript(src) {
  chargerScript.cache = chargerScript.cache || {};
  return chargerScript.cache[src] = chargerScript.cache[src] || new Promise((ok, ko) => {
    const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => ko(new Error('script')); document.head.appendChild(s);
  });
}
const LIBS = {
  pdf: ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'],
  docx: ['https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', 'https://cdn.jsdelivr.net/npm/docx-preview@0.3.2/dist/docx-preview.min.js']
};
async function rendre(doc, blob, zone) {
  const g = genre(doc);
  if (g === 'image') { zone.innerHTML = `<img src="${URL.createObjectURL(blob)}" alt="${esc(doc.nom)}" class="viewer-img">`; return; }
  if (g === 'texte') { zone.innerHTML = `<pre class="viewer-txt">${esc(await blob.text())}</pre>`; return; }
  if (g === 'pdf') {
    for (const s of LIBS.pdf) await chargerScript(s);
    pdfjsLib.GlobalWorkerOptions.workerSrc = LIBS.pdf[1];
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(await blob.arrayBuffer()) }).promise;
    zone.innerHTML = `<div class="muted small viewer-info">${pluriel(pdf.numPages, 'page')}</div>`;
    const largeur = Math.min(zone.clientWidth - 24, 900);
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const v1 = page.getViewport({ scale: 1 }), echelle = largeur / v1.width, dpr = Math.min(window.devicePixelRatio || 1, 2);
      const vp = page.getViewport({ scale: echelle * dpr });
      const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height; c.style.width = (vp.width / dpr) + 'px'; c.className = 'pdf-page';
      zone.appendChild(c);
      await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
      if (!document.body.contains(zone)) return;
    }
    return;
  }
  if (g === 'docx') {
    for (const s of LIBS.docx) await chargerScript(s);
    zone.innerHTML = '<div class="docx-wrap"></div>';
    await docx.renderAsync(blob, $('.docx-wrap', zone), null, { inWrapper: true, ignoreLastRenderedPageBreak: true });
    return;
  }
  if (g === 'drawio') {
    const xml = await blob.text();
    const pages = [...xml.matchAll(/<diagram[^>]*name="([^"]*)"/g)].map(m => m[1]);
    zone.innerHTML = `<div class="empty"><p><strong>Schéma draw.io</strong>${pages.length ? ` · ${pluriel(pages.length, 'page')} : ${pages.map(esc).join(', ')}` : ''}</p>
      <p class="muted" style="margin-top:8px">L'aperçu des schémas draw.io arrivera plus tard. Pour le modifier, ouvre-le dans draw.io (application ou <a href="https://app.diagrams.net" target="_blank" rel="noopener">app.diagrams.net</a>), puis dépose la nouvelle version ici.</p></div>`;
    return;
  }
  zone.innerHTML = '<div class="empty">Pas d\'aperçu pour ce type de fichier. Tu peux toujours garder une note et ses versions ici.</div>';
}
/* Ouvre l'aperçu d'un document (PDF, Word, image, draw.io…) dans une fenêtre. */
async function visionneuse(tp, doc, version) {
  ouvrirModal(`
    <div class="viewer">
      <div class="viewer-head">
        <div style="min-width:0"><h2 style="margin:0">${esc(doc.nom)}</h2>
          <div class="muted small">${ETIQ[genre(doc)]} · ${version ? 'version du ' + fmtDateHeure(version.date) : 'version actuelle, ' + fmtDateHeure(doc.date)}</div></div>
        <div class="row">
          ${doc.versions.length ? `<select id="v-sel" style="width:auto"><option value="">Version actuelle</option>${doc.versions.map((v, i) => `<option value="${i}" ${version === v ? 'selected' : ''}>Version du ${fmtDateHeure(v.date)}</option>`).join('')}</select>` : ''}
          <button class="btn" id="v-renom">${ic('pencil')} Renommer</button>
          <button class="btn" id="v-close">Fermer</button>
        </div>
      </div>
      <div class="viewer-body" id="v-zone"><div class="empty">Chargement…</div></div>
      <div class="viewer-foot">
        <label for="v-note">Ma note sur ce document</label>
        <textarea id="v-note" style="min-height:60px" placeholder="Ce qu'il faut retenir, ce que j'ai corrigé…">${esc(doc.note)}</textarea>
        <div class="row spread" style="margin-top:8px">
          <span class="muted small">Pour modifier le fichier : ouvre-le dans LibreOffice ou draw.io, puis dépose la nouvelle version.</span>
          <button class="btn primary" id="v-save">Enregistrer la note</button>
        </div>
      </div>
    </div>`);
  $('#modal-box').classList.add('wide');
  $('#v-close').addEventListener('click', () => { fermerModal(); vueTP(tp); });
  $('#v-save').addEventListener('click', () => { doc.note = $('#v-note').value.trim(); sauver(); toast('Note enregistrée'); });
  $('#v-renom').addEventListener('click', () => {
    const h = $('.viewer-head h2');
    h.innerHTML = `<input id="v-nom" value="${esc(doc.nom)}" style="font:inherit">`;
    const i = $('#v-nom'); i.focus(); i.select();
    const ok = () => { const v = i.value.trim(); if (v) { doc.nom = v; sauver(); } h.textContent = doc.nom; };
    i.addEventListener('keydown', e => { if (e.key === 'Enter') ok(); });
    i.addEventListener('blur', ok);
  });
  const sel = $('#v-sel');
  if (sel) sel.addEventListener('change', () => visionneuse(tp, doc, sel.value === '' ? null : doc.versions[+sel.value]));
  const zone = $('#v-zone');
  try {
    const v = version && !version.cle && version.src ? null : version;
    const blob = version && !version.cle && version.src ? await (await fetch(version.src)).blob() : await blobDe(doc, v);
    await rendre(doc, blob, zone);
  } catch (e) {
    zone.innerHTML = `<div class="empty">Impossible d'afficher ce fichier ici.${doc.src && location.protocol === 'file:' ? '<br>Ouvre le site avec un petit serveur local (voir le README) pour voir les documents fournis.' : ''}</div>`;
  }
}

/* Questionnaires */
function secQuiz(tp, el) {
  el.innerHTML = `
    ${teteSection('Questionnaires', `<button class="btn primary" id="nv-quiz">${ic('plus')} Nouveau questionnaire</button>`)}
    <div class="card">
      ${tp.quiz.length ? tp.quiz.map((q, k) => {
        const r = q.resultats[q.resultats.length - 1];
        return `<div class="quiz-item" data-id="${q.id}">
          <div class="row" style="flex-wrap:nowrap;min-width:0"><span class="quiz-ico">Q${k + 1}</span>
            <div style="min-width:0"><h3>${esc(q.titre)}</h3><div class="muted small">${pluriel(q.questions.length, 'question')}${r ? ` · dernier score ${r.score}/${r.total}, le ${fmtDateHeure(r.date)}` : ' · jamais fait'}</div></div></div>
          <div class="row">
            <button class="btn primary sm" data-act="jouer" ${q.questions.length ? '' : 'disabled'}>Faire le quiz</button>
            <button class="btn sm" data-act="modif">Modifier</button>
            <button class="btn ghost sm" data-act="suppr" title="Supprimer">${ic('trash')}</button>
          </div>
        </div>`;
      }).join('') : '<div class="empty">Aucun questionnaire pour ce TP. Crée-en un pour réviser.</div>'}
    </div>`;
  $('#nv-quiz').addEventListener('click', () => editeurQuiz(tp));
  $$('.quiz-item', el).forEach(card => {
    const q = tp.quiz.find(x => x.id === card.dataset.id);
    card.addEventListener('click', ev => {
      const act = ev.target.closest('[data-act]')?.dataset.act;
      if (act === 'jouer') jouerQuiz(tp, q);
      if (act === 'modif') editeurQuiz(tp, q);
      if (act === 'suppr') confirmer('Supprimer ce questionnaire ?', () => { tp.quiz = tp.quiz.filter(x => x !== q); sauver(); vueTP(tp); });
    });
  });
}
function editeurQuiz(tp, quiz) {
  const edit = !!quiz;
  const w = quiz ? JSON.parse(JSON.stringify(quiz)) : { id: uid(), titre: '', questions: [], resultats: [] };
  if (!w.questions.length) w.questions.push({ id: uid(), q: '', options: ['', ''], bonne: 0 });
  const dessiner = () => {
    ouvrirModal(`
      <h2>${edit ? 'Modifier le questionnaire' : 'Nouveau questionnaire'}</h2>
      <div class="field"><label for="qz-titre">Titre</label><input id="qz-titre" value="${esc(w.titre)}" placeholder="ex. Révision VLAN"></div>
      <div>${w.questions.map((qu, i) => `
        <div class="q-edit" data-i="${i}">
          <div class="row spread"><strong>Question ${i + 1}</strong><button class="btn ghost sm" data-act="suppr-q">Retirer</button></div>
          <input data-f="q" value="${esc(qu.q)}" placeholder="Intitulé de la question" style="margin-top:6px">
          <div class="muted small" style="margin-top:8px">Réponses (coche la bonne) :</div>
          ${qu.options.map((o, j) => `
            <div class="opt-row">
              <input type="radio" name="bonne-${i}" ${qu.bonne === j ? 'checked' : ''} title="Bonne réponse">
              <input data-o="${j}" value="${esc(o)}" placeholder="Réponse ${j + 1}">
              <button class="btn ghost sm" data-act="suppr-o" data-j="${j}" ${qu.options.length <= 2 ? 'disabled' : ''}>✕</button>
            </div>`).join('')}
          <button class="btn ghost sm" data-act="ajout-o" style="margin-top:6px">${ic('plus')} Réponse</button>
        </div>`).join('')}
      </div>
      <button class="btn" id="qz-ajout" style="margin-top:12px">${ic('plus')} Ajouter une question</button>
      <div class="row" style="justify-content:flex-end;margin-top:18px"><button class="btn" onclick="fermerModal()">Annuler</button><button class="btn primary" id="qz-save">Enregistrer</button></div>`);
    const lire = () => {
      w.titre = $('#qz-titre').value;
      $$('.q-edit').forEach(div => {
        const qu = w.questions[+div.dataset.i];
        qu.q = $('[data-f=q]', div).value;
        qu.options = $$('[data-o]', div).map(inp => inp.value);
        const r = $$('input[type=radio]', div).findIndex(x => x.checked); qu.bonne = r < 0 ? 0 : r;
      });
    };
    $('#qz-ajout').addEventListener('click', () => { lire(); w.questions.push({ id: uid(), q: '', options: ['', ''], bonne: 0 }); dessiner(); });
    $$('.q-edit').forEach(div => div.addEventListener('click', ev => {
      const b = ev.target.closest('[data-act]'); if (!b) return;
      lire();
      const qu = w.questions[+div.dataset.i], act = b.dataset.act;
      if (act === 'ajout-o') qu.options.push('');
      if (act === 'suppr-o') { const j = +b.dataset.j; qu.options.splice(j, 1); if (qu.bonne >= qu.options.length || qu.bonne === j) qu.bonne = 0; }
      if (act === 'suppr-q') w.questions.splice(+div.dataset.i, 1);
      dessiner();
    }));
    $('#qz-save').addEventListener('click', () => {
      lire();
      w.titre = w.titre.trim() || 'Questionnaire sans titre';
      w.questions = w.questions.map(qu => {
        const opts = qu.options.map((o, j) => ({ o: o.trim(), ok: j === qu.bonne })).filter(x => x.o);
        return { ...qu, q: qu.q.trim(), options: opts.map(x => x.o), bonne: Math.max(0, opts.findIndex(x => x.ok)) };
      }).filter(qu => qu.q && qu.options.length >= 2);
      if (!w.questions.length) return toast('Ajoute au moins une question avec deux réponses');
      if (edit) Object.assign(quiz, w); else tp.quiz.push(w);
      sauver(); fermerModal(); vueTP(tp); toast('Questionnaire enregistré');
    });
  };
  dessiner();
}
function jouerQuiz(tp, quiz) {
  ouvrirModal(`
    <h2>${esc(quiz.titre)}</h2>
    <form id="qz-play">
      ${quiz.questions.map((qu, i) => `
        <div class="question" data-i="${i}">
          <strong>${i + 1}. ${esc(qu.q)}</strong>
          ${qu.options.map((o, j) => `<label class="option"><input type="radio" name="r${i}" value="${j}"> ${esc(o)}</label>`).join('')}
        </div>`).join('')}
      <div id="qz-res" class="row spread" style="margin-top:16px"><span></span>
        <span class="row"><button type="button" class="btn" onclick="fermerModal()">Fermer</button><button class="btn primary">Valider mes réponses</button></span></div>
    </form>`);
  $('#qz-play').addEventListener('submit', ev => {
    ev.preventDefault();
    let score = 0;
    quiz.questions.forEach((qu, i) => {
      const choix = $(`input[name=r${i}]:checked`), labels = $$(`.question[data-i="${i}"] .option`);
      labels[qu.bonne].classList.add('correct');
      if (choix && +choix.value === qu.bonne) score++; else if (choix) labels[+choix.value].classList.add('wrong');
      $$(`input[name=r${i}]`).forEach(x => x.disabled = true);
    });
    quiz.resultats.push({ score, total: quiz.questions.length, date: nowISO() }); sauver();
    $('#qz-res').innerHTML = `<span class="score">${score} / ${quiz.questions.length}</span>
      <span class="row"><button type="button" class="btn" id="qz-retry">Recommencer</button><button type="button" class="btn primary" id="qz-close">Terminer</button></span>`;
    $('#qz-retry').addEventListener('click', () => jouerQuiz(tp, quiz));
    $('#qz-close').addEventListener('click', () => { fermerModal(); vueTP(tp); });
  });
}

/* Commentaires */
function secCommentaires(tp, el) {
  const liste = [...tp.commentaires].sort((a, b) => b.date.localeCompare(a.date));
  const ini = (db.prenom || '?').charAt(0).toUpperCase();
  el.innerHTML = `
    ${teteSection('Commentaires')}
    <div class="card stack">
      <form id="form-com" class="stack" style="gap:10px">
        <textarea name="texte" id="com-texte" placeholder="Une remarque, un problème rencontré, une astuce…" required style="min-height:70px"></textarea>
        <div class="row" style="justify-content:flex-end"><button class="btn primary">Publier</button></div>
      </form>
      ${liste.length ? liste.map(c => `
        <div class="comment" data-id="${c.id}"><span class="avatar">${esc(ini)}</span>
          <div class="body"><div class="row spread"><span class="muted small">${fmtDateHeure(c.date)}</span><button class="btn ghost sm" data-act="suppr">Supprimer</button></div><p>${esc(c.texte)}</p></div>
        </div>`).join('') : '<div class="empty">Aucun commentaire pour l\'instant.</div>'}
    </div>`;
  $('#form-com').addEventListener('submit', ev => {
    ev.preventDefault();
    const t = new FormData(ev.target).get('texte').trim(); if (!t) return;
    tp.commentaires.push({ id: uid(), texte: t, date: nowISO() }); sauver(); vueTP(tp);
  });
  $$('.comment').forEach(div => div.addEventListener('click', ev => {
    if (ev.target.dataset.act !== 'suppr') return;
    confirmer('Supprimer ce commentaire ?', () => { tp.commentaires = tp.commentaires.filter(c => c.id !== div.dataset.id); sauver(); vueTP(tp); });
  }));
}

/* Notes */
function secNotes(tp, el) {
  el.innerHTML = `
    ${teteSection('Notes', '<span class="muted small" id="etat-notes">Enregistrement automatique</span>')}
    <div class="card"><textarea id="notes" style="min-height:340px;font-family:var(--mono);font-size:.88rem;border:none;padding:0;outline:none" placeholder="Commandes, fichiers de config, liens, bilan perso…">${esc(tp.notes)}</textarea></div>`;
  let t;
  $('#notes').addEventListener('input', ev => {
    $('#etat-notes').textContent = 'Modification…'; clearTimeout(t);
    t = setTimeout(() => { tp.notes = ev.target.value; sauver(); $('#etat-notes').textContent = 'Enregistré'; }, 500);
  });
}

/* Bilan */
function secBilan(tp, el) {
  const p = avancement(tp);
  const scores = tp.quiz.map(q => q.resultats[q.resultats.length - 1]).filter(Boolean);
  const moy = scores.length ? Math.round(100 * scores.reduce((a, r) => a + r.score / r.total, 0) / scores.length) : null;
  el.innerHTML = `
    ${teteSection('Bilan du TP', tp.statut === 'done' ? '<span class="status done"><span class="dot"></span>TP terminé</span>' : `<button class="btn primary" id="terminer">${ic('check')} Marquer comme terminé</button>`)}
    <div class="bilan">
      <div class="card"><div class="muted small">Étapes</div><div class="score">${p} %</div><div class="progress" style="margin-top:8px"><div style="width:${p}%"></div></div></div>
      <div class="card"><div class="muted small">Moyenne aux quiz</div><div class="score">${moy === null ? '–' : moy + ' %'}</div><div class="muted small">${pluriel(scores.length, 'quiz fait')}</div></div>
      <div class="card"><div class="muted small">Compétences</div><div class="score">${tp.competences.length}</div><div class="muted small">travaillées dans ce TP</div></div>
      <div class="card"><div class="muted small">Commentaires</div><div class="score">${tp.commentaires.length}</div><div class="muted small">${tp.duree ? `durée prévue ${tp.duree} min` : '&nbsp;'}</div></div>
    </div>
    <div class="card" style="margin-top:16px">
      <h2>Je m'auto-évalue</h2>
      ${tp.autoeval.length ? `<div style="overflow-x:auto"><table class="ae">
        <thead><tr><th>Je suis capable de…</th>${AE.slice(1).map((n, k) => `<th class="lvl l${k + 1}">${n}</th>`).join('')}</tr></thead>
        <tbody>${tp.autoeval.map((a, i) => `<tr><td>${esc(a.critere)}</td>${AE.slice(1).map((n, k) => `<td class="lvl"><button class="ae-b l${k + 1} ${a.niveau === k + 1 ? 'on' : ''}" data-i="${i}" data-n="${k + 1}" aria-label="${esc(n)}" title="${esc(n)}"></button></td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>` : '<p class="muted">Aucun critère. Clique sur « Modifier » en haut pour ajouter tes critères « Je suis capable de… ».</p>'}
      <h3 class="alt">Ce que je retiens</h3>
      <textarea id="retenu" placeholder="Ce que j'ai appris, ce que je referais autrement…">${esc(tp.retenu)}</textarea>
      <div class="muted small" id="etat-retenu" style="margin-top:6px">Enregistrement automatique</div>
    </div>`;
  $$('.ae-b', el).forEach(bt => bt.addEventListener('click', () => {
    const a = tp.autoeval[+bt.dataset.i], n = +bt.dataset.n;
    a.niveau = a.niveau === n ? 0 : n; sauver(); vueTP(tp);
  }));
  let tr;
  $('#retenu').addEventListener('input', ev => {
    $('#etat-retenu').textContent = 'Modification…'; clearTimeout(tr);
    tr = setTimeout(() => { tp.retenu = ev.target.value; sauver(); $('#etat-retenu').textContent = 'Enregistré'; }, 500);
  });
  const b = $('#terminer');
  if (b) b.addEventListener('click', () => { tp.statut = 'done'; sauver(); vueTP(tp); toast('Bravo, TP terminé'); });
}

/* ---------- Compétences ---------- */
/* Page Compétences : chaque compétence avec les TP où elle a été travaillée. */
function vueCompetences() {
  const map = {};
  db.tps.forEach(t => t.competences.forEach(c => (map[c] = map[c] || []).push(t)));
  const noms = Object.keys(map).sort((a, b) => map[b].length - map[a].length || a.localeCompare(b));
  $('#app').innerHTML = `
    <section class="panel">
      <div class="panel-head"><div><h1>Compétences</h1><p>Toutes les compétences travaillées, et les TP où tu les as pratiquées.</p></div><span class="pill"><span class="dot"></span>${pluriel(noms.length, 'compétence')}</span></div>
      <div class="comp-list" style="margin-top:22px">
        ${noms.length ? noms.map(c => `
          <div class="card stack">
            <div class="row spread" style="flex-wrap:nowrap;align-items:flex-start"><h3 style="color:var(--accent-ink)">${esc(c)}</h3><span class="pill">${pluriel(map[c].length, 'TP')}</span></div>
            <div class="stack small" style="gap:8px">${map[c].map(t => `<div class="row spread" style="flex-wrap:nowrap"><a href="#tp-${t.id}" style="min-width:0">${esc(t.titre)}</a><span class="status ${t.statut}"><span class="dot"></span></span></div>`).join('')}</div>
          </div>`).join('') : '<div class="card empty">Ajoute des compétences à tes TP pour les voir ici.</div>'}
      </div>
    </section>`;
}

/* ---------- Données ---------- */
/* Page Données : sauvegarde, import et remise à zéro. */
function vueDonnees() {
  $('#app').innerHTML = `
    <section class="panel">
      <div class="panel-head"><div><h1>Données</h1><p>Tes TP sont enregistrés dans ce navigateur, sur cet ordinateur. Exporte-les pour les sauvegarder ou les ouvrir sur un autre PC.</p></div></div>
      <div class="grid2" style="margin-top:22px">
        <div class="card stack">
          <h2>Profil</h2>
          <div><label for="prenom">Ton prénom</label><input id="prenom" value="${esc(db.prenom)}"></div>
          <div><button class="btn" id="save-prenom">Enregistrer</button></div>
        </div>
        <div class="card stack">
          <h2>Exporter</h2>
          <p class="muted">Récupère tous tes TP dans un fichier <code>.json</code>, ou copie-les pour les coller ailleurs. Les fichiers déposés dans « Documents » ne sont pas encore inclus.</p>
          <div class="row"><button class="btn primary" id="exp">Télécharger la sauvegarde</button><button class="btn" id="copier">Copier les données</button></div>
        </div>
        <div class="card stack">
          <h2>Importer</h2>
          <p class="muted">Une sauvegarde <strong>remplace</strong> les données actuelles de ce navigateur.</p>
          <input type="file" id="imp" accept=".json,application/json">
          <textarea id="coller" placeholder="…ou colle ici le contenu d'une sauvegarde" style="min-height:70px"></textarea>
          <div><button class="btn" id="imp-coller">Importer le texte collé</button></div>
        </div>
        <div class="card stack">
          <h2>Réinitialiser</h2>
          <p class="muted">Efface tout et remet les TP d'exemple.</p>
          <div><button class="btn danger" id="reset">Réinitialiser</button></div>
        </div>
      </div>
    </section>`;
  $('#save-prenom').addEventListener('click', () => { db.prenom = $('#prenom').value.trim(); sauver(); bandeau('donnees'); toast('Prénom enregistré'); });
  $('#exp').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' }));
    a.download = `cielarte-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(a.href);
  });
  $('#copier').addEventListener('click', () => {
    navigator.clipboard.writeText(JSON.stringify(db, null, 2)).then(() => toast('Données copiées'), () => toast('Copie refusée par le navigateur'));
  });
  const importer = texte => {
    try {
      const data = JSON.parse(texte); if (!Array.isArray(data.tps)) throw new Error();
      confirmer(`Importer ${pluriel(data.tps.length, 'TP')} ? Les données actuelles seront remplacées.`, () => { db = ajouterSeeds(normaliser(data)); sauver(); toast('Import réussi'); location.hash = 'tps'; });
    } catch { toast('Ce contenu n\'est pas une sauvegarde valide'); }
  };
  $('#imp-coller').addEventListener('click', () => importer($('#coller').value));
  $('#imp').addEventListener('change', async ev => { const f = ev.target.files[0]; if (f) importer(await f.text()); });
  $('#reset').addEventListener('click', () => confirmer('Tout effacer et remettre les TP d\'exemple ?', () => { db = ajouterSeeds(normaliser(exemple())); sauver(); toast('Données réinitialisées'); location.hash = 'accueil'; }));
}

route();
