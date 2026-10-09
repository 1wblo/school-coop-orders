# Coopérative scolaire

Application web de commande de fournitures scolaires : une petite boutique en ligne
avec connexion, formulaire de commande, calcul du total côté serveur et page de
confirmation qui permet aussi de gérer le catalogue de produits.

Réalisée avec Flask, SQLite et du HTML/CSS/JavaScript sans framework.

## Fonctionnalités

- Page de connexion (prénom et courriel) avec validation
- Formulaire de commande : niveau scolaire, nombre d'articles, prix moyen, options
  (sac d'école, calculatrice scientifique) et code promo
- Validation et calcul du total refaits côté serveur
- Rabais selon le niveau scolaire (5 % au primaire, 3 % au secondaire)
- Page de confirmation avec la liste des commandes et la gestion des produits
- API JSON pour les produits et les commandes

## Installation

Il faut Python 3.

```bash
python3 -m venv .venv
source .venv/bin/activate        # Windows : .venv\Scripts\activate
pip install -r requirements.txt
```

## Lancement

```bash
python app.py
```

L'application est ensuite disponible sur <http://127.0.0.1:5000>.

La base de données `coop.db` est créée automatiquement au premier lancement, avec
quelques produits de départ. Pour repartir de zéro, il suffit de supprimer ce fichier.

## Pages

| Route           | Description               |
| --------------- | ------------------------- |
| `/`             | Connexion                 |
| `/formulaire`   | Formulaire de commande    |
| `/confirmation` | Confirmation de commande  |

## API

| Méthode  | Route            | Description                                        |
| -------- | ---------------- | -------------------------------------------------- |
| `GET`    | `/produits`      | Liste des produits                                 |
| `POST`   | `/produits`      | Ajoute un produit (`nom`, `prix`)                  |
| `DELETE` | `/produits/<id>` | Supprime un produit                                |
| `POST`   | `/commande`      | Valide, calcule et enregistre une commande         |
| `GET`    | `/commandes`     | Liste des commandes                                |

Exemple de commande :

```bash
curl -X POST http://127.0.0.1:5000/commande \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Marie",
    "email": "marie@exemple.com",
    "niveau": "secondaire",
    "nb_articles": 3,
    "prix_moyen": 10,
    "sac": 1,
    "calculatrice": 0,
    "membre": 0,
    "code_promo": 0,
    "montant_promo": 0
  }'
```

Réponse : `{"message": "Commande enregistrée avec succès.", "total": 67.9}`

### Règles de validation

- Prénom en lettres seulement ; courriel en `.com`, `.ca`, `.org` ou `.net`
- Niveau : `primaire`, `secondaire`, `cegep` ou `universite`
- De 1 à 100 articles, prix moyen entre 1 $ et 200 $
- Pas de calculatrice scientifique au primaire
- Rabais promotionnel de 300 $ maximum
- Total final entre 0 $ et 2000 $

## Structure

```
app.py              Application Flask (routes, validation, calcul, base de données)
requirements.txt    Dépendances Python
templates/          Pages HTML
static/css/         Feuilles de style
static/js/          Scripts des pages
```

## Auteur

Abdoul Wadoud Bello
