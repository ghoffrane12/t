from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from expense_predictor import ExpensePredictor
from collections import defaultdict
from datetime import datetime
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Connexion MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["flesk-wallet"]
expenses_collection = db["expenses"]
cache_collection = db["prediction_cache"]  # Nouvelle collection de cache

# 🇹🇳 Jours fériés et événements saisonniers (2025)
holidays_df = pd.DataFrame([
    {"ds": "2025-03-20", "holiday": "independance"},
    {"ds": "2025-04-09", "holiday": "martyrs"},
    {"ds": "2025-05-01", "holiday": "travail"},
    {"ds": "2025-07-25", "holiday": "republique"},
    {"ds": "2025-08-13", "holiday": "femme"},
    {"ds": "2025-10-15", "holiday": "evacuation"},
    {"ds": "2025-12-17", "holiday": "revolution"},
    {"ds": "2025-03-01", "holiday": "ramadan"},
    {"ds": "2025-03-15", "holiday": "ramadan"},
    {"ds": "2025-03-31", "holiday": "ramadan"},
    {"ds": "2025-04-01", "holiday": "aid_el_fitr"},
    {"ds": "2025-06-06", "holiday": "aid_el_adha"},
    {"ds": "2025-07-01", "holiday": "ete"},
    {"ds": "2025-07-15", "holiday": "ete"},
    {"ds": "2025-08-01", "holiday": "ete"},
    {"ds": "2025-08-15", "holiday": "ete"},
])

@app.route("/predict/<user_id>", methods=["GET"])
def predict(user_id):
    print(f"Requête de prédiction reçue pour user_id={user_id}")
    try:
        now = datetime.utcnow()

        # Vérifier le cache Mongo
        cache = cache_collection.find_one({"user_id": user_id})
        if cache and (now - cache["timestamp"]).total_seconds() < 3600:
            print("→ Prédiction depuis MongoDB cache")
            return jsonify({"predictions": cache["predictions"]})

        # Récupérer les dépenses de l'utilisateur
        user_object_id = ObjectId(user_id)
        expenses = list(expenses_collection.find({"user": user_object_id}))
        if not expenses:
            return jsonify({"error": "Aucune dépense trouvée pour cet utilisateur."}), 404

        # Grouper les dépenses par catégorie
        grouped_expenses = defaultdict(list)
        for exp in expenses:
            category = exp.get("category", "Autre")
            date = exp.get("date")
            amount = exp.get("amount")
            if date and amount:
                grouped_expenses[category].append({
                    "ds": date,
                    "y": float(amount)
                })

        # Générer les prédictions
        predictor = ExpensePredictor(holidays_df=holidays_df)
        predictions = predictor.predict_by_category(grouped_expenses)

        # Mettre à jour le cache MongoDB
        cache_collection.update_one(
            {"user_id": user_id},
            {"$set": {
                "predictions": predictions,
                "timestamp": now
            }},
            upsert=True
        )

        return jsonify({"predictions": predictions})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=True, port=port)
