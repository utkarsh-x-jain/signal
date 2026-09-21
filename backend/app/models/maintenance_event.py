from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class MaintenanceEvent(Base):
    __tablename__ = "maintenance_events"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    asset_id: Mapped[str] = mapped_column(
        ForeignKey("assets.id"),
        nullable=False,
        index=True,
    )

    event_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    cost: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    maintenance_days_ago: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )