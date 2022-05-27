// Liste de compte sous forme d'objets dans un array
compte = {
    numero: 1,
    nom: "Christopher",
    solde: 2500,
};

// Actualisation du nom et du solde sur la page HTML dès le chargement de la page
actualiserCompte();

// Actualisation du nom et du solde sur la page HTML
function actualiserCompte() {
    // Récupération de l'endroit où mettre le nom
    let nomCompte = document.querySelector("#account-name");
    // Injection du texte via textContent
    nomCompte.textContent = compte["nom"];

    // Récupération de l'endroit où mettre le nom
    let soldeCompte = document.querySelector(".solde-amount");
    // Injection du texte via textContent
    soldeCompte.textContent = `${compte["solde"]} €`;
}

// Ecouteur d'evenement sur le bouton du formulaire de dépôt
btnDepot = document.querySelector("#btn-depot");
btnDepot.addEventListener("click", (event) => {
    // Empêcher la validation du formulaire d'actualiser la page
    event.preventDefault();
    // Récupération de l'input du formulaire
    inputValueDepot = document.querySelector("#inputDepot");
    // Transformation de la valeur de l'input en nombre grâce à parseInt()
    valueDepot = parseInt(inputValueDepot.value);
    // Actualisation du solde du compte en ajoutant le dépot au solde existant
    compte["solde"] = compte["solde"] + valueDepot;
    // Actualisation du nom et du solde sur la page HTML
    actualiserCompte();
    // On remet la value de l'input vide pour réinitialiser le champ
    inputValueDepot.value = "";
    // Appeler la fonction pour insérer le depot dans l'historique en passant l'information que c'est un depot
    insererHistorique("depot", valueDepot);
});

// Ecouteur d'evenement sur le bouton du formulaire de dépôt
btnRetrait = document.querySelector("#btn-retrait");
btnRetrait.addEventListener("click", (event) => {
    // Empêcher la validation du formulaire d'actualiser la page
    event.preventDefault();
    // Récupération de la valeur de l'input du formulaire
    inputValueRetrait = document.querySelector("#inputRetrait");
    // Transformation de la valeur de l'input en nombre grâce à parseInt()
    valueRetrait = parseInt(inputValueRetrait.value);
    // Récupération de l'endroit où placer le message d'erreur/validation
    let alertRetrait = document.querySelector(".alert-retrait");
    // Si la valeur du retrait est plus grande que le solde actuel
    if (valueRetrait > compte["solde"]) {
        // Message d'erreur négatif
        alertRetrait.textContent = "Vous n'avez pas assez d'argent";
        // Ajout de la classe negative pour mettre le texte en rouge
        alertRetrait.classList.add("negative");
    }
    // Sinon on effectue le retrait
    else {
        // Actualisation du solde du compte en retirant le retrait au solde existant
        compte["solde"] = compte["solde"] - valueRetrait;
        // Message de validation
        alertRetrait.textContent = "Retrait effectué !";
        // Ajout de la classe positive pour mettre le texte en vert
        alertRetrait.classList.add("positive");
        // Actualisation du nom et du solde sur la page HTML
        actualiserCompte();
        // On remet la value de l'input vide pour réinitialiser le champ
        inputValueRetrait.value = "";
        // Appeler la fonction pour insérer le retrait dans l'historique en passant l'information que c'est un retrait
        insererHistorique("retrait", valueRetrait);
    }
});

// Insertion de l'opération dans l'historique en fonction du type d'opération reçue
function insererHistorique(type, value) {
    // Définition de la variable template vide pour la récupérer hors des conditions
    let template;
    // Si le type d'opération est un depot
    if (type === "depot") {
        // Récupération du template dans le HTML via un query selector
        template = document.querySelector("#depot");
    }
    // Si le type d'opération est un retrait
    else if (type === "retrait") {
        // Récupération du template dans le HTML via un query selector
        template = document.querySelector("#retrait");
    }
    // Importation du clone dans le DOM avec le contenu du template sans qu'il n'apparaisse nulle part pour le moment
    let clone = document.importNode(template.content, true);
    // Modification du clone avec les informations qu'on veut lui donner
    clone.querySelector(".date").textContent = new Date().toDateString();
    clone.querySelector(".value").textContent = value + " €";

    // Récupération de la div parente où importer le clone
    let historiqueListe = document.querySelector(".historique-list");
    // Importation du clone enfant dans la div parente
    historiqueListe.appendChild(clone);
}
