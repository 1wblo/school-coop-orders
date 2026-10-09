"""Coopérative scolaire en ligne : application Flask de commande de fournitures.

Auteur : Abdoul Wadoud Bello
"""

from flask import Flask, jsonify, request, render_template
from datetime import datetime
import sqlite3
import re

app = Flask(__name__)

BD = "coop.db"


# --- Connexion a la base de donnees ---


def get_db():
    conn = sqlite3.connect(BD)
    conn.row_factory = sqlite3.Row
    return conn


# --- Creation des tables au premier lancement ---

PRODUITS_DEPART = [
    ("Cahier", 5.5),
    ("Crayon", 1.2),
    ("Calculatrice scientifique", 120.0),
    ("Sac école", 40.0),
    ("Stylo", 2.5),
    ("Règle", 3.0),
    ("Classeur", 7.5),
    ("Feuilles A4", 6.0),
    ("Efface", 1.0),
    ("Marqueur", 4.5),
]


def init_db():
    conn = get_db()
    nouvelle_bd = (
        conn.execute(
            "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'produits'"
        ).fetchone()
        is None
    )

    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS produits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            prix REAL NOT NULL
        )
    """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS commandes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            prenom TEXT NOT NULL,
            email TEXT NOT NULL,
            niveau TEXT NOT NULL,
            nb_articles INTEGER,
            prix_moyen REAL,
            sac INTEGER,
            calculatrice INTEGER,
            membre INTEGER,
            code_promo INTEGER,
            montant_promo REAL,
            total REAL,
            date TEXT
        )
    """
    )

    # Produits de depart, seulement si la base vient d etre creee
    if nouvelle_bd:
        conn.executemany(
            "INSERT INTO produits (nom, prix) VALUES (?, ?)", PRODUITS_DEPART
        )

    conn.commit()
    conn.close()


init_db()


# --- Validation des donnees ---


def valider_commande(data):
    prenom = data.get("prenom", "").strip()
    email = data.get("email", "").strip()
    niveau = data.get("niveau", "").strip()
    nb_articles = data.get("nb_articles")
    prix_moyen = data.get("prix_moyen")
    sac = data.get("sac")
    calculatrice = data.get("calculatrice")
    code_promo = data.get("code_promo")
    montant_promo = data.get("montant_promo", 0)

    # Prenom : lettres seulement
    if not prenom or not re.match(r"^[a-zA-ZÀ-ÿ\- ]+$", prenom):
        return "Prénom invalide : Il doit etre en lettres seulement."

    # Email : format valide
    if not re.match(r"^[^\s@]+@[^\s@]+\.(com|ca|org|net)$", email, re.IGNORECASE):
        return "Courriel invalide (extensions acceptées : .com .ca .org .net)"

    # Niveau : valeur attendue
    if niveau not in ["primaire", "secondaire", "cegep", "universite"]:
        return "Niveau scolaire invalide."

    # Nombre d articles
    if nb_articles is None or not isinstance(nb_articles, int) or nb_articles <= 0:
        return "Nombre d'articles invalide."
    if nb_articles > 100:
        return "Commande refusée — maximum 100 articles."

    # Prix moyen
    if prix_moyen is None or prix_moyen < 1:
        return "Prix moyen invalide — minimum 1 $."
    if prix_moyen > 200:
        return "Prix moyen invalide — maximum 200 $."

    # Sac et calculatrice
    if sac not in [0, 1]:
        return "Valeur invalide pour le sac."
    if calculatrice not in [0, 1]:
        return "Valeur invalide pour la calculatrice."

    # Calculatrice interdite au primaire
    if calculatrice == 1 and niveau == "primaire":
        return (
            "Commande refusée — calculatrice scientifique non disponible au primaire."
        )

    # Code promo
    if code_promo not in [0, 1]:
        return "Valeur invalide pour le code promo."
    if code_promo == 1 and montant_promo > 300:
        return "Commande refusée — rabais promotionnel maximum 300 $."

    return None


