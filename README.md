# 🚦 Signal

### AI-Powered Infrastructure Risk Monitoring & Early-Warning Platform

> **Detect the warning before failure.**

Signal is an infrastructure intelligence platform designed to help organizations monitor infrastructure assets, combine multiple warning signals, calculate explainable risk, and identify assets that may require attention before failure occurs.

Instead of looking at complaints, inspections, maintenance events, and incidents separately, Signal brings them together into a unified intelligence layer.

### Core Capabilities

- 🧠 Explainable rule-based risk analysis
- 🤖 Machine-learning risk intelligence
- 🚨 Automated risk alerts
- 📝 Inspection task management
- 📈 Historical risk tracking
- 🗺️ Infrastructure risk visualization
- 📄 PDF reporting
- 🔎 Asset search and filtering

---

# 🌍 The Problem

Infrastructure problems rarely appear without warning.

Before a bridge, pipeline, electrical junction, road section, or similar asset becomes critical, multiple signals may already exist:

- 📝 Repeated public complaints
- ⚠️ Increasing complaint severity
- 🔍 Poor inspection results
- 🔧 Repeated maintenance activity
- 🚨 Previous incidents
- 📉 Deteriorating asset condition
- 🔴 Unresolved infrastructure events

The problem is that these signals often exist separately and are difficult to interpret together.

### Signal's Approach

Signal creates a centralized intelligence layer that answers three important questions:

```text
1. What is happening?
2. How risky is the asset?
3. What should be investigated next?
```

---

# 🎯 Project Goal

The goal of Signal is not simply to display infrastructure data.

The platform transforms raw infrastructure signals into an actionable monitoring workflow:

```text
Raw Signals
     ↓
Risk Analysis
     ↓
ML Intelligence
     ↓
Recommendations
     ↓
Alerts
     ↓
Inspection Actions
     ↓
Historical Monitoring
```

This creates a complete monitoring workflow instead of a static dashboard.

---

# ✨ Key Features

## 🏗️ 1. Infrastructure Asset Monitoring

Signal monitors infrastructure assets through a centralized dashboard.

Each asset can contain:

- Asset ID
- Asset name
- Infrastructure type
- District
- Stored risk
- Calculated risk
- ML risk
- Current status
- Historical signals

Example:

```text
SG-042
Central Bridge
Type: Bridge
Location: North District
```

---

## 🧮 2. Explainable Risk Engine

Signal uses an explainable rule-based risk engine.

Instead of producing only one risk number, the engine breaks risk into multiple contributing factors.

### Current Risk Weights

| Signal Category | Weight |
|---|---:|
| 📝 Complaints | 30% |
| 🔍 Inspections | 20% |
| 🔧 Maintenance | 20% |
| 🚨 Incidents | 30% |

The system produces:

```text
Overall Risk
│
├── Complaint Contribution
├── Inspection Contribution
├── Maintenance Contribution
└── Incident Contribution
```

This makes the risk score easier to understand and audit.

---

# 🤖 3. Machine Learning Risk Intelligence

Signal includes a machine-learning layer that provides an additional risk signal alongside the explainable rule-based system.

The current prototype uses:

```text
GradientBoostingRegressor
```

The model uses 11 infrastructure features:

```text
complaint_count
average_complaint_severity
recent_complaints
inspection_count
average_condition_score
maintenance_count
recent_maintenance
total_maintenance_cost
incident_count
unresolved_incidents
resolved_incidents
```

### ML Pipeline

```text
Infrastructure Data
        ↓
Feature Preparation
        ↓
Training Dataset
        ↓
Model Comparison
        ↓
Best Model Selection
        ↓
Gradient Boosting
        ↓
Joblib Model Artifact
        ↓
Backend ML Risk Engine
```

---

# ⚖️ 4. Rule-Based + ML Risk

Signal provides two perspectives for an asset.

### 🧠 Rule-Based Risk

- Explainable
- Deterministic
- Signal-driven
- Easy to audit

### 🤖 ML Risk

- Feature-driven
- Pattern-oriented
- Provides an additional intelligence signal

Example:

```text
Calculated Risk: 59.2
ML Risk:         60.0
```

The two values can be compared directly within the platform.

---

# 🚨 5. Automated Alerts

Signal includes an alert engine that evaluates risk snapshots and detects important changes.

