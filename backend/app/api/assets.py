from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import (
    Asset,
    Complaint,
    Inspection,
    MaintenanceEvent,
    Incident,
)
from app.services.risk_engine import calculate_risk_breakdown
from app.services.recommendation_engine import generate_recommendations
from app.services.ml_risk_engine import predict_ml_risk


router = APIRouter(
    prefix="/api/assets",
    tags=["Assets"],
)


def serialize_asset(asset: Asset) -> dict:
    return {
        "id": asset.id,
        "name": asset.name,
        "type": asset.type,
        "location": asset.location,
        "risk": asset.risk,
        "status": asset.status,
        "updated": asset.updated,
    }


def get_risk_status(score: float) -> str:
    if score >= 70:
        return "High"

    if score >= 40:
        return "Medium"

    return "Low"


def serialize_complaint(complaint: Complaint) -> dict:
    return {
        "id": complaint.id,
        "category": complaint.category,
        "severity": complaint.severity,
        "description": complaint.description,
        "reported_days_ago": complaint.reported_days_ago,
    }


def serialize_inspection(inspection: Inspection) -> dict:
    return {
        "id": inspection.id,
        "inspector": inspection.inspector,
        "condition_score": inspection.condition_score,
        "findings": inspection.findings,
        "inspection_days_ago": inspection.inspection_days_ago,
    }


def serialize_maintenance_event(
    event: MaintenanceEvent,
) -> dict:
    return {
        "id": event.id,
        "event_type": event.event_type,
        "cost": event.cost,
        "description": event.description,
        "maintenance_days_ago": event.maintenance_days_ago,
    }


def serialize_incident(incident: Incident) -> dict:
    return {
        "id": incident.id,
        "incident_type": incident.incident_type,
        "impact": incident.impact,
        "resolved": incident.resolved,
        "incident_days_ago": incident.incident_days_ago,
    }


def build_asset_intelligence(
    asset: Asset,
    complaints: list,
    inspections: list,
    maintenance_events: list,
    incidents: list,
) -> dict:

    # -----------------------------------------
    # Rule-based risk engine
    # -----------------------------------------

    risk_breakdown = calculate_risk_breakdown(
        complaints=complaints,
        inspections=inspections,
        maintenance_events=maintenance_events,
        incidents=incidents,
    )

    calculated_risk = risk_breakdown["overall"]

    # -----------------------------------------
    # ML risk prediction
    # -----------------------------------------

    ml_risk = predict_ml_risk(
        complaints=complaints,
        inspections=inspections,
        maintenance_events=maintenance_events,
        incidents=incidents,
    )

    # -----------------------------------------
    # Recommendations
    # -----------------------------------------

    recommendations = generate_recommendations(
        risk_breakdown=risk_breakdown,
        complaints=complaints,
        inspections=inspections,
        maintenance_events=maintenance_events,
        incidents=incidents,
    )

    # -----------------------------------------
    # Complete asset intelligence response
    # -----------------------------------------

    return {
        **serialize_asset(asset),

        # Existing stored risk
        "risk": asset.risk,

        # Rule-based intelligence
        "calculated_risk": calculated_risk,
        "calculated_status": get_risk_status(
            calculated_risk
        ),

        # ML intelligence
        "ml_risk": ml_risk,
        "ml_status": get_risk_status(ml_risk),

        # Explainable risk breakdown
        "risk_breakdown": risk_breakdown,

        # Recommended actions
        "recommendations": recommendations,

        # Signal summary
        "summary": {
            "complaints": len(complaints),
            "inspections": len(inspections),
            "maintenance_events": len(
                maintenance_events
            ),
            "incidents": len(incidents),
        },

        # Raw signal data
        "complaints": [
            serialize_complaint(complaint)
            for complaint in complaints
        ],

        "inspections": [
            serialize_inspection(inspection)
            for inspection in inspections
        ],

        "maintenance_events": [
            serialize_maintenance_event(event)
            for event in maintenance_events
        ],

        "incidents": [
            serialize_incident(incident)
            for incident in incidents
        ],
    }


# ==========================================================
# GET ALL ASSETS
# ==========================================================

@router.get("/")
def get_assets(
    db: Session = Depends(get_db),
):
    assets = (
        db.query(Asset)
        .order_by(Asset.id)
        .all()
    )

    if not assets:
        return {
            "count": 0,
            "assets": [],
        }

    asset_ids = [
        asset.id
        for asset in assets
    ]

    # -----------------------------------------
    # Bulk-load all related signals
    # -----------------------------------------

    complaints = (
        db.query(Complaint)
        .filter(
            Complaint.asset_id.in_(asset_ids)
        )
        .all()
    )

    inspections = (
        db.query(Inspection)
        .filter(
            Inspection.asset_id.in_(asset_ids)
        )
        .all()
    )

    maintenance_events = (
        db.query(MaintenanceEvent)
        .filter(
            MaintenanceEvent.asset_id.in_(asset_ids)
        )
        .all()
    )

    incidents = (
        db.query(Incident)
        .filter(
            Incident.asset_id.in_(asset_ids)
        )
        .all()
    )

    # -----------------------------------------
    # Group signals by asset
    # -----------------------------------------

    complaints_by_asset = defaultdict(list)
    inspections_by_asset = defaultdict(list)
    maintenance_by_asset = defaultdict(list)
    incidents_by_asset = defaultdict(list)

    for complaint in complaints:
        complaints_by_asset[
            complaint.asset_id
        ].append(complaint)

    for inspection in inspections:
        inspections_by_asset[
            inspection.asset_id
        ].append(inspection)

    for event in maintenance_events:
        maintenance_by_asset[
            event.asset_id
        ].append(event)

    for incident in incidents:
        incidents_by_asset[
            incident.asset_id
        ].append(incident)

    # -----------------------------------------
    # Build intelligence
    # -----------------------------------------

    enriched_assets = []

    for asset in assets:
        enriched_assets.append(
            build_asset_intelligence(
                asset=asset,
                complaints=complaints_by_asset[
                    asset.id
                ],
                inspections=inspections_by_asset[
                    asset.id
                ],
                maintenance_events=maintenance_by_asset[
                    asset.id
                ],
                incidents=incidents_by_asset[
                    asset.id
                ],
            )
        )

    return {
        "count": len(enriched_assets),
        "assets": enriched_assets,
    }


# ==========================================================
# GET SINGLE ASSET
# ==========================================================

@router.get("/{asset_id}")
def get_asset(
    asset_id: str,
    db: Session = Depends(get_db),
):
    asset = db.get(
        Asset,
        asset_id,
    )

    if asset is None:
        raise HTTPException(
            status_code=404,
            detail="Asset not found",
        )

    complaints = (
        db.query(Complaint)
        .filter(
            Complaint.asset_id == asset_id
        )
        .all()
    )

    inspections = (
        db.query(Inspection)
        .filter(
            Inspection.asset_id == asset_id
        )
        .all()
    )

    maintenance_events = (
        db.query(MaintenanceEvent)
        .filter(
            MaintenanceEvent.asset_id == asset_id
        )
        .all()
    )

    incidents = (
        db.query(Incident)
        .filter(
            Incident.asset_id == asset_id
        )
        .all()
    )

    return build_asset_intelligence(
        asset=asset,
        complaints=complaints,
        inspections=inspections,
        maintenance_events=maintenance_events,
        incidents=incidents,
    )