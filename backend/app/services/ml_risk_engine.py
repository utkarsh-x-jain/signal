from pathlib import Path

import joblib


# --------------------------------------------------
# Model path
# --------------------------------------------------

ROOT_DIR = Path(__file__).resolve().parents[3]

MODEL_FILE = (
    ROOT_DIR
    / "ml"
    / "models"
    / "risk_model.joblib"
)


# --------------------------------------------------
# Feature order
# Must exactly match training order
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


# --------------------------------------------------
# Load model once
# --------------------------------------------------

_model_bundle = None


def get_model():
    global _model_bundle

    if _model_bundle is None:
        if not MODEL_FILE.exists():
            raise FileNotFoundError(
                f"ML model not found: {MODEL_FILE}"
            )

        _model_bundle = joblib.load(MODEL_FILE)

    return _model_bundle


# --------------------------------------------------
# Build features
# --------------------------------------------------

def build_ml_features(
    complaints,
    inspections,
    maintenance_events,
    incidents,
):
    complaint_count = len(complaints)

    average_complaint_severity = (
        sum(
            complaint.severity
            for complaint in complaints
        )
        / complaint_count
        if complaints
        else 0
    )

    recent_complaints = sum(
        1
        for complaint in complaints
        if complaint.reported_days_ago <= 30
    )

    inspection_count = len(inspections)

    average_condition_score = (
        sum(
            inspection.condition_score
            for inspection in inspections
        )
        / inspection_count
        if inspections
        else 50
    )

    maintenance_count = len(maintenance_events)

    recent_maintenance = sum(
        1
        for event in maintenance_events
        if event.maintenance_days_ago <= 30
    )

    total_maintenance_cost = sum(
        event.cost
        for event in maintenance_events
    )

    incident_count = len(incidents)

    unresolved_incidents = sum(
        1
        for incident in incidents
        if not incident.resolved
    )

    resolved_incidents = (
        incident_count - unresolved_incidents
    )

    return {
        "complaint_count": complaint_count,
        "average_complaint_severity": average_complaint_severity,
        "recent_complaints": recent_complaints,
        "inspection_count": inspection_count,
        "average_condition_score": average_condition_score,
        "maintenance_count": maintenance_count,
        "recent_maintenance": recent_maintenance,
        "total_maintenance_cost": total_maintenance_cost,
        "incident_count": incident_count,
        "unresolved_incidents": unresolved_incidents,
        "resolved_incidents": resolved_incidents,
    }


# --------------------------------------------------
# Predict ML risk
# --------------------------------------------------

def predict_ml_risk(
    complaints,
    inspections,
    maintenance_events,
    incidents,
):
    model_bundle = get_model()

    model = model_bundle["model"]
    features = model_bundle["features"]

    feature_values = build_ml_features(
        complaints=complaints,
        inspections=inspections,
        maintenance_events=maintenance_events,
        incidents=incidents,
    )

    input_row = [
        feature_values[column]
        for column in features
    ]

    prediction = model.predict([input_row])[0]

    prediction = max(
        0,
        min(100, float(prediction)),
    )

    return round(prediction, 1)