### 📈 Rising Risk

Generated when risk increases significantly compared with the previous snapshot.

### 🔴 High Risk

Generated when the current risk crosses the configured high-risk threshold.

Alerts contain:

- Asset ID
- Alert type
- Severity
- Message
- Previous risk
- Current risk
- Resolution status
- Timestamp

Alerts can be resolved directly from the dashboard.

---

# 📝 6. Inspection Task Management

Risk detection becomes more useful when it leads to action.

Signal converts infrastructure intelligence into inspection tasks.

Each task contains:

```text
Asset
 ↓
Inspection Title
 ↓
Priority
 ↓
Reason
 ↓
Status
```

Supported statuses:

```text
Open
In Progress
Completed
```

This creates a direct workflow:

```text
Risk Detection → Investigation → Operational Action
```

---

# 📈 7. Risk History

Signal stores historical risk snapshots for monitored assets.

Each snapshot contains:

- Rule-based risk
- ML risk
- Timestamp

This enables users to observe how risk changes over time.

Example:

```text
Risk
80 ┤
70 ┤
60 ┤        ●
50 ┤    ●
40 ┤
30 ┤
20 ┤
   └────────────────────
              Time →
```

The Asset Details page uses these snapshots to display risk history.

---

# 🧠 8. Asset Intelligence

Each asset receives a detailed intelligence profile containing:

### Risk

- Stored risk
- Calculated risk
- ML risk
- Risk status

### Risk Breakdown

- Complaint score
- Inspection score
- Maintenance score
- Incident score
- Individual contributions

### Signals

- Complaints
- Inspections
- Maintenance events
- Incidents

### Recommendations

Signal generates recommendations based on the asset's current signal profile.

Examples:

```text
Schedule a detailed infrastructure review.

Investigate recurring infrastructure complaints.

Continue scheduled condition assessments.

Review maintenance history and upcoming work.

Investigate unresolved infrastructure incidents.
```

---

# 🖥️ 9. Command Dashboard

The Signal dashboard acts as the main monitoring center.

It provides:

- 📊 Assets monitored
- 📡 Active signals
- 🔴 High-risk assets
- 💚 Network health
- 🤖 ML analyzed assets
- 📍 Infrastructure risk visualization
- 🚨 Active alerts
- 📝 Inspection tasks
- 🔎 Asset search
- 🎚️ Risk filtering
- 📄 Network report export

The dashboard allows users to move through:

```text
Network → Asset → Risk → Signals → Action
```

---

# 🗺️ 10. Infrastructure Risk Visualization

The dashboard includes a geographic-style visualization of monitored assets.

Each asset can be selected to inspect its current risk and navigate to its detailed intelligence page.

This provides a more spatial view of infrastructure risk instead of relying only on tables.

---

# 📄 11. PDF Reporting

Signal supports browser-based PDF reporting.

## Individual Asset Reports

Reports can contain:

- Asset information
- Risk overview
- Risk breakdown
- Risk history
- Recommendations
- Signal history
- Inspection history
- Maintenance history

## Network Reports

Reports can contain:

- Network KPIs
- Risk distribution
- Active alerts
- Inspection tasks
- Asset risk summary

Reports are optimized for browser print-to-PDF workflows.

---

# 🎨 12. Modern Frontend Experience

The frontend focuses on a clean and interactive monitoring experience.

It includes:

- ✨ Motion-based transitions
- 🎯 Scroll reveal animations
- 🖱️ Custom cursor
- 🧩 Reusable components
- 📱 Responsive layout
- 🌙 Dark interface
- 🧭 React routing
- 🎛️ Interactive dashboard controls

Major website sections are separated into reusable components for maintainability.

---

# 🏗️ System Architecture

```mermaid
flowchart TD

    U[👤 User]

    U --> F[React + Vite Frontend]

    F --> H[Home]
    F --> D[Dashboard]
    F --> A[Asset Details]

    D --> API[FastAPI Backend]
    A --> API

    API --> AS[Asset API]
    API --> RS[Risk Snapshot API]
    API --> AL[Alert API]
    API --> IT[Inspection Task API]

    AS --> DB[(PostgreSQL)]
    RS --> DB
    AL --> DB
    IT --> DB

    API --> RE[Rule Risk Engine]
    API --> MLE[ML Risk Engine]
    API --> AE[Alert Engine]
    API --> REC[Recommendation Engine]

    MLE --> MODEL[Gradient Boosting Model]

    TRAIN[ML Training Pipeline] --> MODEL
    TRAIN --> DATA[Processed Training Data]
```

---

# 🔄 End-to-End Workflow

```mermaid
sequenceDiagram

    participant User
    participant Frontend
    participant Backend
    participant RiskEngine
    participant MLEngine
    participant Database
    participant AlertEngine

    User->>Frontend: Open Dashboard
    Frontend->>Backend: Fetch Assets

    Backend->>Database: Load Signals
    Database-->>Backend: Complaints / Inspections / Maintenance / Incidents

    Backend->>RiskEngine: Calculate Rule Risk
    RiskEngine-->>Backend: Risk + Breakdown

    Backend->>MLEngine: Generate ML Risk
    MLEngine-->>Backend: ML Risk

    Backend-->>Frontend: Asset Intelligence

    User->>Frontend: Capture Risk Snapshot
    Frontend->>Backend: POST Snapshot

    Backend->>Database: Save Snapshot
    Backend->>AlertEngine: Evaluate Risk Change

    AlertEngine-->>Backend: Alert Result
    Backend-->>Frontend: Snapshot + Alerts
```

---

# 🧰 Technology Stack

## 🎨 Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- React Router

## ⚙️ Backend

- Python
- FastAPI
- SQLAlchemy
- Uvicorn
- python-dotenv

## 🗄️ Database

- PostgreSQL 16

## 🤖 Machine Learning

- Python
- Pandas
- Scikit-learn
- Joblib
- GradientBoostingRegressor

## 🐳 Infrastructure

- Docker
- Docker Compose

## 🔀 Version Control

- Git
- GitHub

---

# 📁 Project Structure

```text
signal/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Footer.jsx
│   │   │   │
│   │   │   ├── home/
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── Problem.jsx
│   │   │   │   ├── HowItWorks.jsx
│   │   │   │   ├── RiskPreview.jsx
│   │   │   │   └── CTA.jsx
│   │   │   │
│   │   │   └── ui/
│   │   │       ├── Button.jsx
│   │   │       ├── Cursor.jsx
│   │   │       └── ScrollReveal.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AssetDetails.jsx
│   │   │
│   │   ├── services/
│   │   │   └── assetService.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── assets.py
│   │   │   ├── alerts.py
│   │   │   ├── inspection_tasks.py
│   │   │   └── risk_snapshots.py
│   │   │
│   │   ├── models/
│   │   │   ├── asset.py
│   │   │   ├── complaint.py
│   │   │   ├── inspection.py
│   │   │   ├── maintenance_event.py
│   │   │   ├── incident.py
│   │   │   ├── inspection_task.py
│   │   │   ├── risk_snapshot.py
│   │   │   └── alert.py
│   │   │
│   │   ├── services/
│   │   │   ├── risk_engine.py
│   │   │   ├── ml_risk_engine.py
│   │   │   ├── alert_engine.py
│   │   │   └── recommendation_engine.py
│   │   │
│   │   ├── database.py
│   │   ├── seed.py
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
├── data/
│   └── processed/
│       ├── risk_features.csv
│       └── training_data.csv
│
├── ml/
│   ├── training/
│   │   ├── prepare_dataset.py
│   │   ├── generate_training_data.py
│   │   ├── train_model.py
│   │   └── evaluate_model.py
│   │
│   ├── models/
│   │   ├── risk_model.joblib
│   │   └── model_info.json
│   │
│   └── README.md
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# 🧮 Risk Calculation

For the current prototype, the rule-based risk is composed from four signal categories.

```text
Risk =
    Complaint Score × 0.30
  + Inspection Score × 0.20
  + Maintenance Score × 0.20
  + Incident Score × 0.30
