from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Incident(Base):
    __tablename__ = "incidents"

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

    incident_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    impact: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    resolved: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    incident_days_ago: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )