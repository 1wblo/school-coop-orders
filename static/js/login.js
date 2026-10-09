// login.js - validation de la page de connexion

const champPrenom = document.getElementById("prenom");
const champCourriel = document.getElementById("courriel");
const errPrenom = document.getElementById("err-prenom");
const errCourriel = document.getElementById("err-courriel");
const formLogin = document.getElementById("form-login");

function validerPrenom() {
    const val = champPrenom.value.trim();
    const regex = /^[a-zA-ZÀ-ÿ\-' ]+$/;

    if (val === "") {
        afficherErreur(champPrenom, errPrenom, "Le prénom ne peut pas être vide.");
        return false;
    }

    if (!regex.test(val)) {
        afficherErreur(champPrenom, errPrenom, "Le prénom doit contenir seulement des lettres.");
        return false;
    }

    effacerErreur(champPrenom, errPrenom);
    return true;
}

function validerCourriel() {
    const val = champCourriel.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.(com|ca|org|net)$/i;

    if (val === "") {
        afficherErreur(champCourriel, errCourriel, "Le courriel ne peut pas être vide.");
        return false;
    }

    if (!regex.test(val)) {
        afficherErreur(champCourriel, errCourriel, "Format invalide. Ex : nom@domaine.com (.com, .ca, .org, .net)");
        return false;
    }

    effacerErreur(champCourriel, errCourriel);
    return true;
}

function afficherErreur(champ, errEl, message) {
    champ.classList.add("invalide");
    champ.classList.remove("valide");
    errEl.textContent = message;
}

function effacerErreur(champ, errEl) {
    champ.classList.remove("invalide");
    champ.classList.add("valide");
    errEl.textContent = "";
}

// validation en temps réel
champPrenom.addEventListener("input", validerPrenom);
champCourriel.addEventListener("input", validerCourriel);

// soumission
formLogin.addEventListener("submit", function (e) {
    e.preventDefault();

    const prenomOk = validerPrenom();
    const courrielOk = validerCourriel();

    if (prenomOk && courrielOk) {
        localStorage.setItem("coop_prenom", champPrenom.value.trim());
        localStorage.setItem("coop_courriel", champCourriel.value.trim());
        window.location.href = "/formulaire";
    }
});