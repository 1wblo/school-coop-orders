// formulaire.js

const prenom = localStorage.getItem("coop_prenom") || "";
const courriel = localStorage.getItem("coop_courriel") || "";

const infoUser = document.getElementById("info-user");
if (infoUser) {
    infoUser.textContent = "Bonjour, " + prenom + " !";
}

// champs
const champNiveau = document.getElementById("niveau");
const champArticles = document.getElementById("articles");
const champMontantMax = document.getElementById("montant");
const champPrixMoyen = document.getElementById("prix-moyen");
const champRabais = document.getElementById("rabais");

// erreurs
const errNiveau = document.getElementById("err-niveau");
const errArticles = document.getElementById("err-articles");
const errMontantMax = document.getElementById("err-montant-max");
const errPrixMoyen = document.getElementById("err-prix-moyen");
const errSac = document.getElementById("err-sac");
const errCalculatrice = document.getElementById("err-calculatrice");
const errMembre = document.getElementById("err-membre");
const errCodePromo = document.getElementById("err-code-promo");
const errRabais = document.getElementById("err-rabais-promo");

// autres elements
const formCommande = document.getElementById("form-commande");
const panneauRefus = document.getElementById("panneau-cachee");
const refusMessage = document.getElementById("refus-message");
const q9 = document.getElementById("q9");

// validations

function validerNiveau() {
    if (!champNiveau.value) {
        champNiveau.classList.add("invalide");
        errNiveau.textContent = "Veuillez sélectionner votre niveau scolaire.";
        return false;
    }
    champNiveau.classList.remove("invalide");
    champNiveau.classList.add("valide");
    errNiveau.textContent = "";
    return true;
}

function validerArticles() {
    const val = champArticles.value.trim();
    const nb = parseInt(val, 10);

    if (val === "" || isNaN(nb)) {
        champArticles.classList.add("invalide");
        errArticles.textContent = "Veuillez entrer un nombre entier.";
        return false;
    }
    if (nb <= 0) {
        champArticles.classList.add("invalide");
        errArticles.textContent = "Le nombre d'articles doit être au moins 1.";
        return false;
    }
    if (!Number.isInteger(parseFloat(val))) {
        champArticles.classList.add("invalide");
        errArticles.textContent = "Veuillez entrer un nombre entier (sans décimales).";
        return false;
    }
    if (nb > 100) {
        champArticles.classList.add("invalide");
        errArticles.textContent = "Maximum 100 articles par commande.";
        return false;
    }
    champArticles.classList.remove("invalide");
    champArticles.classList.add("valide");
    errArticles.textContent = "";
    return true;
}

function validerMontantMax() {
    const val = champMontantMax.value.trim();
    const nb = parseFloat(val);

    if (val === "" || isNaN(nb)) {
        champMontantMax.classList.add("invalide");
        errMontantMax.textContent = "Veuillez entrer un montant valide.";
        return false;
    }
    if (nb < 0) {
        champMontantMax.classList.add("invalide");
        errMontantMax.textContent = "Le montant ne peut pas être négatif.";
        return false;
    }
    champMontantMax.classList.remove("invalide");
    champMontantMax.classList.add("valide");
    errMontantMax.textContent = "";
    return true;
}

function validerPrixMoyen() {
    const val = champPrixMoyen.value.trim();
    const nb = parseFloat(val);

    if (val === "" || isNaN(nb)) {
        champPrixMoyen.classList.add("invalide");
        errPrixMoyen.textContent = "Veuillez entrer un prix valide.";
        return false;
    }
    if (nb < 1) {
        champPrixMoyen.classList.add("invalide");
        errPrixMoyen.textContent = "Le prix moyen doit être d'au moins 1 $.";
        return false;
    }
    if (nb > 200) {
        champPrixMoyen.classList.add("invalide");
        errPrixMoyen.textContent = "Le prix moyen ne peut pas dépasser 200 $.";
        return false;
    }
    champPrixMoyen.classList.remove("invalide");
    champPrixMoyen.classList.add("valide");
    errPrixMoyen.textContent = "";
    return true;
}

function validerSac() {
    const selectionne = document.querySelector("input[name='sac']:checked");
    if (!selectionne) {
        errSac.textContent = "Veuillez faire un choix.";
        return false;
    }
    errSac.textContent = "";
    return true;
}

function validerCalculatrice() {
    const selectionne = document.querySelector("input[name='calculatrice']:checked");
    if (!selectionne) {
        errCalculatrice.textContent = "Veuillez faire un choix.";
        return false;
    }
    errCalculatrice.textContent = "";
    return true;
}

function validerMembre() {
    const selectionne = document.querySelector("input[name='membre']:checked");
    if (!selectionne) {
        errMembre.textContent = "Veuillez faire un choix.";
        return false;
    }
    errMembre.textContent = "";
    return true;
}

function validerCodePromo() {
    const selectionne = document.querySelector("input[name='code-promo']:checked");
    if (!selectionne) {
        errCodePromo.textContent = "Veuillez faire un choix.";
        return false;
    }
    errCodePromo.textContent = "";
    return true;
}

function validerRabais() {
    const val = champRabais.value.trim();
    const nb = parseFloat(val);

    if (val === "" || isNaN(nb)) {
        champRabais.classList.add("invalide");
        errRabais.textContent = "Veuillez entrer le montant du rabais.";
        return false;
    }
    if (nb <= 0) {
        champRabais.classList.add("invalide");
        errRabais.textContent = "Le montant du rabais doit être supérieur à 0 $.";
        return false;
    }
    if (nb > 300) {
        champRabais.classList.add("invalide");
        errRabais.textContent = "Le rabais ne peut pas dépasser 300 $.";
        return false;
    }
    champRabais.classList.remove("invalide");
    champRabais.classList.add("valide");
    errRabais.textContent = "";
    return true;
}

// divulgation progressive - Q9 
document.querySelectorAll("input[name='code-promo']").forEach(function (radio) {
    radio.addEventListener("change", function () {
        if (this.value === "oui") {
            q9.classList.remove("question-cachee");
            q9.classList.add("question-active");
            setTimeout(function () {
                q9.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 100);
        } else {
            q9.classList.remove("question-active");
            q9.classList.add("question-cachee");
            champRabais.value = "";
            errRabais.textContent = "";
        }
    });
});

// validation en temps réel
champNiveau.addEventListener("change", validerNiveau);
champArticles.addEventListener("input", validerArticles);
champMontantMax.addEventListener("input", validerMontantMax);
champPrixMoyen.addEventListener("input", validerPrixMoyen);
champRabais.addEventListener("input", validerRabais);

// mise a jour du recap
function majRecap() {
    if (champNiveau.value) {
        document.getElementById("recap-niveau").children[1].textContent =
            champNiveau.value.charAt(0).toUpperCase() + champNiveau.value.slice(1);
    }

    const nb = parseInt(champArticles.value, 10);
    if (!isNaN(nb) && nb > 0) {
        document.getElementById("recap-articles").children[1].textContent = nb + " article(s)";
    }

    const prix = parseFloat(champPrixMoyen.value);
    if (!isNaN(prix) && prix > 0) {
        document.getElementById("recap-prix").children[1].textContent = prix.toFixed(2).replace(".", ",") + " $";
    }

    const sacCoche = document.querySelector("input[name='sac']:checked");
    if (sacCoche) {
        document.getElementById("recap-sac").children[1].textContent = sacCoche.value === "oui" ? "40 $" : "Non";
    }

    const calcCoche = document.querySelector("input[name='calculatrice']:checked");
    if (calcCoche) {
        document.getElementById("recap-calc").children[1].textContent = calcCoche.value === "oui" ? "120 $" : "Non";
    }

    let total = 0;
    if (!isNaN(nb) && !isNaN(prix)) total = nb * prix;
    if (sacCoche && sacCoche.value === "oui") total += 40;
    if (calcCoche && calcCoche.value === "oui") total += 120;

    if (total > 0) {
        document.getElementById("recap-total").children[1].textContent = total.toFixed(2).replace(".", ",") + " $";

        let rabaisNiveau = 0;
        if (champNiveau.value === "primaire") rabaisNiveau = total * 0.05;
        if (champNiveau.value === "secondaire") rabaisNiveau = total * 0.03;

        const rabaisPromo = parseFloat(champRabais.value) || 0;
        const rabaisTotal = rabaisNiveau + rabaisPromo;

        if (rabaisTotal > 0) {
            document.getElementById("recap-rabais-val").textContent = "− " + rabaisTotal.toFixed(2).replace(".", ",") + " $";
            const final = Math.max(0, total - rabaisTotal);
            document.getElementById("recap-final-val").textContent = final.toFixed(2).replace(".", ",") + " $";
        } else {
            document.getElementById("recap-rabais").style.display = "none";
            document.getElementById("recap-final").style.display = "none";
        }
    }
}

champNiveau.addEventListener("change", majRecap);
champArticles.addEventListener("input", majRecap);
champPrixMoyen.addEventListener("input", majRecap);
champRabais.addEventListener("input", majRecap);

document.querySelectorAll("input[name='sac'], input[name='calculatrice']").forEach(function (radio) {
    radio.addEventListener("change", majRecap);
});

// soumission du formulaire

formCommande.addEventListener("submit", async function (e) {
    e.preventDefault();

    let ok = true;
    if (!validerNiveau()) ok = false;
    if (!validerArticles()) ok = false;
    if (!validerMontantMax()) ok = false;
    if (!validerPrixMoyen()) ok = false;
    if (!validerSac()) ok = false;
    if (!validerCalculatrice()) ok = false;
    if (!validerMembre()) ok = false;
    if (!validerCodePromo()) ok = false;

    const promoEl = document.querySelector("input[name='code-promo']:checked");
    if (promoEl && promoEl.value === "oui") {
        if (!validerRabais()) ok = false;
    }

    if (!ok) return;

    const niveau = champNiveau.value;
    const nbArticles = parseInt(champArticles.value, 10);
    const montantMax = parseFloat(champMontantMax.value);
    const prixMoyen = parseFloat(champPrixMoyen.value);
    const sacEl = document.querySelector("input[name='sac']:checked");
    const calcEl = document.querySelector("input[name='calculatrice']:checked");
    const membreEl = document.querySelector("input[name='membre']:checked");

    const sac = sacEl ? sacEl.value : "non";
    const calculatrice = calcEl ? calcEl.value : "non";
    const avecPromo = promoEl ? promoEl.value === "oui" : false;
    const rabaisPromo = avecPromo ? parseFloat(champRabais.value) : 0;

    // calcul montant total
    let montantTotal = nbArticles * prixMoyen;
    if (sac === "oui") montantTotal += 40;
    if (calculatrice === "oui") montantTotal += 120;

    // calcul rabais niveau
    let rabaisNiveau = 0;
    if (niveau === "primaire") rabaisNiveau = montantTotal * 0.05;
    if (niveau === "secondaire") rabaisNiveau = montantTotal * 0.03;

    const montantFinal = Math.max(0, montantTotal - rabaisNiveau - rabaisPromo);

    // cas de refus
    const msgRefus = "Désolé, cette commande ne peut pas être traitée par la coopérative. Aurevoir " + prenom;

    if (nbArticles > 100) {
        afficherRefus(msgRefus);
        return;
    }
    if (montantTotal > 2000) {
        afficherRefus(msgRefus);
        return;
    }
    if (calculatrice === "oui" && niveau === "primaire") {
        afficherRefus(msgRefus);
        return;
    }
    if (rabaisPromo > 300) {
        afficherRefus(msgRefus);
        return;
    }
    if (prixMoyen < 1) {
        afficherRefus(msgRefus);
        return;
    }
    if (prixMoyen > 200) {
        afficherRefus(msgRefus);
        return;
    }
    if (montantFinal > montantMax) {
        afficherRefus(msgRefus);
        return;
    }

    // sauvegarde et redirection
    const donneesCommande = {
        prenom: prenom,
        courriel: courriel,
        niveau: niveau,
        nbArticles: nbArticles,
        prixMoyen: prixMoyen,
        sac: sac,
        calculatrice: calculatrice,
        membre: membreEl ? membreEl.value : "non",
        rabaisPromo: rabaisPromo,
        montantTotal: montantTotal,
        rabaisNiveau: rabaisNiveau,
        montantFinal: montantFinal
    };

  const payload = {
    prenom: prenom,
    email: courriel,
    niveau: niveau,
    nb_articles: nbArticles,
    prix_moyen: prixMoyen,
    sac: sac === "oui" ? 1 : 0,
    calculatrice: calculatrice === "oui" ? 1 : 0,
    membre: membreEl ? (membreEl.value === "oui" ? 1 : 0) : 0,
    code_promo: avecPromo ? 1 : 0,
    montant_promo: rabaisPromo,
    total: montantFinal
};

const reponse = await fetch("/commande", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
});

if (reponse.ok) {
    localStorage.setItem("coop_commande", JSON.stringify(donneesCommande));
    window.location.href = "/confirmation";
}
});

// panneau de refus

function afficherRefus(message) {
    formCommande.classList.add("cache");
    panneauRefus.classList.add("visible");
    refusMessage.textContent = message;
    panneauRefus.scrollIntoView({ behavior: "smooth", block: "center" });
}

document.getElementById("btn-nouv-commande").addEventListener("click", function () {
    localStorage.removeItem("coop_commande");
    window.location.href = "/";
});