```

For example, SG-042 currently produces:

```text
Complaint Component      → 69.3
Inspection Component     → 42.0
Maintenance Component    → 60.0
Incident Component       → 60.0
```

Result:

```text
Calculated Risk → 59.2
```

Risk is then classified into:

```text
Low
Medium
High
```

according to the configured thresholds.

---

# 🤖 Machine Learning Experiments

The ML training pipeline compares multiple regression models.

| Model | MAE | R² |
|---|---:|---:|
| Linear Regression | 2.5267 | 0.9670 |
| Random Forest | 3.0776 | 0.9501 |
| Gradient Boosting | 2.0830 | 0.9778 |

The prototype selected Gradient Boosting based on these validation metrics.

### ⚠️ Important ML Note

The current training dataset is a bootstrap/synthetic dataset created for the prototype, and its target is based on the rule-based risk system.

Therefore:

> The current ML metrics should not be interpreted as real-world infrastructure failure prediction accuracy.

The ML model currently demonstrates the architecture and integration of an additional machine-learning intelligence layer.

For a production system, the model should be retrained using validated real-world infrastructure condition and failure data.

---

# 🏙️ Sample Infrastructure Network

The prototype currently includes:

| ID | Asset | Type | District |
|---|---|---|---|
| SG-042 | Central Bridge | Bridge | North District |
| SG-017 | Water Main 17 | Pipeline | West District |
| SG-063 | East Overpass | Bridge | East District |
| SG-091 | Grid Junction | Electrical | South District |

---

# 🔌 API Reference

## ❤️ Health

```http
GET /api/health
```

Example:

```json
{
  "status": "healthy",
  "service": "signal-backend"
}
```

## 🏗️ Assets

```http
GET /api/assets/
GET /api/assets/{asset_id}
```

Provides:

- Asset information
- Calculated risk
- ML risk
- Risk breakdown
- Recommendations
- Complaints
- Inspections
- Maintenance events
- Incidents

## 📝 Inspection Tasks

```http
GET /api/inspection-tasks/
POST /api/inspection-tasks/
PATCH /api/inspection-tasks/{task_id}
```

## 📈 Risk Snapshots

```http
GET /api/risk-snapshots/{asset_id}
POST /api/risk-snapshots/{asset_id}
```

## 🚨 Alerts

```http
GET /api/alerts/
POST /api/alerts/evaluate/{asset_id}
PATCH /api/alerts/{alert_id}/resolve
```

---

# 🛠️ Local Development

## 📋 Prerequisites

Install:

- Node.js
- Python 3
- Docker Desktop
- Git

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/utkarsh-x-jain/signal.git
cd signal
```

---

## 2️⃣ Start PostgreSQL

From the project root:

```bash
docker compose up -d db
```

PostgreSQL is exposed locally on:

```text
127.0.0.1:5433
```

---

## 3️⃣ Configure Backend

Create:

```text
backend/.env
```

Add:

```env
DATABASE_URL=postgresql+psycopg2://signal:signal@127.0.0.1:5433/signal
```

> ⚠️ Never commit `.env` files or database credentials.

---

## 4️⃣ Install Backend Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
```

---

## 5️⃣ Start Backend

```bash
python -m uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Health check:

```bash
curl http://127.0.0.1:8000/api/health
```

---

## 6️⃣ Start Frontend

Open another terminal:

```bash
cd signal/frontend
npm install
npm run dev
```

Then open the Vite development URL shown in the terminal.

---

# 🧪 Backend Validation

The main backend workflows have been smoke-tested:

```text
✅ Health API
✅ Assets API
✅ Single Asset API
✅ PostgreSQL Integration
✅ Rule-Based Risk Engine
✅ ML Model Loading
✅ Risk Snapshot Creation
✅ Risk History Retrieval
✅ Alert API
✅ Inspection Task API
✅ Recommendation Engine
```

The ML service was also verified to load:

```text
MODEL: GradientBoostingRegressor
```

with the configured 11 infrastructure features.

---

# 🗄️ Database Architecture

Signal uses an asset-centric relational design.

```text
Asset
│
├── Complaint
├── Inspection
├── MaintenanceEvent
├── Incident
├── InspectionTask
├── RiskSnapshot
└── Alert
```

This allows infrastructure signals to remain modular while still being connected through the asset they belong to.

---

# 🔐 Security & Production Considerations

Current prototype practices include:

- Environment variables for database configuration
- `.env` files excluded from Git
- SQLAlchemy database access
- FastAPI route separation
- Frontend/backend separation

A production deployment should additionally consider:

- 🔐 Authentication
- 👥 Role-based access control
- 🛡️ API rate limiting
- 🔑 Secure secret management
- 🔒 HTTPS
- 🗃️ Database migrations
- 📋 Audit logging
- 📊 Monitoring and observability

---

# 📊 Example Asset Intelligence

