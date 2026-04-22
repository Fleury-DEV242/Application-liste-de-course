// ============================================
// 1. DONNÉES — source de vérité
// ============================================

let articles = [];  // Le tableau qui contient tous les articles

// Structure d'un article :
// {
//   id: 1748291234567,   ← timestamp unique
//   nom: "Tomates",
//   achete: false
// }


// ============================================
// 2. SÉLECTION DES ÉLÉMENTS HTML
// ============================================

const form        = document.getElementById('form-ajout');
const inputNom    = document.getElementById('input-article');
const liste       = document.getElementById('liste-articles');
const compteur    = document.getElementById('compteur');
const btnEffacer  = document.getElementById('btn-effacer-tout');
const boutonsFiltres = document.querySelectorAll('.filtre');

let filtreActif = 'tous'; // valeur par défaut


// ============================================
// 3. FONCTIONS MÉTIER
// ============================================

// --- Ajouter un article ---
function addItem(nom, categorie) {
  const nouvelArticle = {
    id: Date.now(),
    nom: nom,
    categorie: categorie,  // ← on ajoute le champ
    achete: false
  };
  articles.push(nouvelArticle);
  renderList();
}

// --- Basculer l'état d'un article (coché / non coché) ---
function toggleItem(id) {
  const article = articles.find(a => a.id === id);

  if (article) {
    article.achete = !article.achete; // on inverse true/false
    renderList();
  }
}

// --- Supprimer un article ---
function deleteItem(id) {
  articles = articles.filter(a => a.id !== id); // on garde tous SAUF celui-ci
  renderList();
}

// --- Vider toute la liste ---
function clearAll() {
  if (articles.length === 0) return;

  const confirme = confirm('Vider toute la liste ?');
  if (confirme) {
    articles = [];
    renderList();
  }
}


// ============================================
// 4. RENDU — reconstruire l'affichage
// ============================================

function renderList() {

  // 1. Filtrer selon l'onglet actif
  let articlesFiltres = articles;

  if (filtreActif === 'a-acheter') {
    articlesFiltres = articles.filter(a => !a.achete);
  } else if (filtreActif === 'achetes') {
    articlesFiltres = articles.filter(a => a.achete);
  }

  // 2. Vider le <ul> existant
  liste.innerHTML = '';

  // 3. Message si liste vide
  if (articlesFiltres.length === 0) {
    liste.innerHTML = '<li style="text-align:center; color:#aaa; padding:20px 0;">Aucun article</li>';
    mettreAJourCompteur();
    return;
  }

  // 4. Créer un <li> pour chaque article
  articlesFiltres.forEach(article => {
    const li = document.createElement('li');
    li.className = 'article-item';

   li.innerHTML = `
  <input type="checkbox" ${article.achete ? 'checked' : ''} data-id="${article.id}">
  <span class="article-nom ${article.achete ? 'barre' : ''}">${article.nom}</span>
  <span class="badge-categorie">${article.categorie}</span>
  <button class="btn-supprimer" data-id="${article.id}">✕</button>
`;

    liste.appendChild(li);
  });

  // 5. Mettre à jour le compteur
  mettreAJourCompteur();
}

// --- Mettre à jour le texte du compteur ---
function mettreAJourCompteur() {
  const restants = articles.filter(a => !a.achete).length;

  if (restants === 0) {
    compteur.textContent = 'Tout est acheté !';
  } else if (restants === 1) {
    compteur.textContent = '1 article restant';
  } else {
    compteur.textContent = `${restants} articles restants`;
  }
}


// ============================================
// 5. ÉCOUTEURS D'ÉVÉNEMENTS
// ============================================

// Soumettre le formulaire → ajouter un article
const selectCategorie = document.getElementById('select-categorie'); // ← ajouter en haut avec les autres sélections

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const nom = inputNom.value.trim();
  if (nom === '') return;
  addItem(nom, selectCategorie.value);  // ← on passe aussi la catégorie
  inputNom.value = '';
  inputNom.focus();
});

// Clic dans la liste → détecter checkbox ou bouton supprimer
liste.addEventListener('click', function(e) {

  // Récupérer l'id depuis data-id et le convertir en nombre
  const id = Number(e.target.dataset.id);

  if (e.target.type === 'checkbox') {
    toggleItem(id);
  }

  if (e.target.classList.contains('btn-supprimer')) {
    deleteItem(id);
  }
});

// Clic sur un filtre → changer filtreActif
boutonsFiltres.forEach(bouton => {
  bouton.addEventListener('click', function() {

    // Retirer la classe "actif" de tous les boutons
    boutonsFiltres.forEach(b => b.classList.remove('actif'));

    // Ajouter "actif" au bouton cliqué
    this.classList.add('actif');

    // Mettre à jour le filtre et réafficher
    filtreActif = this.dataset.filtre;
    renderList();
  });
});

// Bouton "Tout effacer"
btnEffacer.addEventListener('click', clearAll);


// ============================================
// 6. INITIALISATION
// ============================================

renderList(); // premier affichage au chargement de la page