from app.database import SessionLocal, engine, Base
from app.models import (
    Asset,
    Complaint,
    Inspection,
    MaintenanceEvent,
    Incident,
)


Base.metadata.create_all(bind=engine)


assets = [
    Asset(
        id="SG-042",
        name="Central Bridge",
        type="Bridge",
        location="North District",
        risk=78,
        status="High",
        updated="8 min ago",
    ),
    Asset(
        id="SG-017",
        name="Water Main 17",
        type="Pipeline",
        location="West District",
        risk=61,
        status="Medium",
        updated="21 min ago",
    ),
    Asset(
        id="SG-091",
        name="Grid Junction",
        type="Electrical",
        location="South District",
        risk=34,
        status="Low",
        updated="34 min ago",
    ),
    Asset(
        id="SG-063",
        name="East Overpass",
        type="Bridge",
        location="East District",
        risk=69,
        status="Medium",
        updated="47 min ago",
    ),
]


complaints = [
    Complaint(
        asset_id="SG-042",
        category="Structural",
        severity=4,
        description="Visible cracks reported near the eastern support column.",
        reported_days_ago=2,
    ),
    Complaint(
        asset_id="SG-042",
        category="Surface",
        severity=3,
        description="Road surface deterioration reported on the bridge deck.",
        reported_days_ago=6,
    ),
    Complaint(
        asset_id="SG-042",
        category="Vibration",
        severity=4,
        description="Unusual vibration noticed during heavy vehicle movement.",
        reported_days_ago=11,
    ),
    Complaint(
        asset_id="SG-017",
        category="Leakage",
        severity=3,
        description="Water leakage reported near the western junction.",
        reported_days_ago=4,
    ),
]


inspections = [
    Inspection(
        asset_id="SG-042",
        inspector="A. Sharma",
        condition_score=58,
        findings="Multiple surface cracks and moderate deterioration observed.",
        inspection_days_ago=5,
    ),
    Inspection(
        asset_id="SG-017",
        inspector="R. Mehta",
        condition_score=72,
        findings="Minor corrosion found around one pipeline connection.",
        inspection_days_ago=12,
    ),
    Inspection(
        asset_id="SG-063",
        inspector="P. Verma",
        condition_score=67,
        findings="Expansion joint wear requires monitoring.",
        inspection_days_ago=9,
    ),
]


maintenance_events = [
    MaintenanceEvent(
        asset_id="SG-042",
        event_type="Structural Repair",
        cost=185000,
        description="Emergency repair work performed on support section.",
        maintenance_days_ago=18,
    ),
    MaintenanceEvent(
        asset_id="SG-042",
        event_type="Surface Repair",
        cost=92000,
        description="Damaged road surface repaired on bridge deck.",
        maintenance_days_ago=41,
    ),
    MaintenanceEvent(
        asset_id="SG-017",
        event_type="Valve Replacement",
        cost=45000,
        description="Faulty pipeline valve replaced.",
        maintenance_days_ago=23,
    ),
    MaintenanceEvent(
        asset_id="SG-063",
        event_type="Joint Maintenance",
        cost=68000,
        description="Expansion joint maintenance completed.",
        maintenance_days_ago=31,
    ),
]


incidents = [
    Incident(
        asset_id="SG-042",
        incident_type="Structural Alert",
        impact="Temporary traffic restriction required after structural deterioration was detected.",
        resolved=False,
        incident_days_ago=3,
    ),
    Incident(
        asset_id="SG-017",
        incident_type="Pipeline Leak",
        impact="Short-term water supply disruption in the surrounding area.",
        resolved=True,
        incident_days_ago=14,
    ),
    Incident(
        asset_id="SG-063",
        incident_type="Traffic Impact",
        impact="Temporary lane restriction caused moderate traffic disruption.",
        resolved=True,
        incident_days_ago=20,
    ),
]


def seed_database():
    db = SessionLocal()

    try:
        # -------------------------
        # Assets
        # -------------------------
        for asset in assets:
            existing = db.get(Asset, asset.id)

            if existing is None:
                db.add(asset)

        db.commit()

        # -------------------------
        # Complaints
        # -------------------------
        existing_assets = {
            asset.id for asset in db.query(Asset).all()
        }

        for complaint in complaints:
            if complaint.asset_id in existing_assets:
                existing = (
                    db.query(Complaint)
                    .filter(
                        Complaint.asset_id == complaint.asset_id,
                        Complaint.description == complaint.description,
                    )
                    .first()
                )

                if existing is None:
                    db.add(complaint)

        # -------------------------
        # Inspections
        # -------------------------
        for inspection in inspections:
            existing = (
                db.query(Inspection)
                .filter(
                    Inspection.asset_id == inspection.asset_id,
                    Inspection.findings == inspection.findings,
                )
                .first()
            )

            if existing is None:
                db.add(inspection)

        # -------------------------
        # Maintenance Events
        # -------------------------
        for event in maintenance_events:
            existing = (
                db.query(MaintenanceEvent)
                .filter(
                    MaintenanceEvent.asset_id == event.asset_id,
                    MaintenanceEvent.description == event.description,
                )
                .first()
            )

            if existing is None:
                db.add(event)

        # -------------------------
        # Incidents
        # -------------------------
        for incident in incidents:
            existing = (
                db.query(Incident)
                .filter(
                    Incident.asset_id == incident.asset_id,
                    Incident.impact == incident.impact,
                )
                .first()
            )

            if existing is None:
                db.add(incident)

        db.commit()

        print("Database seeded successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()