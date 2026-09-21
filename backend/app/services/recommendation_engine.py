def generate_recommendations(
    risk_breakdown,
    complaints,
    inspections,
    maintenance_events,
    incidents,
):
    recommendations = []

    overall_risk = risk_breakdown["overall"]

    # -------------------------
    # Overall risk
    # -------------------------
    if overall_risk >= 70:
        recommendations.append(
            {
                "priority": "High",
                "action": "Schedule an immediate infrastructure inspection.",
                "reason": "Overall calculated risk is high.",
            }
        )
    elif overall_risk >= 40:
        recommendations.append(
            {
                "priority": "Medium",
                "action": "Schedule a detailed infrastructure review.",
                "reason": "Overall calculated risk is elevated.",
            }
        )
    else:
        recommendations.append(
            {
                "priority": "Low",
                "action": "Continue routine monitoring.",
                "reason": "Overall calculated risk is currently low.",
            }
        )

    # -------------------------
    # Complaint signals
    # -------------------------
    complaint_score = risk_breakdown["components"]["complaints"]

    if complaint_score >= 60:
        recommendations.append(
            {
                "priority": "High",
                "action": "Investigate recurring infrastructure complaints.",
                "reason": "Complaint severity and volume are contributing significantly to risk.",
            }
        )
    elif complaints:
        recommendations.append(
            {
                "priority": "Medium",
                "action": "Review recent infrastructure complaints.",
                "reason": "Reported complaints are contributing to the risk profile.",
            }
        )

    # -------------------------
    # Inspection signals
    # -------------------------
    inspection_score = risk_breakdown["components"]["inspections"]

    if inspection_score >= 50:
        recommendations.append(
            {
                "priority": "High",
                "action": "Perform a condition-focused inspection.",
                "reason": "Inspection results indicate degraded asset condition.",
            }
        )
    elif inspections:
        recommendations.append(
            {
                "priority": "Medium",
                "action": "Continue scheduled condition assessments.",
                "reason": "Inspection history is influencing the risk profile.",
            }
        )

    # -------------------------
    # Maintenance signals
    # -------------------------
    recent_maintenance = sum(
        1
        for event in maintenance_events
        if event.maintenance_days_ago <= 30
    )

    if recent_maintenance >= 2:
        recommendations.append(
            {
                "priority": "High",
                "action": "Review repeated recent maintenance activity.",
                "reason": "Multiple recent maintenance events indicate recurring intervention.",
            }
        )
    elif maintenance_events:
        recommendations.append(
            {
                "priority": "Medium",
                "action": "Review maintenance history and upcoming work.",
                "reason": "Maintenance activity is part of the current risk profile.",
            }
        )

    # -------------------------
    # Incident signals
    # -------------------------
    unresolved_incidents = [
        incident
        for incident in incidents
        if not incident.resolved
    ]

    if unresolved_incidents:
        recommendations.append(
            {
                "priority": "High",
                "action": "Investigate unresolved infrastructure incidents.",
                "reason": "One or more incidents remain unresolved.",
            }
        )

    # -------------------------
    # Limit duplicate / excessive recommendations
    # -------------------------
    return recommendations[:5]