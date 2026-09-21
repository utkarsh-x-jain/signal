from pathlib import Path
import sys

import pandas as pd
from dotenv import load_dotenv
from sqlalchemy.orm import Session

# --------------------------------------------------
# Project paths
# --------------------------------------------------

ROOT_DIR = Path(__file__).resolve().parents[2]
BACKEND_DIR = ROOT_DIR / "backend"

sys.path.insert(0, str(BACKEND_DIR))

load_dotenv(BACKEND_DIR / ".env")

from app.database import SessionLocal
from app.models import (
    Asset,
    Complaint,
    Inspection,
    MaintenanceEvent,
    Incident,
)
from app.services.risk_engine import calculate_risk_breakdown


# --------------------------------------------------
# Output path
# --------------------------------------------------

OUTPUT_DIR = ROOT_DIR / "data" / "processed"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_FILE = OUTPUT_DIR / "risk_features.csv"


# --------------------------------------------------
# Dataset preparation
# --------------------------------------------------

def build_dataset():
    db: Session = SessionLocal()

    try:
        assets = db.query(Asset).all()

        rows = []

        for asset in assets:
            complaints = (
                db.query(Complaint)
                .filter(Complaint.asset_id == asset.id)
                .all()
            )

            inspections = (
                db.query(Inspection)
                .filter(Inspection.asset_id == asset.id)
                .all()
            )

            maintenance_events = (
                db.query(MaintenanceEvent)
                .filter(
                    MaintenanceEvent.asset_id == asset.id
                )
                .all()
            )

            incidents = (
                db.query(Incident)
                .filter(Incident.asset_id == asset.id)
                .all()
            )

            # -----------------------------
            # Complaint features
            # -----------------------------

            complaint_count = len(complaints)

            average_complaint_severity = (
                sum(c.severity for c in complaints)
                / complaint_count
                if complaints
                else 0
            )

            recent_complaints = sum(
                1
                for complaint in complaints
                if complaint.reported_days_ago <= 30
            )

            # -----------------------------
            # Inspection features
            # -----------------------------

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

            # -----------------------------
            # Maintenance features
            # -----------------------------

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

            # -----------------------------
            # Incident features
            # -----------------------------

            incident_count = len(incidents)

            unresolved_incidents = sum(
                1
                for incident in incidents
                if not incident.resolved
            )

            resolved_incidents = (
                incident_count - unresolved_incidents
            )

            # -----------------------------
            # Existing rule-based risk
            # -----------------------------

            risk_breakdown = calculate_risk_breakdown(
                complaints=complaints,
                inspections=inspections,
                maintenance_events=maintenance_events,
                incidents=incidents,
            )

            rule_based_risk = risk_breakdown["overall"]

            # -----------------------------
            # Feature row
            # -----------------------------

            rows.append(
                {
                    "asset_id": asset.id,
                    "complaint_count": complaint_count,
                    "average_complaint_severity": round(
                        average_complaint_severity,
                        2,
                    ),
                    "recent_complaints": recent_complaints,
                    "inspection_count": inspection_count,
                    "average_condition_score": round(
                        average_condition_score,
                        2,
                    ),
                    "maintenance_count": maintenance_count,
                    "recent_maintenance": recent_maintenance,
                    "total_maintenance_cost": total_maintenance_cost,
                    "incident_count": incident_count,
                    "unresolved_incidents": unresolved_incidents,
                    "resolved_incidents": resolved_incidents,
                    "rule_based_risk": rule_based_risk,
                }
            )

        dataframe = pd.DataFrame(rows)

        dataframe.to_csv(
            OUTPUT_FILE,
            index=False,
        )

        print(
            f"Dataset created successfully: {OUTPUT_FILE}"
        )

        print(f"Rows: {len(dataframe)}")
        print(f"Columns: {len(dataframe.columns)}")
        print()
        print(dataframe.to_string(index=False))

    finally:
        db.close()


if __name__ == "__main__":
    build_dataset()