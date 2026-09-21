from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Alert(Base):
    __tablename__ = "alerts"

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

    alert_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    severity: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="Medium",
    )

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    previous_risk: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    current_risk: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    resolved: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )