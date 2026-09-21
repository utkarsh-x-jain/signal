from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import (
    Asset,
    Complaint,
    Inspection,
    MaintenanceEvent,
    Incident,
    RiskSnapshot,
)
from app.services.risk_engine import calculate_risk_breakdown
from app.services.ml_risk_engine import predict_ml_risk
from app.services.alert_engine import evaluate_asset_alerts


router = APIRouter(
    prefix="/api/risk-snapshots",
    tags=["Risk Snapshots"],
)


@router.post("/{asset_id}")
def create_risk_snapshot(
    asset_id: str,
    db: Session = Depends(get_db),
):
    # -----------------------------------------
    # Find asset
    # -----------------------------------------

    asset = db.get(
        Asset,
        asset_id,
    )

    if asset is None:
        raise HTTPException(
            status_code=404,
            detail="Asset not found",
        )

    # -----------------------------------------
    # Load current signals
    # -----------------------------------------

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

    # -----------------------------------------
    # Rule-based risk
    # -----------------------------------------

    risk_breakdown = calculate_risk_breakdown(
        complaints=complaints,
        inspections=inspections,
        maintenance_events=maintenance_events,
        incidents=incidents,
    )

    rule_risk = risk_breakdown["overall"]

    # -----------------------------------------
    # ML risk
    # -----------------------------------------

    ml_risk = predict_ml_risk(
        complaints=complaints,
        inspections=inspections,
        maintenance_events=maintenance_events,
        incidents=incidents,
    )

    # -----------------------------------------
    # Save snapshot
    # -----------------------------------------

    snapshot = RiskSnapshot(
        asset_id=asset_id,
        rule_risk=rule_risk,
        ml_risk=ml_risk,
    )

    db.add(snapshot)
    db.commit()
    db.refresh(snapshot)

    # -----------------------------------------
    # Automatically evaluate alerts
    # -----------------------------------------

    created_alerts = evaluate_asset_alerts(
        asset_id=asset_id,
        db=db,
    )

    # -----------------------------------------
    # Response
    # -----------------------------------------

    return {
        "message": "Risk snapshot created successfully",
        "snapshot": {
            "id": snapshot.id,
            "asset_id": snapshot.asset_id,
            "rule_risk": snapshot.rule_risk,
            "ml_risk": snapshot.ml_risk,
            "captured_at": snapshot.captured_at,
        },
        "alerts_created": len(created_alerts),
        "alerts": [
            {
                "id": alert.id,
                "alert_type": alert.alert_type,
                "severity": alert.severity,
                "message": alert.message,
                "previous_risk": alert.previous_risk,
                "current_risk": alert.current_risk,
                "resolved": alert.resolved,
            }
            for alert in created_alerts
        ],
    }


@router.get("/{asset_id}")
def get_risk_snapshots(
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

    snapshots = (
        db.query(RiskSnapshot)
        .filter(
            RiskSnapshot.asset_id == asset_id
        )
        .order_by(
            RiskSnapshot.captured_at.asc()
        )
        .all()
    )

    return {
        "asset_id": asset_id,
        "count": len(snapshots),
        "snapshots": [
            {
                "id": snapshot.id,
                "rule_risk": snapshot.rule_risk,
                "ml_risk": snapshot.ml_risk,
                "captured_at": snapshot.captured_at,
            }
            for snapshot in snapshots
        ],
    }