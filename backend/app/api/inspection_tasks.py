from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Asset, InspectionTask


router = APIRouter(
    prefix="/api/inspection-tasks",
    tags=["Inspection Tasks"],
)


class InspectionTaskCreate(BaseModel):
    asset_id: str
    title: str
    priority: str = "Medium"
    reason: str


class InspectionTaskStatusUpdate(BaseModel):
    status: str


ALLOWED_STATUSES = {
    "Open",
    "In Progress",
    "Completed",
}


@router.post("/")
def create_inspection_task(
    task_data: InspectionTaskCreate,
    db: Session = Depends(get_db),
):
    asset = db.get(Asset, task_data.asset_id)

    if asset is None:
        raise HTTPException(
            status_code=404,
            detail="Asset not found",
        )

    task = InspectionTask(
        asset_id=task_data.asset_id,
        title=task_data.title,
        priority=task_data.priority,
        reason=task_data.reason,
        status="Open",
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return {
        "message": "Inspection task created successfully",
        "task": {
            "id": task.id,
            "asset_id": task.asset_id,
            "title": task.title,
            "priority": task.priority,
            "reason": task.reason,
            "status": task.status,
        },
    }


@router.get("/")
def get_inspection_tasks(
    db: Session = Depends(get_db),
):
    tasks = (
        db.query(InspectionTask)
        .order_by(InspectionTask.created_at.desc())
        .all()
    )

    return {
        "count": len(tasks),
        "tasks": [
            {
                "id": task.id,
                "asset_id": task.asset_id,
                "title": task.title,
                "priority": task.priority,
                "reason": task.reason,
                "status": task.status,
                "created_at": task.created_at,
            }
            for task in tasks
        ],
    }


@router.patch("/{task_id}")
def update_inspection_task_status(
    task_id: int,
    status_data: InspectionTaskStatusUpdate,
    db: Session = Depends(get_db),
):
    task = db.get(InspectionTask, task_id)

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Inspection task not found",
        )

    if status_data.status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid status. Allowed values: "
                "Open, In Progress, Completed."
            ),
        )

    task.status = status_data.status

    db.commit()
    db.refresh(task)

    return {
        "message": "Inspection task status updated successfully",
        "task": {
            "id": task.id,
            "asset_id": task.asset_id,
            "title": task.title,
            "priority": task.priority,
            "reason": task.reason,
            "status": task.status,
        },
    }