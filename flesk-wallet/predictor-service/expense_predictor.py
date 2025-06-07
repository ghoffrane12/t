from prophet import Prophet
import pandas as pd
from datetime import datetime
from dateutil.relativedelta import relativedelta

class ExpensePredictor:
    def __init__(self, holidays_df=None):
        self.holidays_df = holidays_df

    def prepare_data(self, expenses):
        if not expenses or len(expenses) < 2:
            return None
        df = pd.DataFrame(expenses)
        df.columns = ['ds', 'y']
        df['ds'] = pd.to_datetime(df['ds'])

        # 🔍 Nettoyage des NaN et valeurs infinies
        df = df.dropna()
        df = df[np.isfinite(df['y'])]

        return df


    def predict_by_category(self, all_expenses_by_category):
        results = []
        now = datetime.now()
        next_month = (now + relativedelta(months=1)).month
        last_month = now.month

        for category, expenses in all_expenses_by_category.items():
            df = self.prepare_data(expenses)
            if df is None:
                results.append({
                    "category": category,
                    "predicted_total": 0.0,
                    "explanation": "Pas assez de données pour une prédiction fiable."
                })
                continue

            try:
                model = Prophet(
                    yearly_seasonality=False,
                    weekly_seasonality=True,
                    daily_seasonality=False,
                    holidays=self.holidays_df if self.holidays_df is not None else None
                )

                model.fit(df)
                future = model.make_future_dataframe(periods=30)
                forecast = model.predict(future)

                forecast['ds'] = pd.to_datetime(forecast['ds'])
                next_forecast = forecast[forecast['ds'].dt.month == next_month]
                predicted_sum = next_forecast['yhat'].sum()

                # Analyse historique
                last_month_data = df[df['ds'].dt.month == last_month]
                last_total = last_month_data['y'].sum()

                # Explication intelligente
                if last_total < 1:
                    if predicted_sum < 1:
                        explanation = f"Peu ou pas de dépenses prévues pour la catégorie {category}."
                        predicted_sum = 0.0
                    else:
                        explanation = f"Des dépenses (~{predicted_sum:.1f} TND) sont prévues pour {category}, alors que le mois précédent était quasi nul."
                else:
                    change_pct = ((predicted_sum - last_total) / last_total) * 100
                    events = []
                    if self.holidays_df is not None:
                        next_days = next_forecast['ds'].dt.strftime('%Y-%m-%d')
                        events = self.holidays_df[self.holidays_df['ds'].isin(next_days)]['holiday'].unique()

                    if change_pct > 10:
                        if "ete" in events:
                            explanation = f"Les dépenses en {category} vont probablement augmenter (~{change_pct:.1f}%) à cause des vacances d'été."
                        elif "ramadan" in events:
                            explanation = f"Augmentation (~{change_pct:.1f}%) attendue pendant le Ramadan."
                        elif len(events) > 0:
                            explanation = f"Augmentation (~{change_pct:.1f}%) possiblement liée à : {', '.join(events)}."
                        else:
                            explanation = f"Augmentation (~{change_pct:.1f}%) par rapport au mois précédent."
                    elif change_pct < -10:
                        explanation = f"Baisse (~{abs(change_pct):.1f}%) prévue dans les dépenses de {category}."
                    else:
                        explanation = f"Dépenses stables prévues pour la catégorie {category}."

                # Forcer un minimum si catégorie récurrente
                if category.lower() in ["logement", "abonnement", "loyer", "internet"]:
                    history_total = df['y'].sum()
                    if history_total > 0 and predicted_sum < 1:
                        predicted_sum = round(history_total / len(df), 2)
                        explanation = f"Dépense récurrente détectée pour {category}. Prévision estimée à {predicted_sum} TND."

                results.append({
                    "category": category,
                    "predicted_total": round(predicted_sum, 2),
                    "explanation": explanation,
                })

            except Exception as e:
                results.append({
                    "category": category,
                    "error": f"Erreur de prédiction : {str(e)}"
                })

        return results


# Exemple d'utilisation :
if __name__ == "__main__":
    holidays_df = pd.DataFrame([
        {"ds": "2024-12-25", "holiday": "noel"},
        {"ds": "2025-01-01", "holiday": "nouvel_an"},
        {"ds": "2025-08-15", "holiday": "rentrée"}
    ])

    predictor = ExpensePredictor(holidays_df)

    dummy_expenses = {
        "courses": [
            {"ds": "2024-01-01", "y": 100},
            {"ds": "2024-02-01", "y": 110},
            {"ds": "2024-03-01", "y": 105}
        ],
        "loisirs": [
            {"ds": "2024-01-01", "y": 50},
            {"ds": "2024-02-01", "y": 60},
            {"ds": "2024-03-01", "y": 55}
        ],
        "abonnement": [
            {"ds": "2024-01-01", "y": 25},
            {"ds": "2024-02-01", "y": 25},
            {"ds": "2024-03-01", "y": 25}
        ],
        "facture": [
            {"ds": "2024-03-01", "y": 0.01}
        ]
    }

    predictions = predictor.predict_by_category(dummy_expenses)
    for p in predictions:
        print(p)
