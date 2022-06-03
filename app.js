// Liste de comptes sous forme d'objets dans un tableau
let comptes = [
    {
        numero: 1,
        nom: "Christopher",
        solde: 2500,
    },
    {
        numero: 2,
        nom: "Redouane",
        solde: 5000,
    },
    {
        numero: 3,
        nom: "Jean-Charles",
        solde: 10000,
    },
];

// Appel de la fonction pour récupérer le numéro de compte dans l'URL
let numeroCompte = getNumberAccount();

// Fonction pour récupérer le numéro de compte dans l'URL
function getNumberAccount() {
    // Récupération du numéro de compte dans l'URL [CODE INEXPLICABLE A GARDER]
    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    // const numeroCompte = urlParams.get("account");
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const numeroCompte = urlParams.get("account");
    //
    return numeroCompte;
}

// Définition du compte en appelant la fonction pour récupérer les informations du compte en précisant le numéro de compte à chercher
let compte = getAccount(numeroCompte);

// Fonction pour récupérer le compte
function getAccount(accountNumber) {
    // Boucle for of pour parcourir le tableau des comptes
    for (const compte of comptes) {
        // Si un compte correspond à notre numéro de compte rentré dans l'input
        if (compte["numero"] == accountNumber) {
            // On retourne le compte entier
            return compte;
        }
    }
}

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
    // Appel de la fonction pour effectuer le dépot
    effectuerDepot();
});

// Effectuer le depot (ajout du async devant le function pour pouvoir utiliser le await lors de la récupération de la valeur convertie grâce à l'API)
async function effectuerDepot(event) {
    // Récupération de l'input du formulaire
    let inputValueDepot = document.querySelector("#inputDepot");
    // Transformation de la valeur de l'input en nombre grâce à parseInt()
    let valueDepot = parseInt(inputValueDepot.value);
    // Récupération de l'endroit où placer le message d'erreur/validation
    let alertDepot = document.querySelector(".alert-depot");

    // Si la valeur est valide
    if (checkValidInput(inputValueDepot.value, alertDepot)) {
        // Récupérer la devise selectionnée dans le select du formulaire
        let selectedDevise = document.querySelector("#selectDeviseDepot").value;
        // Si la devise selectionnée n'est pas l'Euro
        if (selectedDevise != "EUR") {
            // On redéfinit notre valeur de dépot par la version convertie en euros grâce à notre fonction convertValue(valueDepot, selectedDevise)
            valueDepot = await convertValue(valueDepot, selectedDevise);
        }
        // Actualisation du solde du compte en ajoutant le dépot au solde existant
        compte["solde"] += valueDepot;
        // Message de validation
        alertDepot.textContent = "Depot effectué !";
        // Ajout de la classe positive pour mettre le texte en vert
        alertDepot.classList.remove("negative");
        alertDepot.classList.add("positive");
        // Actualisation du nom et du solde sur la page HTML
        actualiserCompte();
        // On remet la value de l'input vide pour réinitialiser le champ
        inputValueDepot.value = "";
        // Appeler la fonction pour insérer le depot dans l'historique en passant l'information que c'est un depot et la valeur du dépot
        insererHistorique("depot", valueDepot);
    }
}

// Ecouteur d'evenement sur le bouton du formulaire de dépôt
btnRetrait = document.querySelector("#btn-retrait");
btnRetrait.addEventListener("click", (event) => {
    // Empêcher la validation du formulaire d'actualiser la page
    event.preventDefault();
    // Appel de la fonction pour effectuer le retrait
    effectuerRetrait();
});

// Effectuer le retrait (ajout du async devant le function pour pouvoir utiliser le await lors de la récupération de la valeur convertie grâce à l'API)
async function effectuerRetrait() {
    // Récupération de la valeur de l'input du formulaire
    let inputValueRetrait = document.querySelector("#inputRetrait");
    // Transformation de la valeur de l'input en nombre grâce à parseInt()
    let valueRetrait = parseInt(inputValueRetrait.value);
    // Récupération de l'endroit où placer le message d'erreur/validation
    let alertRetrait = document.querySelector(".alert-retrait");

    // Si la valeur est invalide
    if (checkValidInput(inputValueRetrait.value, alertRetrait)) {
        // Si la valeur du retrait est plus grande que le solde actuel
        if (valueRetrait > compte["solde"]) {
            // Message d'erreur négatif
            alertRetrait.textContent = "Vous n'avez pas assez d'argent";
            // Ajout de la classe negative pour mettre le texte en rouge
            alertRetrait.classList.remove("positive");
            alertRetrait.classList.add("negative");
        }
        // Sinon on effectue le retrait
        else {
            // Récupérer la devise selectionnée dans le select du formulaire
            let selectedDevise =
                document.querySelector("#selectDeviseDepot").value;
            // Si la devise selectionnée n'est pas l'Euro
            if (selectedDevise.value != "EUR") {
                // On redéfinit notre valeur de dépot par la version convertie en euros grâce à notre fonction convertValue(valueDepot, selectedDevise)
                valueDepot = await convertValue(valueDepot, selectedDevise);
            }
            // Actualisation du solde du compte en retirant le retrait au solde existant
            compte["solde"] -= valueRetrait;
            // Message de validation
            alertRetrait.textContent = "Retrait effectué !";
            // Ajout de la classe positive pour mettre le texte en vert
            alertRetrait.classList.remove("negative");
            alertRetrait.classList.add("positive");
            // Actualisation du nom et du solde sur la page HTML
            actualiserCompte();
            // On remet la value de l'input vide pour réinitialiser le champ
            inputValueRetrait.value = "";
            // Appeler la fonction pour insérer le depot dans l'historique en passant l'information que c'est un retrait et la valeur du dépot
            insererHistorique("retrait", valueRetrait);
        }
    }
}

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

function checkValidInput(value, input) {
    if (value < 1 || value == "") {
        // Message d'erreur négatif
        input.textContent = "Montant saisi invalide";
        // Ajout de la classe negative pour mettre le texte en rouge
        input.classList.remove("positive");
        input.classList.add("negative");
        return false;
    } else {
        return true;
    }
}

// Fonction pour convertir notre valeur dans la devise selectionnée
async function convertValue(value, devise) {
    // HEADERS ET OPTIONS DU FETCH !!! Trop compliqué pour l'instant
    let myHeaders = new Headers();
    myHeaders.append("apikey", "3SnXmzWncJP1IbCMOQBKdbMI4jWx78yg");

    let requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: myHeaders,
    };
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // Définition de la valeur convertie à retourner valueConverted
    let valueConverted;

    // Création de la requête API (le AWAIT est nécessaire pour attendre que la requête soit finie avant de passer à la suite des instruction)
    await fetch(
        // URL de a requête en string en intégrant les parametres
        `https://api.apilayer.com/exchangerates_data/convert?from=${devise}&to=EUR&amount=${value}`,
        // Ajout des options !!! Trop compliqué pour l'instant
        requestOptions
    )
        // Ensuite on récupére la réponse et on la transforme en JS
        .then(function (response) {
            return response.json();
        })
        // On récupère les data
        .then(function (data) {
            // On update notre variable valueConverted par le résultat que nous a retourné l'API
            valueConverted = data.result;
        })
        // On récupère les erreurs au cas où
        .catch(function (error) {
            console.log("error", error);
        });

    // On redéfinit encore notre variable cette fois par la version arrondie de notre valeur
    valueConverted = Math.round(valueConverted);
    // Retourner la valeur valueConverted
    return valueConverted;
}
