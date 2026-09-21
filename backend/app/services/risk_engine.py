def calculate_risk_breakdown(
    complaints,
    inspections,
    maintenance_events,
    incidents,
):
    """
    Calculate an explainable infrastructure risk score.

    Returns:
        overall risk score
        component scores
        weighted contributions
    """

    # -------------------------
    # 1. Complaint Risk
    # Weight: 30%
    # -------------------------
    if complaints:
        average_severity = sum(
            complaint.severity for complaint in complaints
        ) / len(complaints)

        complaint_volume = min(len(complaints), 5) / 5

        complaint_score = min(
            100,
            (average_severity / 5) * 70
            + complaint_volume * 30,
        )
    else:
        complaint_score = 0

    # -------------------------
    # 2. Inspection Risk
    # Weight: 20%
    # -------------------------
    if inspections:
        average_condition = sum(
            inspection.condition_score
            for inspection in inspections
        ) / len(inspections)

        inspection_score = 100 - average_condition
    else:
        inspection_score = 50

    # -------------------------
    # 3. Maintenance Risk
    # Weight: 20%
    # -------------------------
    if maintenance_events:
        recent_maintenance = sum(
            1
            for event in maintenance_events
            if event.maintenance_days_ago <= 30
        )

        maintenance_score = min(
            100,
            len(maintenance_events) * 20
            + recent_maintenance * 20,
        )
    else:
        maintenance_score = 0

    # -------------------------
    # 4. Incident Risk
    # Weight: 30%
    # -------------------------
    if incidents:
        unresolved_incidents = sum(
            1
            for incident in incidents
            if not incident.resolved
        )

        resolved_incidents = len(incidents) - unresolved_incidents

        incident_score = min(
            100,
            unresolved_incidents * 60
            + resolved_incidents * 20,
        )
    else:
        incident_score = 0

    # -------------------------
    # Weighted contribution
    # -------------------------
    complaint_contribution = complaint_score * 0.30
    inspection_contribution = inspection_score * 0.20
    maintenance_contribution = maintenance_score * 0.20
    incident_contribution = incident_score * 0.30

    # -------------------------
    # Final risk
    # -------------------------
    overall_risk = (
        complaint_contribution
        + inspection_contribution
        + maintenance_contribution
        + incident_contribution
    )

    return {
        "overall": round(
            min(100, max(0, overall_risk)),
            1,
        ),
        "components": {
            "complaints": round(complaint_score, 1),
            "inspections": round(inspection_score, 1),
            "maintenance": round(maintenance_score, 1),
            "incidents": round(incident_score, 1),
        },
        "contributions": {
            "complaints": round(complaint_contribution, 1),
            "inspections": round(inspection_contribution, 1),
            "maintenance": round(maintenance_contribution, 1),
            "incidents": round(incident_contribution, 1),
        },
    }


def calculate_risk(
    complaints,
    inspections,
    maintenance_events,
    incidents,
):
    """
    Backward-compatible helper that returns
    only the final risk score.
    """

    breakdown = calculate_risk_breakdown(
        complaints=complaints,
        inspections=inspections,
        maintenance_events=maintenance_events,
        incidents=incidents,
    )

    return breakdown["overall"]