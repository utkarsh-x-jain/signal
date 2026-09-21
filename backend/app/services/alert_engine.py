from sqlalchemy.orm import Session

from app.models import Alert, RiskSnapshot


RISING_RISK_THRESHOLD = 10.0
HIGH_RISK_THRESHOLD = 70.0


def evaluate_asset_alerts(
    asset_id: str,
    db: Session,
):
    snapshots = (
        db.query(RiskSnapshot)
        .filter(
            RiskSnapshot.asset_id == asset_id
        )
        .order_by(
            RiskSnapshot.captured_at.desc()
        )
        .limit(2)
        .all()
    )

    if not snapshots:
        return []

    latest = snapshots[0]

    previous = (
        snapshots[1]
        if len(snapshots) > 1
        else None
    )

    created_alerts = []

    # --------------------------------------------------
    # Rising risk alert
    # --------------------------------------------------

    if previous is not None:
        risk_change = (
            latest.rule_risk
            - previous.rule_risk
        )

        if risk_change >= RISING_RISK_THRESHOLD:
            existing_alert = (
                db.query(Alert)
                .filter(
                    Alert.asset_id == asset_id,
                    Alert.alert_type == "RISING_RISK",
                    Alert.resolved.is_(False),
                )
                .first()
            )

            if existing_alert is None:
                severity = (
                    "High"
                    if latest.rule_risk >= HIGH_RISK_THRESHOLD
                    else "Medium"
                )

                alert = Alert(
                    asset_id=asset_id,
                    alert_type="RISING_RISK",
                    severity=severity,
                    message=(
                        f"Risk increased by "
                        f"{risk_change:.1f} points "
                        f"from {previous.rule_risk:.1f}% "
                        f"to {latest.rule_risk:.1f}%."
                    ),
                    previous_risk=previous.rule_risk,
                    current_risk=latest.rule_risk,
                    resolved=False,
                )

                db.add(alert)
                created_alerts.append(alert)

    # --------------------------------------------------
    # High risk alert
    # --------------------------------------------------

    if latest.rule_risk >= HIGH_RISK_THRESHOLD:
        existing_alert = (
            db.query(Alert)
            .filter(
                Alert.asset_id == asset_id,
                Alert.alert_type == "HIGH_RISK",
                Alert.resolved.is_(False),
            )
            .first()
        )

        if existing_alert is None:
            alert = Alert(
                asset_id=asset_id,
                alert_type="HIGH_RISK",
                severity="High",
                message=(
                    f"Asset risk is currently "
                    f"{latest.rule_risk:.1f}%."
                ),
                previous_risk=(
                    previous.rule_risk
                    if previous
                    else latest.rule_risk
                ),
                current_risk=latest.rule_risk,
                resolved=False,
            )

            db.add(alert)
            created_alerts.append(alert)

    if created_alerts:
        db.commit()

        for alert in created_alerts:
            db.refresh(alert)

    return created_alerts