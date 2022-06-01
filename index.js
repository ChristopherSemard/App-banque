// Liste de compte sous forme d'objets dans un array
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

// Ecouteur d'evenement sur le bouton du formulaire de dépôt
btnAccount = document.querySelector("#btn-account");
btnAccount.addEventListener("click", (event) => {
    // Empêcher la validation du formulaire d'actualiser la page
    event.preventDefault();
    // Appel de la fonction pour la connexion
    connection();
});

function connection() {
    // Récupération de l'input du formulaire
    inputValueAccount = document.querySelector("#inputAccount").value;
    // Appel de la fonction pour determiner true/false si le compte existe
    accountExists = checkAccountExists(inputValueAccount);
    // Si le compte n'existe pas
    if (!accountExists) {
        // Selection de l'endroit où mettre le message d'erreur
        alertAccount = document.querySelector(".alert-account");
        // Message d'erreur négatif
        alertAccount.textContent = "Ce compte n'existe pas";
        // Ajout de la classe negative pour mettre le texte en rouge
        alertAccount.classList.add("negative");
    }
    // Si le compte existe
    else {
        // Redirection vers la page bank.html en insérant le parametre ?account= + valeur de l'input
        document.location.href = "./bank.html?account=" + inputValueAccount;
    }
}

// Fonction pour determiner true/false si le compte existe
function checkAccountExists(accountNumber) {
    // Boucle pour parcourir la liste des comptes
    for (const compte of comptes) {
        // Si un compte correspond à notre numéro de compte rentré dans l'input
        if (compte["numero"] == accountNumber) {
            // On retourne true
            return true;
        }
    }
    // Si à la fin de la boucle on a rien trouvé on retourne false
    return false;
}
