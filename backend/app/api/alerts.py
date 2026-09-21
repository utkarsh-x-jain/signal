from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Alert, Asset
from app.services.alert_engine import (
    evaluate_asset_alerts,
)


router = APIRouter(
    prefix="/api/alerts",
    tags=["Alerts"],
)


# ==========================================================
# EVALUATE ALERTS FOR ASSET
# ==========================================================

@router.post("/evaluate/{asset_id}")
def evaluate_alerts(
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

    created_alerts = evaluate_asset_alerts(
        asset_id=asset_id,
        db=db,
    )

    return {
        "asset_id": asset_id,
        "created": len(created_alerts),
        "alerts": [
            {
                "id": alert.id,
                "alert_type": alert.alert_type,
                "severity": alert.severity,
                "message": alert.message,
                "previous_risk": alert.previous_risk,
                "current_risk": alert.current_risk,
                "resolved": alert.resolved,
                "created_at": alert.created_at,
            }
            for alert in created_alerts
        ],
    }


# ==========================================================
# GET ALL ALERTS
# ==========================================================

@router.get("/")
def get_alerts(
    resolved: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Alert)

    if resolved is not None:
        query = query.filter(
            Alert.resolved == resolved
        )

    alerts = (
        query
        .order_by(Alert.created_at.desc())
        .all()
    )

    return {
        "count": len(alerts),
        "alerts": [
            {
                "id": alert.id,
                "asset_id": alert.asset_id,
                "alert_type": alert.alert_type,
                "severity": alert.severity,
                "message": alert.message,
                "previous_risk": alert.previous_risk,
                "current_risk": alert.current_risk,
                "resolved": alert.resolved,
                "created_at": alert.created_at,
            }
            for alert in alerts
        ],
    }


# ==========================================================
# RESOLVE ALERT
# ==========================================================

@router.patch("/{alert_id}/resolve")
def resolve_alert(
    alert_id: int,
    db: Session = Depends(get_db),
):
    alert = db.get(
        Alert,
        alert_id,
    )

    if alert is None:
        raise HTTPException(
            status_code=404,
            detail="Alert not found",
        )

    alert.resolved = True

    db.commit()
    db.refresh(alert)

    return {
        "message": "Alert resolved successfully",
        "alert": {
            "id": alert.id,
            "asset_id": alert.asset_id,
            "alert_type": alert.alert_type,
            "severity": alert.severity,
            "message": alert.message,
            "previous_risk": alert.previous_risk,
            "current_risk": alert.current_risk,
            "resolved": alert.resolved,
            "created_at": alert.created_at,
        },
    }