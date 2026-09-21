from pathlib import Path
import json

import joblib
import pandas as pd

from sklearn.ensemble import (
    GradientBoostingRegressor,
    RandomForestRegressor,
)
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split


# --------------------------------------------------
# Paths
# --------------------------------------------------

ROOT_DIR = Path(__file__).resolve().parents[2]

DATA_FILE = (
    ROOT_DIR
    / "data"
    / "processed"
    / "training_data.csv"
)

MODEL_DIR = ROOT_DIR / "ml" / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_FILE = MODEL_DIR / "risk_model.joblib"
MODEL_INFO_FILE = MODEL_DIR / "model_info.json"


# --------------------------------------------------
# Features
# --------------------------------------------------

FEATURE_COLUMNS = [
    "complaint_count",
    "average_complaint_severity",
    "recent_complaints",
    "inspection_count",
    "average_condition_score",
    "maintenance_count",
    "recent_maintenance",
    "total_maintenance_cost",
    "incident_count",
    "unresolved_incidents",
    "resolved_incidents",
]

TARGET_COLUMN = "rule_based_risk"


# --------------------------------------------------
# Training
# --------------------------------------------------

def train_model():

    if not DATA_FILE.exists():
        raise FileNotFoundError(
            f"Training dataset not found: {DATA_FILE}"
        )

    df = pd.read_csv(DATA_FILE)

    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    print("Training dataset loaded.")
    print(f"Samples: {len(df)}")
    print(f"Features: {len(FEATURE_COLUMNS)}")
    print()

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
    )

    models = {
        "Linear Regression": LinearRegression(),

        "Random Forest": RandomForestRegressor(
            n_estimators=200,
            random_state=42,
            n_jobs=-1,
            max_depth=8,
        ),

        "Gradient Boosting": GradientBoostingRegressor(
            n_estimators=150,
            learning_rate=0.05,
            max_depth=3,
            random_state=42,
        ),
    }

    results = {}

    best_model = None
    best_model_name = None
    best_mae = float("inf")

    print("Model performance")
    print("-" * 50)

    for name, model in models.items():

        model.fit(X_train, y_train)

        predictions = model.predict(X_test)

        mae = mean_absolute_error(
            y_test,
            predictions,
        )

        r2 = r2_score(
            y_test,
            predictions,
        )

        results[name] = {
            "mae": round(float(mae), 4),
            "r2": round(float(r2), 4),
        }

        print(f"{name}")
        print(f"  MAE: {mae:.4f}")
        print(f"  R2 : {r2:.4f}")
        print()

        if mae < best_mae:
            best_mae = mae
            best_model = model
            best_model_name = name

    # --------------------------------------------------
    # Save best model
    # --------------------------------------------------

    joblib.dump(
        {
            "model": best_model,
            "features": FEATURE_COLUMNS,
            "target": TARGET_COLUMN,
        },
        MODEL_FILE,
    )

    model_info = {
        "model_name": best_model_name,
        "model_file": str(MODEL_FILE),
        "features": FEATURE_COLUMNS,
        "target": TARGET_COLUMN,
        "results": results,
        "dataset_rows": len(df),
    }

    with open(
        MODEL_INFO_FILE,
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            model_info,
            file,
            indent=2,
        )

    print("=" * 50)
    print(f"Best model: {best_model_name}")
    print(f"Model saved: {MODEL_FILE}")
    print(f"Model info saved: {MODEL_INFO_FILE}")


if __name__ == "__main__":
    train_model()