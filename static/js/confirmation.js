// confirmation.js 

const donneesRaw = localStorage.getItem("coop_commande");
if (!donneesRaw) {
    window.location.href = "/";
}
const donnees = JSON.parse(donneesRaw);

function formaterMontant(n) {
    return n.toFixed(2).replace(".", ",") + " $";
}

function formaterDateTime() {
    const maintenant = new Date();
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Toronto"
    };
    return maintenant.toLocaleString("fr-CA", options);
}

// remplir les champs
document.getElementById("conf-prenom").textContent = donnees.prenom;
document.getElementById("conf-courriel").textContent = donnees.courriel;
document.getElementById("conf-niveau").textContent =
    donnees.niveau.charAt(0).toUpperCase() + donnees.niveau.slice(1);

// détail articles
let detailArticles = donnees.nbArticles + " article(s) à " + formaterMontant(donnees.prixMoyen) + " / unité";
document.getElementById("conf-articles").textContent = detailArticles;

// sous-total
document.getElementById("conf-sous-total").textContent = formaterMontant(donnees.montantTotal);

// rabais
const rabaisTotal = (donnees.rabaisNiveau || 0) + (donnees.rabaisPromo || 0);
const lignRabais = document.getElementById("conf-rabais-ligne");

if (rabaisTotal > 0) {
    lignRabais.style.display = "flex";
    document.getElementById("conf-rabais").textContent = "− " + formaterMontant(rabaisTotal);
} else {
    lignRabais.style.display = "none";
}

// total final
document.getElementById("conf-total").textContent = formaterMontant(Math.max(0, donnees.montantFinal));

// date et heure
document.getElementById("conf-datetime").textContent = formaterDateTime();

// message de remerciement
document.getElementById("conf-merci").textContent = "Merci pour votre commande, " + donnees.prenom + " !";

// bouton nouvelle commande
document.getElementById("btn-nouv-commande").addEventListener("click", function () {
    localStorage.removeItem("coop_commande");
    window.location.href = "/";

});

async function chargerProduits() {
    const reponse = await fetch("/produits");
    const produits = await reponse.json();

    const liste = document.getElementById("liste-produits");
    liste.innerHTML = "";

    produits.forEach(function (p) {
        const li = document.createElement("li");
        li.className = "item-produit";
        li.innerHTML = p.nom + " — " + p.prix.toFixed(2) + " $" +
            ' <button class="btn-supprimer" data-id="' + p.id + '">Supprimer</button>';
        liste.appendChild(li);
    });

    document.querySelectorAll(".btn-supprimer").forEach(function (btn) {
        btn.addEventListener("click", async function () {
            const id = this.dataset.id;
            await fetch("/produits/" + id, { method: "DELETE" });
            chargerProduits();
        });
    });
}

async function chargerCommandes() {
    const reponse = await fetch("/commandes");
    const commandes = await reponse.json();

    const liste = document.getElementById("liste-commandes");
    liste.innerHTML = "";

    commandes.forEach(function (c) {
        const li = document.createElement("li");
        li.className = "item-commande";
        li.textContent = c.prenom + " — " + c.niveau + " — " + parseFloat(c.total).toFixed(2) + " $ — " + c.date;
        liste.appendChild(li);
    });
}

document.getElementById("form-ajout-produit").addEventListener("submit", async function (e) {
    e.preventDefault();
    const nom = document.getElementById("input-nom-produit").value.trim();
    const prix = parseFloat(document.getElementById("input-prix-produit").value);

    await fetch("/produits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom: nom, prix: prix })
    });

    this.reset();
    chargerProduits();
});

chargerProduits();
chargerCommandes();