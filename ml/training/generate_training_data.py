from pathlib import Path

import numpy as np
import pandas as pd


ROOT_DIR = Path(__file__).resolve().parents[2]

INPUT_FILE = ROOT_DIR / "data" / "processed" / "risk_features.csv"
OUTPUT_DIR = ROOT_DIR / "data" / "processed"
OUTPUT_FILE = OUTPUT_DIR / "training_data.csv"

RANDOM_SEED = 42
SAMPLES_PER_ASSET = 150


def clamp(value, minimum, maximum):
    return max(minimum, min(value, maximum))


def calculate_bootstrap_risk(row):
    # Complaint risk
    complaint_count = row["complaint_count"]

    if complaint_count > 0:
        complaint_score = min(
            100,
            (row["average_complaint_severity"] / 5) * 70
            + (min(complaint_count, 5) / 5) * 30,
        )
    else:
        complaint_score = 0

    # Inspection risk
    if row["inspection_count"] > 0:
        inspection_score = 100 - row["average_condition_score"]
    else:
        inspection_score = 50

    # Maintenance risk
    maintenance_score = min(
        100,
        row["maintenance_count"] * 20
        + row["recent_maintenance"] * 20,
    )

    # Incident risk
    incident_score = min(
        100,
        row["unresolved_incidents"] * 60
        + row["resolved_incidents"] * 20,
    )

    risk = (
        complaint_score * 0.30
        + inspection_score * 0.20
        + maintenance_score * 0.20
        + incident_score * 0.30
    )

    return round(clamp(risk, 0, 100), 2)


def generate_training_data():
    if not INPUT_FILE.exists():
        raise FileNotFoundError(
            f"Input dataset not found: {INPUT_FILE}"
        )

    base_df = pd.read_csv(INPUT_FILE)

    rng = np.random.default_rng(RANDOM_SEED)

    rows = []

    for _, base_row in base_df.iterrows():

        for _ in range(SAMPLES_PER_ASSET):

            row = base_row.copy()

            row["complaint_count"] = int(
                clamp(
                    round(
                        base_row["complaint_count"]
                        + rng.normal(0, 1.2)
                    ),
                    0,
                    8,
                )
            )

            row["average_complaint_severity"] = round(
                clamp(
                    base_row["average_complaint_severity"]
                    + rng.normal(0, 0.7),
                    0,
                    5,
                ),
                2,
            )

            row["recent_complaints"] = int(
                clamp(
                    round(
                        base_row["recent_complaints"]
                        + rng.normal(0, 1)
                    ),
                    0,
                    8,
                )
            )

            row["inspection_count"] = int(
                clamp(
                    round(
                        base_row["inspection_count"]
                        + rng.normal(0, 0.8)
                    ),
                    0,
                    5,
                )
            )

            row["average_condition_score"] = round(
                clamp(
                    base_row["average_condition_score"]
                    + rng.normal(0, 8),
                    0,
                    100,
                ),
                2,
            )

            row["maintenance_count"] = int(
                clamp(
                    round(
                        base_row["maintenance_count"]
                        + rng.normal(0, 1)
                    ),
                    0,
                    8,
                )
            )

            row["recent_maintenance"] = int(
                clamp(
                    round(
                        base_row["recent_maintenance"]
                        + rng.normal(0, 1)
                    ),
                    0,
                    8,
                )
            )

            row["total_maintenance_cost"] = round(
                max(
                    0,
                    base_row["total_maintenance_cost"]
                    + rng.normal(
                        0,
                        max(
                            10000,
                            base_row["total_maintenance_cost"] * 0.20,
                        ),
                    ),
                )
            )

            row["incident_count"] = int(
                clamp(
                    round(
                        base_row["incident_count"]
                        + rng.normal(0, 1)
                    ),
                    0,
                    6,
                )
            )

            row["unresolved_incidents"] = int(
                clamp(
                    round(
                        base_row["unresolved_incidents"]
                        + rng.normal(0, 0.7)
                    ),
                    0,
                    row["incident_count"],
                )
            )

            row["resolved_incidents"] = max(
                0,
                row["incident_count"]
                - row["unresolved_incidents"],
            )

            row["rule_based_risk"] = calculate_bootstrap_risk(row)

            rows.append(row)

    training_df = pd.DataFrame(rows)

    training_df.to_csv(
        OUTPUT_FILE,
        index=False,
    )

    print(
        f"Training dataset created successfully: {OUTPUT_FILE}"
    )

    print(f"Rows: {len(training_df)}")
    print(f"Columns: {len(training_df.columns)}")
    print()
    print(training_df.head(10).to_string(index=False))


if __name__ == "__main__":
    generate_training_data()