# --- Calcul du total ---


def calculer_total(data):
    nb_articles = data.get("nb_articles")
    prix_moyen = data.get("prix_moyen")
    sac = data.get("sac")
    calculatrice = data.get("calculatrice")
    niveau = data.get("niveau")
    code_promo = data.get("code_promo")
    montant_promo = data.get("montant_promo", 0)

    total = nb_articles * prix_moyen
    if sac == 1:
        total += 40
    if calculatrice == 1:
        total += 120

    rabais = 0
    if niveau == "primaire":
        rabais = total * 0.05
    if niveau == "secondaire":
        rabais = total * 0.03

    if code_promo == 1:
        rabais += montant_promo

    total_final = round(total - rabais, 2)
    if total_final < 0:
        return None, "Commande refusée — le rabais dépasse le montant total."

    if total_final > 2000:
        return None, "Commande refusée — montant total dépasse 2000 $."

    return round(total_final, 2), None


# --- Routes ---


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/formulaire")
def formulaire():
    return render_template("formulaire.html")


@app.route("/confirmation")
def confirmation():
    return render_template("confirmation.html")


# GET /produits — retourner tous les produits
@app.route("/produits", methods=["GET"])
def get_produits():
    conn = get_db()
    produits = conn.execute("SELECT * FROM produits").fetchall()
    conn.close()
    return jsonify([dict(p) for p in produits])


# POST /produits — ajouter un produit
@app.route("/produits", methods=["POST"])
def add_produit():
    data = request.get_json()
    nom = data.get("nom", "").strip()
    prix = data.get("prix")

    if not nom:
        return jsonify({"erreur": "Le nom du produit est requis."}), 400
    if prix is None or prix <= 0:
        return jsonify({"erreur": "Le prix doit être supérieur à 0."}), 400

    conn = get_db()
    conn.execute("INSERT INTO produits (nom, prix) VALUES (?, ?)", (nom, prix))
    conn.commit()
    conn.close()
    return jsonify({"message": "Produit ajouté avec succès."}), 201


# DELETE /produits/<id> — supprimer un produit
@app.route("/produits/<int:id>", methods=["DELETE"])
def delete_produit(id):
    conn = get_db()
    conn.execute("DELETE FROM produits WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Produit supprimé."})


# POST /commande — valider, calculer et enregistrer une commande
@app.route("/commande", methods=["POST"])
def add_commande():
    data = request.get_json()

    # Validation
    erreur = valider_commande(data)
    if erreur:
        return jsonify({"erreur": erreur}), 400

    # Calcul cote serveur
    total_final, erreur_calcul = calculer_total(data)
    if erreur_calcul:
        return jsonify({"erreur": erreur_calcul}), 400

    date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    conn = get_db()
    conn.execute(
        """
        INSERT INTO commandes
        (prenom, email, niveau, nb_articles, prix_moyen, sac, calculatrice, membre, code_promo, montant_promo, total, date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """,
        (
            data.get("prenom").strip(),
            data.get("email").strip(),
            data.get("niveau"),
            data.get("nb_articles"),
            data.get("prix_moyen"),
            data.get("sac"),
            data.get("calculatrice"),
            data.get("membre"),
            data.get("code_promo"),
            data.get("montant_promo", 0),
            total_final,
            date,
        ),
    )
    conn.commit()
    conn.close()

    return (
        jsonify({"message": "Commande enregistrée avec succès.", "total": total_final}),
        201,
    )


# GET /commandes — retourner toutes les commandes
@app.route("/commandes", methods=["GET"])
def get_commandes():
    conn = get_db()
    commandes = conn.execute("SELECT * FROM commandes").fetchall()
    conn.close()
    return jsonify([dict(c) for c in commandes])


if __name__ == "__main__":
    app.run(debug=True)