For SG-042:

```text
┌─────────────────────────────────────┐
│ Central Bridge                      │
│ SG-042                              │
├─────────────────────────────────────┤
│ Rule Risk        59.2  Medium       │
│ ML Risk          60.0  Medium       │
├─────────────────────────────────────┤
│ Complaints       3                  │
│ Inspections      1                  │
│ Maintenance      2                  │
│ Incidents        1                  │
├─────────────────────────────────────┤
│ Recommended Action                  │
│ Schedule detailed infrastructure    │
│ review                              │
└─────────────────────────────────────┘
```

---

# 🎯 Design Principles

## 1. 🔍 Explainability

Risk should not simply be a number.

Users should be able to understand which signals contributed to it.

## 2. ⚡ Actionability

Detection without action has limited value.

Signal converts intelligence into:

```text
Recommendations
      ↓
Inspection Tasks
      ↓
Operational Follow-up
```

## 3. 📈 Continuous Monitoring

Infrastructure risk changes over time.

Signal stores historical snapshots so users can observe risk trends rather than relying on a single static value.

## 4. 🧩 Modularity

Frontend components, backend APIs, services, database models, and ML training are separated into dedicated modules.

This makes the system easier to:

- Maintain
- Debug
- Extend
- Test
- Explain

---

# 🚀 Future Scope

### 🌐 Data Integration

- Real-time IoT sensor streams
- Government infrastructure datasets
- GIS systems
- Field inspection applications
- Citizen reporting systems

### 🤖 Advanced AI

- Time-series risk forecasting
- Failure probability prediction
- Anomaly detection
- Predictive maintenance
- NLP-based incident analysis
- Computer vision for infrastructure inspection

### 🗺️ GIS Intelligence

- Real geospatial maps
- Infrastructure network layers
- Geographic risk clustering
- Route-level risk analysis
- District-level risk monitoring

### 📱 Field Operations

- Mobile inspection workflows
- Inspector assignments
- Offline inspection mode
- Image uploads
- QR-based asset identification

### 🔔 Notifications

- Email notifications
- SMS alerts
- Slack / Teams integrations
- Escalation workflows

### ☁️ Production Infrastructure

- Cloud deployment
- Managed PostgreSQL
- CI/CD
- Monitoring
- Centralized logging
- Automated ML retraining

---

# 🏁 Project Status

## 🚧 Working Prototype

Signal currently demonstrates this end-to-end workflow:

```text
🏗️ Infrastructure Assets
          ↓
📡 Signals
          ↓
🧮 Explainable Risk Engine
          ↓
🤖 ML Intelligence
          ↓
💡 Recommendations
          ↓
🚨 Alerts
          ↓
📝 Inspection Tasks
          ↓
📈 Historical Monitoring
          ↓
📄 Reports
```

---

# 💡 What This Project Demonstrates

Signal brings together multiple software engineering and AI concepts:

```text
Frontend Development
        +
Backend APIs
        +
Database Design
        +
Machine Learning
        +
Data Processing
        +
Risk Modeling
        +
Automation
        +
Reporting
        +
Docker
        +
Git/GitHub
```

The project demonstrates how a full-stack application can combine explainable business logic with machine-learning intelligence to create a practical monitoring workflow.

---

# 👨‍💻 Author

## Utkarsh Jain

🎓 BTech — Computer Science & Artificial Intelligence

🔗 GitHub:  
https://github.com/utkarsh-x-jain

📦 Project Repository:  
https://github.com/utkarsh-x-jain/signal

---

# ⭐ Support

If you find the project interesting, consider giving the repository a ⭐ on GitHub.

---

# 📜 License

This project is intended for educational, portfolio, prototype, and hackathon development purposes.

---

# 🖼️ Screenshots

### 🏠 Landing Page

![Signal Landing Page](screenshots/home.png)

### 📊 Infrastructure Command Center

![Signal Dashboard](screenshots/dashboard.png)

### 🧠 Asset Intelligence

![Signal Asset Details](screenshots/asset-details.png)

---

# 🎥 Product Flow

```text
🏠 Landing Page
      ↓
📊 Command Center
      ↓
🏗️ Select Infrastructure Asset
      ↓
🧠 Risk Intelligence
      ↓
🚨 Alerts & Recommendations
      ↓
📝 Inspection Action
```
